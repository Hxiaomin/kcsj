function yowoajax( o ){

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
             
              		var resp =  JSON.parse( httpRequest.responseText);
              		if(resp.error){ 
              			if(resp.error===1000){ 
              				window.location.href = '/login.html';
              			}

              		}
                    if(o.success){
                        o.success(resp );
                    }
              }
            }
    };

    httpRequest.open( o.method ? o.method:'GET',  o.url, true);
    var data = null;
    if(o.data){
        if(  typeof o.data ==='string' ){
            data = o.data;
            httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }else if(typeof o.data ==='object'){
            data = JSON.stringify(o.data);
            httpRequest.setRequestHeader('Content-Type', 'application/json');
        }
    }
    httpRequest.send( data );
}

function  formSumit( dom,callback ){

$(dom).submit(function(e) {
     e.preventDefault();
     var o = $(this);
     var data = {};
     o.serializeArray().forEach(function(v) {
         data[v.name] = v.value;
     });
     yowoajax({
         url: o.attr('action'),
         method: 'POST',
         data: data,
         success: callback
     });
     return false;
 });

}
