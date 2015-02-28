goog.provide('chemistry.MainMenu');

goog.require('chemistry.events.GameEvent');
goog.require('chemistry.Facebook');

goog.require('lime.Sprite');
goog.require('lime.Scene');
goog.require('lime.GlossyButton');

chemistry.MainMenu = function(width, height) {
	lime.Scene.call(this);

	this.addBackground(width, height);

	var x = appObject.horizontalCenter;
	var y = appObject.verticalCenter;
	var sizeX = appObject.screenWidth/3;
	var sizeY = appObject.screenWidth/6;

    var gridUnit = appObject.gridUnit;

    var easy   = new lime.Sprite().setFill("images/design/mainmenu/easybutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit,y-sizeY-gridUnit).setAnchorPoint(0,0);
    var easyLeaderboardButton = new lime.Sprite().setSize(7*gridUnit, 7*gridUnit).setPosition(27*gridUnit, y-sizeY-gridUnit).setAnchorPoint(0,0);
    var medium = new lime.Sprite().setFill("images/design/mainmenu/mediumbutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit,y).setAnchorPoint(0,0);
    var mediumLeaderboardButton = new lime.Sprite().setSize(7*gridUnit, 7*gridUnit).setPosition(27*gridUnit, y).setAnchorPoint(0,0);
    var hard   = new lime.Sprite().setFill("images/design/mainmenu/hardbutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit,y+sizeY+10).setAnchorPoint(0,0);
    var hardLeaderboardButton = new lime.Sprite().setSize(7*gridUnit, 7*gridUnit).setPosition(27*gridUnit, y+sizeY+10).setAnchorPoint(0,0);
    var aboutButton = new lime.Sprite().setFill("images/design/mainmenu/uiologo.png").setSize(7*gridUnit, 7* gridUnit).setPosition(5 * gridUnit, height - 5 * gridUnit);
    var facebookButton   = new lime.Sprite().setFill("images/fb.png").setSize(7*gridUnit, 7* gridUnit).setPosition(width - 5*gridUnit, height - 5*gridUnit);
	this.appendChild(easy);
    this.appendChild(easyLeaderboardButton);
    this.appendChild(medium);
    this.appendChild(mediumLeaderboardButton);
    this.appendChild(hard);
    this.appendChild(hardLeaderboardButton);
    this.appendChild(aboutButton);
    if(appObject.facebook.isAvailable) {
        this.appendChild(facebookButton);
    }

    goog.events.listen(easy, ['mousedown','touchstart'], this.easyButtonClicked, false, this);
    goog.events.listen(medium, ['mousedown','touchstart'], this.mediumButtonClicked, false, this);
    goog.events.listen(hard, ['mousedown','touchstart'], this.hardButtonClicked, false, this);
    goog.events.listen(easyLeaderboardButton, ['mousedown','touchstart'], function(e) {appObject.showLeaderboard(0); }, false, this);
    goog.events.listen(mediumLeaderboardButton, ['mousedown','touchstart'], function(e) {appObject.showLeaderboard(1); }, false, this);
    goog.events.listen(hardLeaderboardButton, ['mousedown','touchstart'], function(e) {appObject.showLeaderboard(2); }, false, this);
    goog.events.listen(facebookButton, ['mousedown','touchstart'], this.facebookButtonClicked, false, this);
    goog.events.listen(aboutButton, ['mousedown','touchstart'], this.aboutButtonClicked, false, this);
}
goog.inherits(chemistry.MainMenu, lime.Scene);

chemistry.MainMenu.prototype.facebookButtonClicked = function(e) {
    if(appObject.facebook.isLoggedIn) {
        var r = confirm("Log out "+appObject.facebook.name+"?");
        if(r == true) {
            appObject.facebook.logout();
        }
    } else {
        appObject.facebook.login();
    }
}

chemistry.MainMenu.prototype.addBackground = function(width, height) {
    this.background = new lime.Sprite();
    this.background.setFill("images/design/mainmenu/background.png");
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
}

chemistry.MainMenu.prototype.easyButtonClicked = function(e) {
	appObject.newGame(0);
}
chemistry.MainMenu.prototype.mediumButtonClicked = function(e) {
	appObject.newGame(1);
}
chemistry.MainMenu.prototype.hardButtonClicked = function(e) {
    appObject.newGame(2);
}

chemistry.MainMenu.prototype.aboutButtonClicked = function(e) {
    appObject.showAbout();
}
