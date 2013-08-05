goog.provide('chemistry.Facebook');

chemistry.Facebook = function() {
    this.isAvailable = true;
	this.isLoggedIn = false;
    this.name = null;
    this.fbid = null;

    if(typeof FB == 'undefined') {
        this.isAvailable = false;
        return;
    }

	// if ((typeof cordova == 'undefined') && (typeof Cordova == 'undefined')) alert('Cordova variable does not exist. Check that you have included cordova.js correctly');
 //    if (typeof CDV == 'undefined') alert('CDV variable does not exist. Check that you have included cdv-plugin-fb-connect.js correctly');
 //    if (typeof FB == 'undefined') alert('FB variable does not exist. Check that you have included the Facebook JS SDK file.');
    var self = this;

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
}
goog.inherits(chemistry.Facebook, goog.events.Event);

chemistry.Facebook.prototype.statusChange = function(session) {
    var self = this;
    if (session.authResponse) {
        //document.body.className = 'connected';

        //Fetch user's id, name, and picture
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
}

chemistry.Facebook.prototype.getLoginStatus = function() {
    FB.getLoginStatus(function(response) {
		if (response.status == 'connected') {
		alert('logged in');
		} else {
		alert('not logged in');
		}
	});
}

chemistry.Facebook.prototype.logout = function() {
    self = this;
    FB.logout(function(response) {
        self.isLoggedIn = false;
        self.name = null;
        self.fbid = null;
        alert('logged out');
	});
}
            
chemistry.Facebook.prototype.login = function() {
	FB.login(null, {scope: 'email'});
}