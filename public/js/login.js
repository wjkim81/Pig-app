var session;

$(document).ready(function() {
  var credentials;
  var httpRequest;

  document.getElementById("loginButton").onclick = function() {
    //console.log(credentials);

    makeRequest('/auth/login/'); 
  };

  function makeRequest(url) {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    credentials = {
      "username": username,
      "password": password
    };
    //console.log(credentials);
    /*
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
      try {
        httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
        try {
          httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        } 
        catch (e) {}
      }
    }

    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = alertContents;
    //alert(url);
    httpRequest.open("POST", url, true);
    httpRequest.setRequestHeader("Content-type", "application/json");
    httpRequest.send(JSON.stringify(credentials));
    */
    //alert('Start');
    
    $.ajax({
      // async is important here
      // If true, it passes without confirming.
      async: false,
      type: 'POST',
      url: url,
      contentType: "application/json",
      data: JSON.stringify(credentials),
      success: function(data) {
        session = data;
        localStorage.setItem('superlogin.session', JSON.stringify(session));
        //console.log(session);
        //console.log(`token: ${session.token}`);
        //console.log(`password: ${session.password}`);
        moveToDashboard();

      },
      error: function(xhr, type, exception) { 
        // if ajax fails display error alert
        
        console.log(`[${type}] ${exception}, Confirm your username and password`);
        alert(`[${type}] ${exception}, Confirm your username and password`);
        //location.reload(false);
        window.location = "/login"
        //$.get('/products');
      }
    });
    
  }
});

// localStorage detection
function supportsLocalStorage() {
  return typeof(Storage)!== 'undefined';
}

function moveToDashboard() {
  if (session) {
    
    console.log(session);
    console.log(`token: ${session.token}`);
    console.log(`password: ${session.password}`);
    var token = `Bearer ${session.token}:${session.password}`;

    console.log(token);
    console.log('moveToDashboard');

    $.ajax({
      async: true,
      type: 'GET',
      url: '/dashboard',
      //contentType: "application/json",
      headers: {"Authorization": token},
      //success: function(data) {
        //window.location = "/dashboard"
      //},
      error: function(xhr, type, exception) { 
        // if ajax fails display error alert 
        console.log(`[${type}] ${exception}, token is wrong `);
        //alert(`[${type}] ${exception}, Confirm your username and password`);
        window.location.href = "/login"
      }
    });
    
  } else {
    console.log("Let's stay here")
  }
}