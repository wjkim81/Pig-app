/*
document.getElementById('getFile').onclick = function() {
  document.getElementById('csvFile').click();
};

$('input[type=file]').change(function (e) {
  $('#customfileupload').html($(this).val());
});
*/

//var xhr = new XMLHttpRequest();

//httpChannel.setRequestHeader("X-Hello", "World", false);
/*
(function(send) {
  XMLHttpRequest.prototype.send = function(data) {
  // in this case I'm injecting an access token (eg. accessToken) in the request headers before it gets sent
    if('Hello') this.setRequestHeader('x-access-token', 'Hello');
      send.call(this, data);
  };
})(XMLHttpRequest.prototype.send);
*/

/*
var invocation = new XMLHttpRequest();

function alertContents() {
  console.log('testtesttest1111');
  if (invocation.readyState === 4) {
    //console.log('testtesttest2222');
    if (invocation.status === 200) {
      //console.log('testtesttest3333');
      console.log(invocation.responseText);
      //localStorage.setItem('superlogin.session', httpRequest.responseText);
    } else if (invocation.status === 401) {
      alert('Login failed');
    } else {
      alert('There was a problem with the request.');
    }
  }
}

var url = window.location.href;
//var url = 'http://localhost:3000/';
console.log(url);

var session = JSON.parse(localStorage.getItem('superlogin.session'));
//console.log(session);
//console.log(session.token);
//console.log(session.password);

var token = `Bearer ${session.token}:${session.password}`
console.log(token);

function authorizeWithToken(){
  if(invocation && session) {

    invocation.onreadystatechange = alertContents;
    invocation.open('GET', url, true);
    invocation.setRequestHeader('Authorization', token);
    //invocation.onreadystatechange = handler;
    invocation.send(); 
  }
}
authorizeWithToken();
*/

