
    /*"use strict";
    
	console.log(foo); 
	let foo = 2;
	var tmp = 123;

	if (true) {
	  tmp = 'abc'; // ReferenceError
	  let tmp;
	}*/
		// TDZ开始
		/*"use strict";
		tmp = 'abc'; // ReferenceError
		console.log(tmp); // ReferenceError

		let tmp; // TDZ结束
		console.log(tmp); // undefined

		tmp = 123;
		console.log(tmp); // 123*/
		/*"use strict"; 
		var tmp = 123;
		function test(){
			let tmp;
			tmp = 'abc'; // ReferenceError
  			console.log(tmp);
		}
		test();*/
		/*"use strict";
		console.log(typeof x); // ReferenceError
		let x;*/
		/*function bar() {
			y = x;
			x = 2;
		    console.log([x, y]) ;
		}

		bar(); // 报错*/

		/*var tmp = new Date();

		function f(){
		  console.log(tmp);
		  if (false){
		    var tmp = "hello world";
		  }
		}

		f(); // undefined*/
		/*var s = 'hello';

		for (var i = 0; i < s.length; i++){
		  console.log(s[i]);
		}

		console.log(i); // 5*/
		
		/*function f1() {
		  let n = 5;
		  if (true) {
		    let n = 10;
		  }
		  console.log(n); // 5
		}
		f1();*/
		/*{{{{
		  {let insane = 'Hello World'}
		  console.log(insane); // 报错
		}}}};*/
		/*{{{{
		  let insane = 'Hello World';
		  console.log(insane);
		  {let insane = 'Hello World';}
		}}}};*/
		/*function f() { console.log('I am outside!'); }
		(function () {
		  if(false) {
		    // 重复声明一次函数f
		    function f() { console.log('I am inside!'); }
		  }

		  f();
		}());*/
	/*let f;
	{
	  let a = 'secret';
	  f = function () {
	    return a;
	  }
	}
	console.log(f());
	 // "secret"	*/

	/*const PI = 3.1415;
	PI // 3.1415

	PI = 3;
	// TypeError: "PI" is read-only*/
	/*const a = [];
	a.push("Hello"); // 可执行
	a.length = 0;    // 可执行
	a = ["Dave"];    // 报错
	console.log(a);*/
	/*const foo = Object.freeze({});

	// 常规模式时，下面一行不起作用；
	// 严格模式时，该行会报错
	foo.prop = 123;
	console.log(foo);*/
	/*"use strict";
	var a = 1;
	// 如果在Node的REPL环境，可以写成global.a
	// 或者采用通用方法，写成this.a

	console.log(global.a); // 1
	
	let b = 1;
	console.log(global.b); // undefined*/
	"use strict";
	/*var [a, b, c] = [1, 2, 3];*/
	/*let [foo, [[bar], baz]] = [1, [[2], 3]];*/
	var [a, b, c] = [1, 2, 3];
	console.log(a);
	

 
 


			






