/*
var LoginModalController = {
  tabsElementName: ".logmod__tabs li",
  tabElementName: ".logmod__tab",
  inputElementsName: ".logmod__form .input",
  hidePasswordName: ".hide-password",
    
  inputElements: null,
  tabsElement: null,
  tabElement: null,
  hidePassword: null,
    
  activeTab: null,
  tabSelection: 0, // 0 - first, 1 - second
    
  findElements: function () {
    var base = this;
        
    base.tabsElement = $(base.tabsElementName);
    base.tabElement = $(base.tabElementName);
    base.inputElements = $(base.inputElementsName);
    base.hidePassword = $(base.hidePasswordName);
        
    return base;
  },
    
  setState: function (state) {
  	var base = this,
    elem = null;
        
    if (!state) {
      state = 0;
    }
        
    if (base.tabsElement) {
      elem = $(base.tabsElement[state]);
      elem.addClass("current");
      $("." + elem.attr("data-tabtar")).addClass("show");
    }
  
    return base;
  },
    
  getActiveTab: function () {
    var base = this;
        
    base.tabsElement.each(function (i, el) {
      if ($(el).hasClass("current")) {
        base.activeTab = $(el);
      }
    });
        
    return base;
  },
   
  addClickEvents: function () {
    var base = this;
        
    base.hidePassword.on("click", function (e) {
    var $this = $(this),
    $pwInput = $this.prev("input");
            
    if ($pwInput.attr("type") == "password") {
      $pwInput.attr("type", "text");
        $this.text("Hide");
      } else {
        $pwInput.attr("type", "password");
        $this.text("Show");
      }
    });
 
    base.tabsElement.on("click", function (e) {
      var targetTab = $(this).attr("data-tabtar");
        
      e.preventDefault();
      base.activeTab.removeClass("current");
      base.activeTab = $(this);
      base.activeTab.addClass("current");
         
      base.tabElement.each(function (i, el) {
        el = $(el);
        el.removeClass("show");
        if (el.hasClass(targetTab)) {
          el.addClass("show");
        }
      });
    });
        
    base.inputElements.find("label").on("click", function (e) {
      var $this = $(this),
        $input = $this.next("input");
           
        $input.focus();
    });
        
    return base;
  },
    
  initialize: function () {
    var base = this;
        
    base.findElements().setState().getActiveTab().addClickEvents();
  }
};

$(document).ready(function() {
  //LoginModalController.initialize();
});
*/

let credentials = {
  username: 'test2',
  password: '12345678'
};

const joptions = {
  hostname: 'localhost',
  port: 3000,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
    //'Content-Length': Buffer.byteLength(credentials)
  }
};

var httpRequest;
document.getElementById("loginButton").onclick = function() { makeRequest('/auth/login/'); };

function makeRequest(url) {
  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) { // IE
    try {
      httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
    } 
    catch (e) {
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
  //httpRequest.open('GET', url);
  //httpRequest.send();
  httpRequest.open("POST", url, false);
  //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  httpRequest.setRequestHeader("Content-type", "application/json");
  //console.log(`url: ${url}`)
  //console.log('httpRequest');
  //console.log(httpRequest);
  httpRequest.send(JSON.stringify(credentials));
}

function alertContents() {
  //console.log('testtesttest1111');
  if (httpRequest.readyState === 4) {
    //console.log('testtesttest2222');
    if (httpRequest.status === 200) {
      //console.log('testtesttest3333');
      console.log(httpRequest.responseText);
      localStorage.setItem('superlogin.session', httpRequest.responseText);
    } else {
      alert('There was a problem with the request.');
    }
  }
}


// localStorage detection
function supportsLocalStorage() {
  return typeof(Storage)!== 'undefined';
}

// Run the support check
if (!supportsLocalStorage()) {
  // No HTML5 localStorage Support
} else {
  // HTML5 localStorage Support
}


/*
$(document).ready(function() {
   $("button").click(function() {
    console.log('click');
    
    $.ajax({
      url: "/auth/login/",
      type: "POST",
      data: JSON.stringify(credentials),
      contentType: "application/json",
      dataType: 'json',
      success: function(res) {
        console.log(res);
        localStorage.setItem('superlogin.session', res);
      }
    });
    //$.post(
    //  "/auth/login",
    //  JSON.stringify(credentials),
    //  function(data, status) {
    //    console.log(data, status);     
    //  }
    //);
  });
});
*/