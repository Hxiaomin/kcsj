function yowoajax( o ){

    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function(){
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
              if (httpRequest.status === 200) {
                    if(o.success){
                        o.success( JSON.parse( httpRequest.responseText) );
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

$( dom ).submit(function(e){
    e.preventDefault();
    var  form = $(this);
    var data = {};


    form.find('input,textarea,select').each(function(k,v){
        var name  =  v.getAttribute('name');
        if(!name) return;
        data[name] = v.value;

    });

    yowoajax( {
        url: form.attr('action'),
        method:'POST',
        data:data,
        success: callback
    } );
    return false;
});

}