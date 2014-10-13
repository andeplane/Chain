goog.provide('chemistry.Facebook');

chemistry.Facebook = function() {
    this.isAvailable = true;
    this.isLoggedIn = false;
    this.name = null;
    this.fbid = null;
    this.load(); // Load from localStorage
    this.refresh();
}
goog.inherits(chemistry.Facebook, goog.events.Event);

chemistry.Facebook.prototype.save = function() {
  localStorage.isLoggedIn = this.isLoggedIn;
  localStorage.name = this.name;
  localStorage.fbid = this.fbid;
}

chemistry.Facebook.prototype.load = function() {
  if(localStorage.isLoggedIn == null) return;
  
  this.isLoggedIn = (localStorage.isLoggedIn == "true") ? true : false;
  this.name = localStorage.name;
  this.fbid = localStorage.fbid;
}

chemistry.Facebook.prototype.refresh = function() {
  if(typeof facebookConnectPlugin == "undefined") return;
  
  var self = this;
  facebookConnectPlugin.getLoginStatus(function(response) {
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
  facebookConnectPlugin.api('me/?fields=id,name', [],
    function(response) {
      if (!response.error) {
        self.name = response.name;
        self.fbid = response.id;
        self.isLoggedIn = true;
        self.save();
      } else {
        // Check for errors due to app being unininstalled
        if (response.error.error_subcode && response.error.error_subcode == "458") {
          setTimeout(function() {
            alert("The app was removed. Please log in again.");
          }, 0);              
        }
        logout();         
      }
    }
  );
}

chemistry.Facebook.prototype.logout = function() {
    var self = this;

    facebookConnectPlugin.logout(function(response) {
        self.isLoggedIn = false;
        self.name = null;
        self.fbid = null;
        self.save();
    });
}
            
chemistry.Facebook.prototype.login = function() {
  var self = this;
  facebookConnectPlugin.login( ["email"], 
    function (response) {
      self.updateUserInfo();
    });
}