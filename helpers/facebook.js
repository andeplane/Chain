goog.provide('chemistry.Facebook');

chemistry.Facebook = function() {
    this.isAvailable = true;
    this.isLoggedIn = false;
    this.name = null;
    this.fbid = null;
    this.cordova = true;

    if(typeof FB == 'undefined') {
        this.cordova = false;
    }

    var self = this;

    if(this.cordova) {
      FB.Event.subscribe('auth.login', function(response) {
                         // alert('auth.login event');
                         });
      
      FB.Event.subscribe('auth.logout', function(response) {
                         // alert('auth.logout event');
                         });
      
      FB.Event.subscribe('auth.sessionChange', function(response) {
                         // alert('auth.sessionChange event');
                         });
      
      FB.Event.subscribe('auth.statusChange', function(response) {
          self.statusChange(response);
      });

      document.addEventListener('deviceready', function() {
        try {
          FB.init({ appId: 667313733281304, nativeInterface: CDV.FB, useCachedDialogs: false });
        } catch (e) {
          alert(e);
        }
      }, false);
    } else {
      // In the web browser
      window.fbAsyncInit = function() {
        // init the FB JS SDK
        FB.init({
          appId      : '667313733281304',                        // App ID from the app dashboard
          // channelUrl : '//WWW.YOUR_DOMAIN.COM/channel.html', // Channel file for x-domain comms
          status     : true,                                 // Check Facebook Login status
          xfbml      : true                                  // Look for social plugins on the page
        });

        // Additional initialization code such as adding Event Listeners goes here
        // self.getLoginStatus();
        self.init();
        
      };

      // Load the SDK asynchronously
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "http://connect.facebook.net/en_US/all.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    }
}
goog.inherits(chemistry.Facebook, goog.events.Event);

chemistry.Facebook.prototype.init = function() {
  var self = this;
  FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token 
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
    self.updateUserInfo();
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook, 
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
 });
}

chemistry.Facebook.prototype.updateUserInfo = function() {
  //Fetch user's id, name, and picture
  var self = this;

  FB.api('/me', {
  fields: 'name'
  },
  function(response) {
    if (!response.error) {
        self.name = response.name;
        self.fbid = response.id;
        self.isLoggedIn = true;
    } else {
      // Check for errors due to app being unininstalled
      if (response.error.error_subcode && response.error.error_subcode == "458") {
        setTimeout(function() {
          alert("The app was removed. Please log in again.");
        }, 0);              
      }
      logout();         
    }
  });
}

chemistry.Facebook.prototype.statusChange = function(session) {
    var self = this;
    if (session.authResponse) {
        //document.body.className = 'connected';
      self.updateUserInfo();
    }
}

chemistry.Facebook.prototype.getLoginStatus = function() {
  if(this.cordova) {
    FB.getLoginStatus(function(response) {
  		if (response.status == 'connected') {
  		  alert('logged in');
  		} else {
  		  alert('not logged in');
  		}
  	});
  } else {

  }
}

chemistry.Facebook.prototype.logout = function() {
    self = this;

    FB.logout(function(response) {
        self.isLoggedIn = false;
        self.name = null;
        self.fbid = null;
    });
}
            
chemistry.Facebook.prototype.login = function() {
  var self = this;
  if(this.cordova) {
    FB.login(null, {scope: 'email'});
  } else {
    FB.login(function(response) {
      if(response.authResponse != null) {
        self.updateUserInfo();
      }
    }, {scope: 'email'});
  }
	
}