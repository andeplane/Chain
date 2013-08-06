goog.provide('limeApp');

goog.require('chemistry.MainMenu');
goog.require('chemistry.Game');
goog.require('chemistry.Facebook');
goog.require('chemistry.Scores');
goog.require('chemistry.Leaderboard');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('lime.audio.Audio');
goog.require('lime.transitions.Dissolve');
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

limeApp = function(body, screenWidth, screenHeight) {
    if(!localStorage.uuid) {
        localStorage.uuid = guid();
    }
    this.director = new lime.Director(body, screenWidth, screenHeight);
    this.director.makeMobileWebAppCapable();
    this.director.pauseClassFactory = chemistry.scenes.PauseScene;
    goog.exportSymbol('appObject', this);

    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.verticalCenter = screenHeight/2;
    this.horizontalCenter = screenWidth/2;
    var scene = new lime.Scene();
    this.leaderboards = [];
    for(var i=0; i<3; i++) {
        var leaderboard = new chemistry.Leaderboard(i);
        this.leaderboards.push(leaderboard);
    }
    
    // this.audio = new lime.audio.Audio("assets/EIVISSA_SALINAS_feat._DJ_HSERES_-_Belly_Rythm.mp3");
    // this.audio.play();
    
    this.facebook = new chemistry.Facebook();
    this.mainMenu = new chemistry.MainMenu(screenWidth, screenHeight);
    this.scores = new chemistry.Scores();
    this.director.replaceScene(this.mainMenu);
};

limeApp.prototype.newGame = function(difficulty) {
    this.game = new chemistry.Game(this.screenWidth, this.screenHeight, difficulty);
    
	// this.director.replaceScene(this.game,lime.transitions.Dissolve, 0.2);
	this.director.replaceScene(this.game);
	lime.updateDirtyObjects();
}

limeApp.prototype.endGame = function() {
	// this.director.replaceScene(this.mainMenu,lime.transitions.Dissolve, 0.2);
	this.director.replaceScene(this.mainMenu);
	this.game = null;
	lime.updateDirtyObjects();
}

limeApp.prototype.showLeaderboard = function(difficulty) {
    this.director.replaceScene(this.leaderboards[difficulty]);
    this.leaderboards[difficulty].refresh();
}

limeApp.prototype.showMainMenu = function() {
    this.director.replaceScene(this.mainMenu);
}