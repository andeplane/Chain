goog.provide('app');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('chemistry.MainMenu');
goog.require('chemistry.Game');

app = function(body, screenWidth, screenHeight) {
	this.director = new lime.Director(body, screenWidth, screenHeight);
    this.director.makeMobileWebAppCapable();
    this.director.pauseClassFactory = chemistry.scenes.PauseScene;
    goog.exportSymbol('appObject', this);
	
	this.screenHeight = screenHeight;
	this.screenWidth = screenWidth;
	this.verticalCenter = screenHeight/2;
	this.horizontalCenter = screenWidth/2;
	var scene = new lime.Scene();
	
	this.mainMenu = new chemistry.MainMenu();

	this.director.replaceScene(this.mainMenu);
};

app.prototype.pause = function() {
	this.director.setPaused(true);
	lime.updateDirtyObjects();
};

app.prototype.unpause = function() {
	this.director.setPaused(false);
	lime.updateDirtyObjects();
};

app.prototype.newGame = function(difficulty) {
    this.game = new chemistry.Game(this.screenWidth, this.screenHeight, difficulty);
	this.director.replaceScene(this.game);
}

app.prototype.endGame = function() {
	this.director.replaceScene(this.mainMenu);
	this.game = null;
	lime.updateDirtyObjects();
}
