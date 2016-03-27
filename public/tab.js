function tabsdisplay(y,z,/*options*/x){ 
	if(x){
		$(x).bind("click",function(){ 
			$(y).css('display','block');
			$(z).css('display','none');
		});
	}else{ 
		$(y).css('display','block');
		$(z).css('display','none');
	}
}; 
function listdisplay(){
	var box1=$("#menuoptions");
	var menuoptions=$("#menuoptions>ul>li>a");
	var containers=$("#center-content>.tab");

	for(var i=0;i<menuoptions.length;i++){  
        menuoptions[i].index=i; 
        menuoptions[i].onclick=function(){
            for(var i=0;i<menuoptions.length;i++){  
             	menuoptions[i].className='menuclickbefore';
             	containers[i].style.display='none';
          	};
          	this.className='active';  
          	containers[this.index].style.display='block';  
       	};
	};
};
function oo(){ 
	$('#changePassword').modal({
        trigger:'#changePassword',          // id or class of link or button to trigger modal
        olay:'div.overlay',             // id or class of overlay
        modals:'div.modal',             // id or class of modal
        animationEffect: 'slideDown',   // overlay effect | slideDown or fadeIn | default=fadeIn
        animationSpeed: 400,            // speed of overlay in milliseconds | default=400
        moveModalSpeed: 'slow',         // speed of modal movement when window is resized | slow or fast | default=false
        background: 'a2d3cd',           // hexidecimal color code - DONT USE #
        opacity: 0.7,                   // opacity of modal |  0 - 1 | default = 0.8
        openOnLoad: false,              // open modal on page load | true or false | default=false
        docClose: true,                 // click document to close | true or false | default=true    
        closeByEscape: true,            // close modal by escape key | true or false | default=true
        moveOnScroll: true,             // move modal when window is scrolled | true or false | default=false
        resizeWindow: true,             // move modal when window is resized | true or false | default=false
        video: 'http://player.vimeo.com/video/2355334?color=eb5a3d',    // enter the url of the video
        videoClass:'video',             // class of video element(s)
        close:'.closeBtn'               // id or class of close button
	});
}
function circletabs(){ 
	var menuoptions=$("#tab2Circle>a>.circle");
	var containers=$("#tab2>.circleTab");

	for(var i=0;i<menuoptions.length;i++){  
        menuoptions[i].index=i; 
        menuoptions[i].onclick=function(){
        	for(var i=0;i<menuoptions.length;i++){  
             	containers[i].style.display='none';
          	};
          	containers[this.index].style.display='block';  
          	$(".tab2Center")[0].style.display='none';
       	};
	};
}

oo();
listdisplay();
circletabs();
tabsdisplay("#tab2Circle","#circleTab1","#chargeReturn1");
tabsdisplay("#tab2Circle","#circleTab2","#chargeReturn2");
tabsdisplay("#circleTab2","#circleTab3","#chargeReturn3");

tabsdisplay("#ontimeTab2","#ontimeTab3","#ontimeReturn1");

tabsdisplay("#memberTab2","#memberTab1","#add-button2");
tabsdisplay("#memberTab1","#memberTab2","#memberReturn");
tabsdisplay("#debtorTab2","#debtorTab1","#add-debtor-button2");
tabsdisplay("#debtorTab1","#debtorTab2","#debtorReturn");
debtListDisplay();
tabsdisplay("#debtTab1","#debtTab2","#debtReturn");
tabsdisplay("#borrowTab1","#borrowTab2","#borrow2Return");
tabsdisplay("#memberTab1","#memberTab3","#deleteReturn");
tabsdisplay("#debtorTab1","#debtorTab3","#deleteReturn1");


//获取和创建所有的家庭成员
function getmembers(){ 
	$.ajax({
		url:"/member",
		type:"post",
		contentType:"application/json",
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error===0){
				$(".memberouter>.member").andSelf().remove();
				var memberList = returnData.msg;
				var str = '<div class="member"><div class="memberName">{#memberName}</div><div class="memberdelete" memberId="{#memberId}">删除</div></div>'
				var str1special=str.replace("{#memberName}",memberList[0].memberName).replace("{#memberId}",memberList[0].memberId);
				$(".memberouter").html(str1special)
				for(var i = 1;i < memberList.length;i ++){
					var jobdetail = str.replace("{#memberName}",memberList[i].memberName).replace("{#memberId}",memberList[i].memberId);
					$(".memberouter>.member:last()").after(jobdetail);
				}
				deletemember();
			}else{ 
				$(".memberouter>.member").andSelf().remove();
				alert(returnData.msg);
			}
		}
	});
};


function deletemembers(id){ 
	$.ajax({
		url:"/memberdelete",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({memberId:id}),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			$("#memberTab3 .returnContent").text(returnData.msg);
			tabsdisplay("#memberTab3","#memberTab1");
		}
	});
};
//删除家庭成员
function deletemember(){ 
	var icon=$(".memberdelete");

	for(var i=0;i<icon.length;i++){ 
		icon[i].index=i;
		icon[i].onclick=function(){ 
			var deleteId=$(this).attr("memberId");
			deletemembers(deleteId);
		}
	}
};
function deletedebtors(id){ 
	$.ajax({
		url:"/debtordelete",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({debtorId:id}),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			$("#debtorTab3 .returnContent").text(returnData.msg);
			tabsdisplay("#debtorTab3","#debtorTab1");
		}
	});
};
//删除债务人员
function deletedebtor(){ 
	var icon=$(".debtordelete");

	for(var i=0;i<icon.length;i++){ 
		icon[i].index=i;
		icon[i].onclick=function(){ 
			var deleteId=$(this).attr("debtorId");
			deletedebtors(deleteId);
		}
	}
};
//获取和创建所有的家庭成员
function getdebtors(){ 
	$.ajax({
		url:"/debtor",
		type:"post",
		contentType:"application/json",
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error===0){
				$(".debtorouter>.debtor").andSelf().remove();
				var debtorList = returnData.msg;
				var str = '<div class="debtor"><div class="debtorName">{#debtorName}</div><div class="debtordelete" debtorId="{#debtorId}">删除</div></div>'
				var str1special=str.replace("{#debtorName}",debtorList[0].debtorName).replace("{#debtorId}",debtorList[0].debtorId);
				$(".debtorouter").html(str1special)
				for(var i = 1;i < debtorList.length;i ++){
					var jobdetail = str.replace("{#debtorName}",debtorList[i].debtorName).replace("{#debtorId}",debtorList[i].debtorId);
					$(".debtorouter>.debtor:last()").after(jobdetail);
				}
				deletedebtor();
			}else{
				$(".debtorouter>.debtor").andSelf().remove(); 
				alert(returnData.msg);
			}
		}
	});
};
/*
function getmemberbyid(id){ 
	var s;
	$.ajax({
		url:"/getmember",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({memberId:id}),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){
				s = returnData.msg;
			}
		}
	});
	return s;
};*/

Date.prototype.format = function(format){
 
 var o = {
  "M+" :  this.getMonth()+1,  //month
  "d+" :  this.getDate(),     //day
  "h+" :  this.getHours(),    //hour
      "m+" :  this.getMinutes(),  //minute
      "s+" :  this.getSeconds(), //second
      "q+" :  Math.floor((this.getMonth()+3)/3),  //quarter
      "S"  :  this.getMilliseconds() //millisecond
   }
 
   if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
   }
 
   for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
   }
 return format;
}

function getspecificbooks(id){ 
	$.ajax({
		url:"/getbook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({booksId:id}),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			var book = returnData.msg[0];
			var myamount;
			if(book.type=='1'&&parseInt(book.amount)>0){ //此处不能用attr，因为attr只有第一次有效
				$("input[name='chargeType']:checked").prop("checked",false);
				$("input[name='chargeType'][value='收入']").prop("checked",true);
			}else if(book.type=='1'&&parseInt(book.amount)<0){ 
				$("input[name='chargeType']:checked").prop("checked",false);
				$("input[name='chargeType'][value='支出']").prop("checked",true);
			}else if(book.type=='2'&&parseInt(book.amount)>0){ 
				$("input[name='chargeType']:checked").prop("checked",false);
				$("input[name='chargeType'][value='借入']").prop("checked",true);
			}else if(book.type=='2'&&parseInt(book.amount)<0){ 
				$("input[name='chargeType']:checked").prop("checked",false);
				$("input[name='chargeType'][value='借出']").prop("checked",true);
			}

			$("input[name='chargeMoney']").prop("value",book.amount);
			var date=new Date(book.time);
			date=date.format("yyyy-MM-dd");
			document.getElementById("myDate").value = date;
			$.ajax({
				url:"/member",
				type:"post",
				contentType:"application/json",
				timeout:5000,
				beforeSend: function(request) {
			         request.setRequestHeader("Access-Control-Allow-Origin","*");
			    },
				dataType:"json",
				success:function(returnData){
					if(returnData.error===0){ 
						var memberList = returnData.msg;
						var obj=document.getElementById('mySelect');  
						$("#mySelect option").andSelf().remove();
  						for(var i=0;i<memberList.length;i++){ 
  											          //添加一个选项  
				          //obj.add(new Option(memberList[i].memberName,memberList[i].memberId));    //这个只能在IE中有效  
				          obj.options.add(new Option(memberList[i].memberName,memberList[i].memberId)); //这个兼容IE与firefox 
  						}
  						var myCheckbox1 = $("#mySelect option");
						for(var i=0;i<myCheckbox1.length;i++){
							if(myCheckbox1[i].value == book.memberId){
								myCheckbox1[i].selected='selected';
							}
						}//决定哪个option处于选中状态   						
					}
				}
			});
			if(book.type==2){
				$.ajax({
					url:"/getuserdebtor",
					type:"get",
					contentType:"application/json",
					timeout:5000,
					beforeSend: function(request) {
				         request.setRequestHeader("Access-Control-Allow-Origin","*");
				    },
					dataType:"json",
					success:function(returnData){
						if(returnData.error===0){ 
							var memberList = returnData.msg;
							var obj=document.getElementById('myDebtor');  
							$("#myDebtor option").andSelf().remove();
	  						for(var i=0;i<memberList.length;i++){ 
	  											          //添加一个选项  
					          //obj.add(new Option(memberList[i].memberName,memberList[i].memberId));    //这个只能在IE中有效  
					          obj.options.add(new Option(memberList[i].debtorName,memberList[i].debtorId)); //这个兼容IE与firefox 
	  						}//new Option("文本","值")
	  						var myCheckbox1 = $("#myDebtor option");
							for(var i=0;i<myCheckbox1.length;i++){
								if(myCheckbox1[i].value == book.debtorId){
									myCheckbox1[i].selected='selected';
								}
							}//决定哪个option处于选中状态   						
						}
					}
				});
			}else{ 
			    $("#myDebtor").find("option").remove(); 
			}
			document.getElementById('myNote').value=book.note;
		}
	});
}

function chargeListDisplay(){ 
	var projectoptions=$(".charge2List>table tr");

    for(var i=1;i<projectoptions.length;i++){ 
    	projectoptions[i].onclick=function(){ 
    		tabsdisplay("#circleTab3","#circleTab2");
    		var booksId=$(this).attr("booksId");
    		$("#modifySubmit").attr("booksId",booksId);
    		$("#modifyDelete").attr("booksId",booksId);
    		getspecificbooks($(this).attr("booksId")); 		
    	};

    };
};

function getbooks(data){ 
	$.ajax({
		url:"/books",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify(data),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){
				var booksType;				
				$(".charge2List>table tr").nextAll().remove();
				var str = '<tr booksId="{#booksId}"><td>{#type}</td><td>{#handler}</td><td>{#cost}</td><td>{#date}</td><td>{#note}</td></tr>';
				var booksList = returnData.msg;
				for(var i = 0;i < booksList.length;i ++){
					if(booksList[i].type=='1'&&parseInt(booksList[i].amount)>0){ 
						booksType="收入";
					}else if(booksList[i].type=='1'&&parseInt(booksList[i].amount)<0){ 
						booksType="支出";
						booksList[i].amount=-booksList[i].amount;
					}else if(booksList[i].type=='2'&&parseInt(booksList[i].amount)>0){ 
						booksType="借入";
					}else if(booksList[i].type=='2'&&parseInt(booksList[i].amount)<0){ 
						booksType="借出";
						booksList[i].amount=-booksList[i].amount
					}
					var date=new Date(booksList[i].time); 
					date= date.format("yyyy/MM/dd");
					var jobdetail =str.replace("{#booksId}",booksList[i].booksId).replace("{#type}",booksType).replace("{#handler}",booksList[i].memberName).replace("{#cost}",booksList[i].amount).replace("{#date}",date).replace("{#note}",booksList[i].note);
					$(".charge2List>table tr:last()").after(jobdetail);	
				}
				chargeListDisplay();
				//获取账户总金额
				getallamount("/getallamount","#allCharge");
				//获取收支总金额
				getallamount("/getincomeamount","#incomeCharge");
				//获取借还总金额
				getallamount("/getcirculateamount","#circulateCharge");
			}else{ 
				alert(returnData.msg);
			}
		}
	});
};

function getallamount(url,id){ 
	$.ajax({
		url:url,
		type:"get",
		contentType:"application/json",
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){ 
			$(id).text(returnData.msg[0].allamount+'元');
		}
	});
}
//获取账户总金额
getallamount("/getallamount","#allCharge");
//获取收支总金额
getallamount("/getincomeamount","#incomeCharge");
//获取借还总金额
getallamount("/getcirculateamount","#circulateCharge");

function modifybookopen(data,id){ 
	$.ajax({
		url:"/updatebook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify(data),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){
				tabsdisplay("#circleTab4","#circleTab3");
				$("#circleTab4>.returnContent").text(returnData.msg);
				tabsdisplay("#circleTab2","#circleTab4","#updateReturn");//updateReturn要实现getbooks()
				//getspecificbooks(id);//实现修改成功，提示，页面跳转，刷新
				$("#mycost").prop("value","");
				//获取账户总金额
				getallamount("/getallamount","#allCharge");
				//获取收支总金额
				getallamount("/getincomeamount","#incomeCharge");
				//获取借还总金额
				getallamount("/getcirculateamount","#circulateCharge");
				getbooks(data);
			}
		}
	});
}

$("#modifySubmit").click(function(e){
	e.preventDefault();
	var data={};
	/*
	var myamount;

	alert($("input[name='chargeType']:checked").val());
	if($("input[name='chargeType']:checked").val()=="支出"||$("input[name='chargeType']:checked").val()=="借出"){
		myamount=-$("#mycost").val();
		alert(myamount);
	}else{ 
		myamount=$("#mycost").val();
		alert(myamount);
	}*/
	//只能修改金额，时间，消费者，备注
	data["amount"]=$("#mycost").val();
	data["time"]=$("#myDate").val();
	data["memberId"]=$('#mySelect option:selected').val();
	data["debtorId"]=$('#myDebtor option:selected').val();
	if(data["debtorId"]==null){ 
		data["debtorId"]='0';
	}
	data["note"]=$("#myNote").val();
	data["booksId"]=$("#modifySubmit").attr("booksId");

	modifybookopen(data,$("#modifySubmit").attr("booksId"));
});
//获取账单记录的数量
function getbooksnumber(url,callback){ 
	$.ajax({
		url:url,
		type:"get",
		contentType:"application/json",
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:callback
	});
}
//查看流水页面账单列表要用到的全局变量
var pageNumber=1;
var recordNumber;
var recordPage=0;
//查看流水页面账单列表总记录数，再将他们转换为总页面数
getbooksnumber("/booksnumber",function(returnData){ 
	recordNumber=returnData.msg;
	recordPage=recordNumber[0].recordNumber/15;
});
//查看流水页面账单列表点击上一页
function forward(){
	var data={};
	if(pageNumber==1){ 
		pageNumber=1;
	}else{
		pageNumber--;
	}
	data["page"]=pageNumber;
	getbooks(data);
}
//查看流水页面账单列表点击下一页
function back(){
	var data={};
	if(pageNumber>recordPage){ 
		pageNumber=Math.ceil(recordPage);
	}else{
		pageNumber++;
	}
	data["page"]=pageNumber;
	getbooks(data);
}

function pageTurn(){ 
	var data={};
	pageNumber=$("#chargeInput").val();
	data["page"]=pageNumber;
	getbooks(data);
}

function bookdelete(data){ 
	$.ajax({
		url:"/deletebook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({"booksId":$("#modifyDelete").attr("booksId")}),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){
				tabsdisplay("#circleTab4","#circleTab3");
				$("#circleTab4>.returnContent").text(returnData.msg);
				tabsdisplay("#circleTab2","#circleTab4","#updateReturn");//updateReturn要实现getbooks()
				getbooks(data);
				//获取账户总金额
				getallamount("/getallamount","#allCharge");
				//获取收支总金额
				getallamount("/getincomeamount","#incomeCharge");
				//获取借还总金额
				getallamount("/getcirculateamount","#circulateCharge");
			}
		}
	});
}

function chargeaccount(){ 
	$.ajax({
		url:"/member",
		type:"post",
		contentType:"application/json",
		timeout:5000,
		beforeSend: function(request) {
	         request.setRequestHeader("Access-Control-Allow-Origin","*");
	    },
		dataType:"json",
		success:function(returnData){
			if(returnData.error===0){ 
				var memberList = returnData.msg;
				var obj=document.getElementById('registratePerson');  
				$("#registratePerson option").andSelf().remove();
					for(var i=0;i<memberList.length;i++){ 
										          //添加一个选项  
		          //obj.add(new Option(memberList[i].memberName,memberList[i].memberId));    //这个只能在IE中有效  
		          obj.options.add(new Option(memberList[i].memberName,memberList[i].memberId)); //这个兼容IE与firefox 
					}
				var myCheckbox1 = $("#registratePerson option");
				myCheckbox1[0].selected='selected';//决定哪个option处于选中状态   						
			}
		}
	});
	$.ajax({
		url:"/getuserdebtor",
		type:"get",
		contentType:"application/json",
		timeout:5000,
		beforeSend: function(request) {
	         request.setRequestHeader("Access-Control-Allow-Origin","*");
	    },
		dataType:"json",
		success:function(returnData){
			if(returnData.error===0){ 
				var memberList = returnData.msg;
				var obj=document.getElementById('registrateDebt');  
				$("#registrateDebt option").nextAll().remove();
					for(var i=0;i<memberList.length;i++){ 
										          //添加一个选项  
		          //obj.add(new Option(memberList[i].memberName,memberList[i].memberId));    //这个只能在IE中有效  
		          obj.options.add(new Option(memberList[i].debtorName,memberList[i].debtorId)); //这个兼容IE与firefox 
					}//new Option("文本","值")
				var myCheckbox1 = $("#registrateDebt option");
				myCheckbox1[0].selected='selected';//决定哪个option处于选中状态   
			}						
		}
	});
	$("#registrateMoney").prop("value","");//将上一次记录的金额框清空
	$("#registrateTime").prop("value","");//将上一次记录的时间框清空
	$("#registrateNote").val('');//将上一次记录的备注框清空
	$("input[name='type']:checked").prop("checked",false);//将记录类型清空
}
tabsdisplay("#tab2Circle","#circleTab6","#lendReturn");
tabsdisplay("#tab2Circle","#circleTab7","#borrowReturn");

function getdetaillendbook(data){ 
	$.ajax({
		url:"/getlendbook",
		type:"get",
		//contentType:"application/json",
		dataType:"json",
		data:data,
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		success:function(returnData){
			if(returnData.error==0){		
				var booksList = returnData.msg;

				for(var i = 0;i < booksList.length;i++){
					var date=new Date(booksList[i].time); 
					date= date.format("yyyy/MM/dd");
					$("#detailName").text(booksList[i].debtorName);	
					$("#detailMember").text(booksList[i].memberName);	
					$("#detailCost").text(-booksList[i].amount);	
					$("#detailTime").text(date);	
					$("#detailNote").text(booksList[i].note);	
				}
				debtListDisplay();
			}else{ 
				alert(returnData.msg);
			}
		}
	});
}

//控制可以查看和删除详细的借出账单记录
function debtListDisplay(){ 
	var projectoptions=$(".debtList tr");

    for(var i=1;i<projectoptions.length;i++){ 
    	var data={};
    	projectoptions[i].onclick=function(){ 
    		tabsdisplay("#debtTab2","#debtTab1");
    		var booksId=$(this).attr("booksId");
    		data["booksId"]=booksId;
    		getdetaillendbook(data);
    		$("#debtDelete").prop("booksId",booksId);
    	};

    };
};
//删除借出的账单记录
function deletedebt(){ 
	var booksId=$("#debtDelete").prop("booksId");
	$.ajax({
		url:"/deletebook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({"booksId":booksId}),
		timeout:5000,
		beforeSend: function(request) {
	         request.setRequestHeader("Access-Control-Allow-Origin","*");
	    },
		dataType:"json",
		success:function(returnData){
			if(returnData.error===0){ 
				tabsdisplay("#debtTab3","#debtTab2");
				$("#debtTab3 .returnContent").text(returnData.msg);	
				tabsdisplay("#debtTab1","#debtTab3","#deletedebtReturn");	
			}
		}
	});
}

//获取所有的借出账单记录
function getlendbooks(url,data){ 
	$.ajax({
		url:url,
		type:"get",
		contentType:"application/json",
		data:data,
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){		
				$("#debtList table tr").nextAll().remove();
				var str = '<tr booksId="{#booksId}"><td>{#debtor}</td><td>{#member}</td><td>{#cost}</td><td>{#date}</td><td>{#note}</td></tr>';
				var booksList = returnData.msg;

				for(var i = 0;i < booksList.length;i++){
					var date=new Date(booksList[i].time); 
					date= date.format("yyyy/MM/dd");
					var jobdetail =str.replace("{#booksId}",booksList[i].booksId).replace("{#debtor}",booksList[i].debtorName).replace("{#member}",booksList[i].memberName).replace("{#cost}",-booksList[i].amount).replace("{#date}",date).replace("{#note}",booksList[i].note);
						$("#debtList table tr:last()").after(jobdetail);	
				}
				debtListDisplay();
			}else{ 
				alert(returnData.msg);
			}
		}
	});
};
//查看借出管理账单列表要用到的全局变量
var debtpageNumber=1;
var debtrecordNumber;
var debtrecordPage=0;

//查看借出页面账单列表总记录数，再将他们转换为总页面数
getbooksnumber("/debtbooksnumber",function(returnData){ 
	debtrecordNumber=returnData.msg;
	debtrecordPage=debtrecordNumber[0].recordNumber/14;
});
//查看流水页面账单列表点击上一页
function debtforward(){
	var data={};
	if(debtpageNumber==1){ 
		debtpageNumber=1;
	}else{
		debtpageNumber--;
	}
	data["page"]=debtpageNumber;
	getlendbooks("/getlendbook",data);
}
//查看流水页面账单列表点击下一页
function debtback(){
	var data={};
	if(debtpageNumber>debtrecordPage){ 
		debtpageNumber=Math.ceil(debtrecordPage);
	}else{
		debtpageNumber++;
	}
	data["page"]=debtpageNumber;
	getlendbooks("/getlendbook",data);
}


//控制可以查看和删除详细的借入账单记录
function borrowListDisplay(){ 
	var projectoptions=$("#borrowList tr");

    for(var i=1;i<projectoptions.length;i++){ 
    	var data={};
    	projectoptions[i].onclick=function(){ 
    		tabsdisplay("#borrowTab2","#borrowTab1");
    		var booksId=$(this).attr("booksId");
    		data["booksId"]=booksId;
    		getdetailborrowbook(data);
    		$("#borrowDelete").prop("booksId",booksId);
    	};

    };
};

//删除借入的账单记录
function deleteborrow(){ 
	var booksId=$("#borrowDelete").prop("booksId");
	$.ajax({
		url:"/deletebook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({"booksId":booksId}),
		timeout:5000,
		beforeSend: function(request) {
	         request.setRequestHeader("Access-Control-Allow-Origin","*");
	    },
		dataType:"json",
		success:function(returnData){
			if(returnData.error===0){ 
				tabsdisplay("#borrowTab3","#borrowTab2");
				$("#borrowTab3 .returnContent").text(returnData.msg);	
				tabsdisplay("#borrowTab1","#borrowTab3","#deleteborrowReturn");	
			}
		}
	});
}
//获取详细的借入账单记录
function getdetailborrowbook(data){ 
	$.ajax({
		url:"/getlendbook",
		type:"get",
		//contentType:"application/json",
		dataType:"json",
		data:data,
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		success:function(returnData){
			if(returnData.error==0){		
				var booksList = returnData.msg;

				for(var i = 0;i < booksList.length;i++){
					var date=new Date(booksList[i].time); 
					date= date.format("yyyy/MM/dd");
					$("#borrowDetailName").text(booksList[i].debtorName);	
					$("#borrowDetailMember").text(booksList[i].memberName);	
					$("#borrowDetailCost").text(booksList[i].amount);	
					$("#borrowDetailTime").text(date);	
					$("#borrowDetailNote").text(booksList[i].note);	
				}
				borrowListDisplay();
			}else{ 
				alert(returnData.msg);
			}
		}
	});
}

//获取所有的借入账单记录
function getborrowbooks(url,data){ 
	$.ajax({
		url:url,
		type:"get",
		contentType:"application/json",
		data:data,
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){		
				$("#borrowList table tr").nextAll().remove();
				var str = '<tr booksId="{#booksId}"><td>{#debtor}</td><td>{#member}</td><td>{#cost}</td><td>{#date}</td><td>{#note}</td></tr>';
				var booksList = returnData.msg;

				for(var i = 0;i < booksList.length;i++){
					var date=new Date(booksList[i].time); 
					date= date.format("yyyy/MM/dd");
					var jobdetail =str.replace("{#booksId}",booksList[i].booksId).replace("{#debtor}",booksList[i].debtorName).replace("{#member}",booksList[i].memberName).replace("{#cost}",booksList[i].amount).replace("{#date}",date).replace("{#note}",booksList[i].note);
						$("#borrowList table tr:last()").after(jobdetail);	
				}
				borrowListDisplay();
			}else{ 
				alert(returnData.msg);
			}
		}
	});
};


//查看借入管理账单列表要用到的全局变量
var borrowpageNumber=1;
var borrowrecordNumber;
var borrowrecordPage=0;

//查看借入页面账单列表总记录数，再将他们转换为总页面数
getbooksnumber("/borrowbooksnumber",function(returnData){ 
	borrowrecordNumber=returnData.msg;
	borrowrecordPage=borrowrecordNumber[0].recordNumber/14;
});
//查看流水页面账单列表点击上一页
function borrowforward(){
	var data={};
	if(borrowpageNumber==1){ 
		borrowpageNumber=1;
	}else{
		borrowpageNumber--;
	}
	data["page"]=borrowpageNumber;
	getborrowbooks("/getborrowbook",data);
}
//查看流水页面账单列表点击下一页
function borrowback(){
	var data={};
	if(borrowpageNumber>borrowrecordPage){ 
		borrowpageNumber=Math.ceil(borrowrecordPage);
	}else{
		borrowpageNumber++;
	}
	data["page"]=borrowpageNumber;
	getborrowbooks("/getborrowbook",data);
}


//查看按时查找账单列表要用到的全局变量
var ontimepageNumber=1;
var ontimerecordNumber;
var ontimerecordPage=0;

//获取账单记录的数量
function getontimebooksnumber(url,callback){ 
	var time1=$("#time1").val();
	var time2=$("#time2").val();
	$.ajax({
		url:url,
		type:"get",
		data:{time1:time1,time2:time2},
		contentType:"application/json",
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:callback
	});
}
//按时查找查找相应的记录
function getontimespecificbooks(id){ 
	$.ajax({
		url:"/getbook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({booksId:id}),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			var book = returnData.msg[0];
			var myamount;
			if(book.type=='1'&&parseInt(book.amount)>0){ //此处不能用attr，因为attr只有第一次有效
				$("input[name='ontimeType']:checked").prop("checked",false);
				$("input[name='ontimeType'][value='收入']").prop("checked",true);
			}else if(book.type=='1'&&parseInt(book.amount)<0){ 
				$("input[name='ontimeType']:checked").prop("checked",false);
				$("input[name='ontimeType'][value='支出']").prop("checked",true);
			}else if(book.type=='2'&&parseInt(book.amount)>0){ 
				$("input[name='ontimeType']:checked").prop("checked",false);
				$("input[name='ontimeType'][value='借入']").prop("checked",true);
			}else if(book.type=='2'&&parseInt(book.amount)<0){ 
				$("input[name='ontimeType']:checked").prop("checked",false);
				$("input[name='ontimeType'][value='借出']").prop("checked",true);
			}

			$("input[name='ontimeMoney']").prop("value",book.amount);
			var date=new Date(book.time);
			date=date.format("yyyy-MM-dd");
			document.getElementById("myOntimeDate").value = date;
			$.ajax({
				url:"/member",
				type:"post",
				contentType:"application/json",
				timeout:5000,
				beforeSend: function(request) {
			         request.setRequestHeader("Access-Control-Allow-Origin","*");
			    },
				dataType:"json",
				success:function(returnData){
					if(returnData.error===0){ 
						var memberList = returnData.msg;
						var obj=document.getElementById('myOntimeSelect');  
						$("#myOntimeSelect option").andSelf().remove();
  						for(var i=0;i<memberList.length;i++){ 
  											          //添加一个选项  
				          //obj.add(new Option(memberList[i].memberName,memberList[i].memberId));    //这个只能在IE中有效  
				          obj.options.add(new Option(memberList[i].memberName,memberList[i].memberId)); //这个兼容IE与firefox 
  						}
  						var myCheckbox1 = $("#myOntimeSelect option");
						for(var i=0;i<myCheckbox1.length;i++){
							if(myCheckbox1[i].value == book.memberId){
								myCheckbox1[i].selected='selected';
							}
						}//决定哪个option处于选中状态   						
					}
				}
			});
			if(book.type==2){
				$.ajax({
					url:"/getuserdebtor",
					type:"get",
					contentType:"application/json",
					timeout:5000,
					beforeSend: function(request) {
				         request.setRequestHeader("Access-Control-Allow-Origin","*");
				    },
					dataType:"json",
					success:function(returnData){
						if(returnData.error===0){ 
							var memberList = returnData.msg;
							var obj=document.getElementById('myOntimeDebtor');  
							$("#myOntimeDebtor option").andSelf().remove();
	  						for(var i=0;i<memberList.length;i++){ 
	  											          //添加一个选项  
					          //obj.add(new Option(memberList[i].memberName,memberList[i].memberId));    //这个只能在IE中有效  
					          obj.options.add(new Option(memberList[i].debtorName,memberList[i].debtorId)); //这个兼容IE与firefox 
	  						}//new Option("文本","值")
	  						var myCheckbox1 = $("#myOntimeDebtor option");
							for(var i=0;i<myCheckbox1.length;i++){
								if(myCheckbox1[i].value == book.debtorId){
									myCheckbox1[i].selected='selected';
								}
							}//决定哪个option处于选中状态   						
						}
					}
				});
			}else{ 
			    $("#myOntimeDebtor").find("option").remove(); 
			}
			document.getElementById('myOntimeNote').value=book.note;
		}
	});
}
//按时查找点击列表做相应的跳转
function ontimeListDisplay(){ 
	var projectoptions=$("#ontimeList table tr");

    for(var i=1;i<projectoptions.length;i++){ 
    	projectoptions[i].onclick=function(){ 
    		tabsdisplay("#ontimeTab3","#ontimeTab2");
    		var booksId=$(this).attr("booksId");
    		$("#ontimeModifySubmit").attr("booksId",booksId);
    		$("#ontimeModifyDelete").attr("booksId",booksId);
    		getontimespecificbooks($(this).attr("booksId")); 		
    	};

    };
};
//实现按时查找相应记录的删除
function ontimebookdelete(){ 
	$.ajax({
		url:"/deletebook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify({"booksId":$("#ontimeModifyDelete").attr("booksId")}),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){
				tabsdisplay("#ontimeTab4","#ontimeTab3");
				$("#ontimeTab4>.returnContent").text(returnData.msg);
				tabsdisplay("#ontimeTab2","#ontimeTab4","#ontimeReturn2");//updateReturn要实现getbooks()
				periodsubmit(pageo);
			}
		}
	});
}

//按时查找查找一段时间内做相应的页面跳转，和内容的呈现
function periodsubmit(page){

	var data={};

	data["time1"]=$("#time1").val();
	data["time2"]=$("#time2").val();
	if(!page){ 
		data["page"]="1"
	}else{ 
		data["page"]=page;
	}

	$.ajax({
		url:"/getperiodcost",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify(data),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){		
				tabsdisplay("#ontimeTab2","#ontimeTab1");
				tabsdisplay("#ontimeTab1","#ontimeTab2","#ontimeReturn");
				$("#ontimeList table tr").nextAll().remove();
				var str = '<tr booksId="{#booksId}"><td>{#type}</td><td>{#member}</td><td>{#cost}</td><td>{#date}</td><td>{#note}</td></tr>';
				var booksList = returnData.msg;
				var booksType;


				for(var i = 0;i < booksList.length;i++){
					if(booksList[i].type=='1'&&parseInt(booksList[i].amount)>0){ 
						booksType="收入";
					}else if(booksList[i].type=='1'&&parseInt(booksList[i].amount)<0){ 
						booksType="支出";
						booksList[i].amount=-booksList[i].amount;
					}else if(booksList[i].type=='2'&&parseInt(booksList[i].amount)>0){ 
						booksType="借入";
					}else if(booksList[i].type=='2'&&parseInt(booksList[i].amount)<0){ 
						booksType="借出";
						booksList[i].amount=-booksList[i].amount
					}

					var date=new Date(booksList[i].time); 
					date= date.format("yyyy/MM/dd");
					var jobdetail =str.replace("{#booksId}",booksList[i].booksId).replace("{#type}",booksType).replace("{#member}",booksList[i].memberName).replace("{#cost}",booksList[i].amount).replace("{#date}",date).replace("{#note}",booksList[i].note);
					$("#ontimeList table tr:last()").after(jobdetail);	
				}
				//查看按时页面账单列表总记录数，再将他们转换为总页面数
				getontimebooksnumber("/ontimebooksnumber",function(returnData){ 
					ontimerecordNumber=returnData.msg;
					ontimerecordPage=ontimerecordNumber[0].recordNumber/14;
				});
				ontimeListDisplay();
			}else{ 
				alert(returnData.msg);
			}
		}
	});
};

function modifyontimebookopen(data,id){ 
	$.ajax({
		url:"/updatebook",
		type:"post",
		contentType:"application/json",
		data:JSON.stringify(data),
		timeout:5000,
		beforeSend: function(request) {
             request.setRequestHeader("Access-Control-Allow-Origin","*");
        },
		dataType:"json",
		success:function(returnData){
			if(returnData.error==0){
				tabsdisplay("#ontimeTab4","#ontimeTab3");
				$("#ontimeTab4>.returnContent").text(returnData.msg);
				tabsdisplay("#ontimeTab2","#ontimeTab4","#ontimeReturn2");//updateReturn要实现getbooks()
				//getspecificbooks(id);//实现修改成功，提示，页面跳转，刷新
				$("#myOntimeCost").prop("value","");
				periodsubmit(pageo);
			}
		}
	});
}

$("#ontimeModifySubmit").click(function(e){
	e.preventDefault();
	var data={};
	/*
	var myamount;

	alert($("input[name='chargeType']:checked").val());
	if($("input[name='chargeType']:checked").val()=="支出"||$("input[name='chargeType']:checked").val()=="借出"){
		myamount=-$("#mycost").val();
		alert(myamount);
	}else{ 
		myamount=$("#mycost").val();
		alert(myamount);
	}*/
	//只能修改金额，时间，消费者，备注
	data["amount"]=$("#myOntimeCost").val();
	data["time"]=$("#myOntimeDate").val();
	data["memberId"]=$('#myOntimeSelect option:selected').val();
	data["debtorId"]=$('#myOntimeDebtor option:selected').val();
	if(data["debtorId"]==null){ 
		data["debtorId"]='0';
	}
	data["note"]=$("#myOntimeNote").val();
	data["booksId"]=$("#ontimeModifySubmit").attr("booksId");

	modifyontimebookopen(data,$("#ontimeModifySubmit").attr("booksId"));
});

//查看按时页面账单列表点击上一页
function ontimeforward(){
	var data={};

	if(ontimepageNumber==1){ 
		ontimepageNumber=1;
	}else{
		ontimepageNumber--;
	}
	periodsubmit(ontimepageNumber);
}
//查看按时页面账单列表点击下一页
function ontimeback(){
	var data={};

	if(ontimepageNumber>ontimerecordPage){ 
		ontimepageNumber=Math.ceil(ontimerecordPage);
	}else{
		ontimepageNumber++;
	}
	periodsubmit(ontimepageNumber);
}















