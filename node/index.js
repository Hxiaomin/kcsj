var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();

app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', function(req, res){
	console.log(req.baseUrl); // /gree
  res.send('hello world');
});

var loginedUsers = {'k0hecmr6bt9':{"id":7,"username":"xxx","password":"123456"}};
//==================================================
//用户注册
app.post('/reg', function (req, res) {
	var username = req.body.username;
	var password1 = req.body.password1;
	var password2 = req.body.password2;
	console.log(username);

	if(password1!=password2){ 
		res.json({error:1,msg:"密码输入不一致！"});
	}else{
		var connection = getMySQL();
		connection.connect();
		connection.query('SELECT * FROM users WHERE username=?',[username],function(err,result){ 
			if (result.length==0) { 
				connection.query('INSERT INTO users SET ?', {username:username,password:password1}, function(err, result) {
					if (err) throw err;
					//console.log(result.id);
					res.json({error:0,msg:"注册成功！"});
				});
			}else{ 
				res.json({error:1,msg:"该用户已存在！"});
			}
			connection.end();
		});
		
	}
  //console.log(req.body);
  //res.json(req.body);
});

//==================================================
//用户登录
app.post('/login', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT * FROM users WHERE username = ? and password=? limit 1', [username,password], function(err, result) {

	  if (err || result.length ===0 ){ 
	  	res.json({error:1,msg:"密码不正确。。。"});
	  }else{
	  	var sid = Math.random().toString(36).substring(7);
	  	loginedUsers[sid] = result[0];
	  	res.cookie('sid', sid, { expires: new Date(Date.now() +  864000000 ), httpOnly: true });
	  	res.json({error:0,msg:"登录成功"});
	  } 
	});
 
	connection.end();
});


//==================================================
//修改密码
app.post('/changepassword',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var password1=req.body.password1;
	var password2=req.body.password2;
	var password3=req.body.password3;
	if(password2!=password3){ 
		res.json({error:1,msg:"密码输入不一致！"});
	}else{

		var connection = getMySQL();
		connection.connect();
		connection.query('SELECT * FROM users WHERE id=? and password=?', [user.id,password1], function(err, result) {
			if (result.length==0) { 
				res.json({error:1,msg:"当前密码输入不正确！"});
				connection.end();
			}else{ 
				connection.query('UPDATE users set password=? WHERE id = ?',[password2,user.id],function(err,result){ 
					if (err) throw err;
					res.json({error:0,msg:"修改成功！"});
					connection.end();
				});
			}
			
		});
	}

})

//==================================================
//修改用户名
app.post('/changeusername',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var username=req.body.username;

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT * FROM users WHERE id=? and username=?', [user.id,username], function(err, result) {
		if (result.length==1) { 
			res.json({error:1,msg:"修改的用户名与当前用户名一样，请重新输入！"});
			connection.end();
		}else{ 
			connection.query('UPDATE users set username=? WHERE id = ?',[username,user.id],function(err,result){ 
				if (err) throw err;
				res.json({error:0,msg:"修改成功！"});
				connection.end();
			});
		}
		
	});


})

//==================================================
//添加家庭成员与查看所有家庭成员
app.post('/member',function(req,res){
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var name  = req.body.memberName;
	var action = req.body.action;
	var connection = getMySQL();
	connection.connect();
	console.log(action);
	if(action=='add'){ 
		connection.query('SELECT * FROM members WHERE memberName = ? and id = ?',[name,user.id], function(err, result) {
			if(err) throw err;
			if(result.length ===0){ 
				connection.query('INSERT INTO members SET ?', {memberName:name,id:user.id}, function(err, result) {
					if (err) throw err;
					res.json({error:0,msg:"添加成功！"});
 				});
			}else{ 
				res.json({error:1,msg:"该成员已存在!添加失败"});
			}
			connection.end();
 		});
		
	 }else{ 
	 	connection.query('SELECT * FROM members WHERE id = ? ',[user.id],function(err, result) {
	 		if (result.length ===0){	  			
	 			res.json({error:1,msg:"当前账户尚无家庭成员，赶紧创建吧！"});
	 		}else{
	  			res.json({error:0,msg:result});
	  		}
	  		connection.end();
	 	});
	 }
});
//==================================================
//获取家庭成员的名字
app.post('/getmember',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var memberId = req.body.memberId;
	var connection = getMySQL();

	connection.query('SELECT * FROM members WHERE memberId = ? limit 1',[memberId], function(err, result) { 
		if (err) throw err;
		res.json({error:0,msg:result[0].memberName});
	});


});
//==================================================
//删除家庭成员
app.post('/memberdelete',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var memberId  = req.body.memberId;
	var connection = getMySQL();
	connection.connect();
	connection.query('DELETE FROM members WHERE memberId = ? limit 1', [memberId], function(err, result) {
		if (err) throw err;
		res.json({error:0,msg:"删除成功!"});
	});
 
	connection.end();
});
//==================================================
//添加债务人与查看所有债务人员
app.post('/debtor',function(req,res){
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var name  = req.body.debtorName;
	var action = req.body.action;
	var connection = getMySQL();
	connection.connect();
	if(action=='add'){ 
		connection.query('SELECT association.id FROM debtors,association WHERE debtors.debtorId=association.debtorId and debtorName = ? and id = ?',[name,user.id], function(err, result) {
			if(err) throw err;
			if(result==user.id){
				res.json({error:1,msg:"该成员已存在!添加失败"});
				connection.end();
			}else{
				if(result.length ===0){ 
					connection.query('INSERT INTO debtors SET ?', {debtorName:name}, function(err, result) {
						if (err) throw err;
						connection.query('SELECT debtorId FROM debtors WHERE debtorName=? limit 1', [name],function(err,result){ 
							if (err) throw err;
							connection.query('INSERT INTO association SET ?', {debtorId:result[0].debtorId,id:user.id},function(err,result){ 
								if (err) throw err;
								res.json({error:0,msg:"添加成功！"});
								connection.end();
							});
						});
	 				});
				}
			}
 		});
		
	 }else{ 
	 	connection.query('SELECT association.debtorId,debtors.debtorName FROM association,debtors WHERE association.debtorId=debtors.debtorId and id = ? ',[user.id],function(err, result) {
	 		if (result.length ===0){	  			
	 			res.json({error:1,msg:"当前账户尚无债务人员，赶紧创建吧！"});
	 		}else{
	  			res.json({error:0,msg:result});
	  		}
	  		connection.end();
	 	});
	 }
});

//==================================================
//根据债务人的编号查找债务人的名字
app.post('/getdebtor',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var debtorId=req.body.debtorId;

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT debtorName FROM debtors WHERE debtorId = ? limit 1', [debtorId], function(err, result) {
		if (result.length===0) { 
			res.json({error:1,msg:""});
		}else{
			res.json({error:0,msg:result});
		}
	});
 
	connection.end();
});

//==================================================
//获取账号的债务人
app.get('/getuserdebtor',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var debtorId=req.body.debtorId;

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT debtors.debtorName,debtors.debtorId FROM association,debtors WHERE association.debtorId=debtors.debtorId and association.id = ?', [user.id], function(err, result) {
		if (result.length===0) { 
			res.json({error:1,msg:""});
		}else{
			res.json({error:0,msg:result});
		}
	});
 
	connection.end();
});

//==================================================
//删除债务人员
app.post('/debtordelete',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var debtorId  = req.body.debtorId;
	var connection = getMySQL();
	connection.connect();
	connection.query('DELETE FROM debtors WHERE debtorId = ? limit 1', [debtorId], function(err, result) {
		if (err) throw err;
		connection.query('DELETE FROM association WHERE debtorId = ? limit 1', [debtorId], function(err, result) {
			if (err) throw err;
			res.json({error:0,msg:"删除成功!"});
			connection.end();
		});
	});
 
});
//==================================================
//按提交的页面数，获取相应页面的记录
app.post('/books',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var page  = req.body.page;
	if(!page) page=1;
	console.log(page);
	var perPage = 15;

	var start = (page-1)*15;

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT books.booksId,books.type,members.memberName,books.debtorId,books.amount,books.note,books.time,books.memberId FROM books,members WHERE books.memberId=members.memberId and books.id = ? ORDER BY books.time limit ?, ? ', [user.id,start,perPage], function(err, result) {
		if (err) throw err;
		res.json({error:0,msg:result});
	});
 
	connection.end();

});
//==================================================
//获取查看流水账单总记录数
app.get('/booksnumber',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});


	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT COUNT(*) AS recordNumber FROM books WHERE id = ? ', [user.id], function(err, result) {
		res.json({error:0,msg:result});
	});
 
	connection.end();

});

//==================================================
//获取所有的账单记录（连接查询以便知道消费者的名字）
app.post('/getbook',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var booksId=req.body.booksId;

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT books.booksId,books.type,members.memberName,books.debtorId,books.amount,books.note,books.time,books.memberId FROM books,members WHERE books.memberId=members.memberId and books.id = ? and books.booksId= ? limit 1', [user.id,booksId], function(err, result) {
		console.log(result);
		res.json({error:0,msg:result});
	});
 
	connection.end();

});

//==================================================
//更改账单的记录
app.post('/updatebook',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var booksId=req.body.booksId;
	var amount=req.body.amount;
	var time=req.body.time;
	var memberId=req.body.memberId;
	var debtorId=req.body.debtorId;
	var note=req.body.note;

	var connection = getMySQL();
	connection.connect();
	connection.query('UPDATE books set amount=?,time=?,debtorId=?,memberId=?,note=? WHERE books.booksId = ?', [amount,time,debtorId,memberId,note,booksId], function(err, result) {
		
		res.json({error:0,msg:"修改成功！"});
	});
 
	connection.end();

})

//==================================================
//获取账户总金额
app.get('/getallamount',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT SUM(amount) AS allamount FROM books WHERE id = ?', [user.id], function(err, result) {
		if (err) throw err;
		res.json({error:0,msg:result});
	});
 
	connection.end();
});

//==================================================
//获取收支总金额
app.get('/getincomeamount',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT SUM(amount) AS allamount FROM books WHERE id = ? and type="1" ', [user.id], function(err, result) {
		if (err) throw err;
		res.json({error:0,msg:result});
	});
 
	connection.end();
});

//==================================================
//获取借还总金额
app.get('/getcirculateamount',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT SUM(amount) AS allamount FROM books WHERE id = ? and type="2" ', [user.id], function(err, result) {
		if (err) throw err;
		res.json({error:0,msg:result});
	});
 
	connection.end();
});

//==================================================
//删除账单记录
app.post('/deletebook',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var booksId=req.body.booksId;

	var connection = getMySQL();
	connection.connect();
	connection.query('DELETE FROM books WHERE booksId = ? limit 1', [booksId], function(err, result) {
		if (err) throw err;
		res.json({error:0,msg:"删除成功！"});
	});
 
	connection.end();
});
//==================================================
//插入账单记录
app.post('/addbook',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var booksId=req.body.booksId;
	var type=req.body.type;
	var memberId=req.body.memberId;
	var debtorId=req.body.debtorId;
	var amount=req.body.amount;
	var note=req.body.note;
	var time=req.body.time;
	if(debtorId==""){ 
		debtorId="0";
	}
	

	var connection = getMySQL();
	connection.connect();
	connection.query('INSERT INTO books SET ?', {booksId:booksId,type:type,id:user.id,memberId:memberId,debtorId:debtorId,amount:amount,note:note,time:time}, function(err, result) {
		if (err) throw err;
		res.json({error:0,msg:"添加成功！"});
	});
 
	connection.end();
});

//==================================================
//获取借出账单总记录数
app.get('/debtbooksnumber',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});


	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT COUNT(*) AS recordNumber FROM books WHERE id = ? and type="2" and amount<"0" ', [user.id], function(err, result) {
		res.json({error:0,msg:result});
	});
 
	connection.end();

});
//==================================================
//获取借入账单总记录数
app.get('/borrowbooksnumber',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});


	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT COUNT(*) AS recordNumber FROM books WHERE id = ? and type="2" and amount>"0" ', [user.id], function(err, result) {
		res.json({error:0,msg:result});
	});
 
	connection.end();

});
//==================================================
//获取所有借出的账单记录（连接查询以便知道债务者和消费者的名字）
app.get('/getlendbook',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var booksId=req.query.booksId;
	var page  = req.query.page;
	if(!page) page=1;
	console.log(page);
	var perPage = 14;

	var start = (page-1)*14;

	var connection = getMySQL();
	if(!booksId){
		connection.connect();
		connection.query('SELECT books.booksId,members.memberName,debtors.debtorName,books.amount,books.note,books.time FROM books,members,debtors WHERE books.memberId=members.memberId and books.debtorId=debtors.debtorId and books.id = ? and books.type="2" and books.amount<"0" ORDER BY books.time limit ?, ?', [user.id,start,perPage], function(err, result) {
			if(err) throw err;
			if (result.length ===0){	  			
					res.json({error:1,msg:"没有更多借出记录"});
				}else{ 
					res.json({error:0,msg:result});
				}
		});

		connection.end();
	}else{ 
		connection.connect();
		connection.query('SELECT books.booksId,members.memberName,debtors.debtorName,books.amount,books.note,books.time FROM books,members,debtors WHERE books.memberId=members.memberId and books.debtorId=debtors.debtorId and books.booksId=? limit 1', [booksId], function(err, result) {
			if(err) throw err;
			if (result.length ===0){	  			
					res.json({error:1,msg:"改记录不存在"});
				}else{ 
					res.json({error:0,msg:result});
				}
		});

		connection.end();
	}

});
//==================================================
//获取所有借入的账单记录（连接查询以便知道债务者和消费者的名字）
app.get('/getborrowbook',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var booksId=req.query.booksId;
	var page  = req.query.page;
	if(!page) page=1;
	console.log(page);
	var perPage = 14;

	var start = (page-1)*14;

	var connection = getMySQL();
	if(!booksId){
		connection.connect();
		connection.query('SELECT books.booksId,members.memberName,debtors.debtorName,books.amount,books.note,books.time FROM books,members,debtors WHERE books.memberId=members.memberId and books.debtorId=debtors.debtorId and books.id = ? and books.type="2" and books.amount>"0" ORDER BY books.time limit ?, ?', [user.id,start,perPage], function(err, result) {
			if(err) throw err;
			if (result.length ===0){	  			
					res.json({error:1,msg:"没有更多借入记录"});
				}else{ 
					res.json({error:0,msg:result});
				}
		});

		connection.end();
	}else{ 
		connection.connect();
		connection.query('SELECT books.booksId,members.memberName,debtors.debtorName,books.amount,books.note,books.time FROM books,members,debtors WHERE books.memberId=members.memberId and books.debtorId=debtors.debtorId and books.booksId=? limit 1', [booksId], function(err, result) {
			if(err) throw err;
			if (result.length ===0){	  			
					res.json({error:1,msg:"改记录不存在"});
				}else{ 
					res.json({error:0,msg:result});
				}
		});

		connection.end();
	}

});
//==================================================
//获取按时查找账单总记录数
app.get('/ontimebooksnumber',function(req,res){

	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});


	var time1=req.query.time1;
	var time2=req.query.time2;

	var connection = getMySQL();
	connection.connect();
	connection.query('SELECT COUNT(*) AS recordNumber FROM books WHERE books.id = ? and books.time>=? and books.time<=? ', [user.id,time1,time2], function(err, result) {
		res.json({error:0,msg:result});
	});
 
	connection.end();

});
//==================================================
//查询某一时间段内的消费金额
app.post('/getperiodcost',function(req,res){ 
	var user = getUser(req);
	if(!user ) return res.json({error:1000,msg:"请先登录"});

	var time1=req.body.time1;
	var time2=req.body.time2;
	var booksId=req.body.booksId;
	var page  = req.body.page;
	if(!page) page=1;
	console.log(page);
	var perPage = 14;
	console.log(time1);
	console.log(time2);

	var start = (page-1)*14;

	var connection = getMySQL();
	connection.connect();
	if(!booksId){
		connection.query('SELECT books.booksId,books.type,members.memberName,books.debtorId,books.amount,books.note,books.time,books.memberId FROM books,members WHERE books.memberId=members.memberId and books.id = ? and books.time>=? and books.time<=?  ORDER BY books.time limit ?, ?', [user.id,time1,time2,start,perPage], function(err, result) {
			if(err) throw err;
			if (result.length ===0){	  			
				res.json({error:1,msg:"没有更多记录"});
			}else{ 
				res.json({error:0,msg:result});
			}
		});
	}else{ 
		connection.query('SELECT books.booksId,members.memberName,debtors.debtorName,books.amount,books.note,books.time FROM books,members,debtors WHERE books.memberId=members.memberId and books.debtorId=debtors.debtorId and books.booksId=? limit 1', [booksId], function(err, result) {
			if(err) throw err;
			if (result.length ===0){	  			
					res.json({error:1,msg:"改记录不存在"});
				}else{ 
					res.json({error:0,msg:result});
				}
		});
	}
	connection.end();
});


//===================================================
//根据cookies获取相应的用户返回
app.get('/user', function(req, res){
	var user = getUser(req);
 	if( !user ){ 
 		res.json({error:1000,msg:"请先登录"});
 		return;
 	}

   res.json( getUser(req) );
 
});

//===================================================
//获取登录用户的cookie，返回相应的用户
function getUser(req){ 
	var sid = req.cookies.sid;
	if(!sid) return null;
	return loginedUsers[sid];
}

//==================================================
//数据库连接
function getMySQL(){ 
 var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  database : 'test',
  port     : 3307,
});
 return connection;
}

//==================================================
//监听端口
app.listen(3000);




