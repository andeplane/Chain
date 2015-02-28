goog.provide('chemistry.scenes.PauseScene');
goog.require('lime.helper.PauseScene');

chemistry.scenes.PauseScene = function() {
	lime.helper.PauseScene.call(this);
	var height = appObject.screenHeight;
	var width = appObject.screenWidth;
	var sizeX = width/2.0;
	var sizeY = height/10.0;
	var x = width/2.0;
	var y = height/2.0;

    var gridUnit = appObject.gridUnit;
		var gridUnitH = appObject.gridUnitH;

    this.addBackground(width, height);

    this.resumeButton = new lime.Sprite().setFill("images/design/ingamemenu/continuebutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit,17*gridUnitH).setAnchorPoint(0,0);
//	this.resumeButton = new lime.GlossyButton().setSize(sizeX,sizeY).setPosition(x,y - sizeY-10).setText('Resume').setColor('#00CD00').setFontSize(height/20.0);
    this.restartButton = new lime.Sprite().setFill("images/design/ingamemenu/restartbutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit,17*gridUnitH + 6*gridUnit).setAnchorPoint(0,0);
    this.mainMenuButton = new lime.Sprite().setFill("images/design/ingamemenu/mainmenubutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit, 17*gridUnitH + 12*gridUnit).setAnchorPoint(0,0);
	this.appendChild(this.resumeButton);
    this.appendChild(this.restartButton);
    this.appendChild(this.mainMenuButton);

	goog.events.listen(this.resumeButton, ['mousedown','touchstart'], this.resumeButtonClicked, false, appObject.game);
	goog.events.listen(this.restartButton, ['mousedown','touchstart'], this.restartButtonClicked, false, appObject.game);
    goog.events.listen(this.mainMenuButton, ['mousedown','touchstart'], this.returnToMenuButtonClicked, false, appObject.game);
};
goog.inherits(chemistry.scenes.PauseScene, lime.helper.PauseScene);

chemistry.scenes.PauseScene.prototype.resumeButtonClicked = function(e) {
	appObject.game.unpause(e);
}

chemistry.scenes.PauseScene.prototype.restartButtonClicked = function(e) {
    appObject.game.restart();
    appObject.game.unpause(e);
}

chemistry.scenes.PauseScene.prototype.returnToMenuButtonClicked = function(e) {
    appObject.game.quit();
}

chemistry.scenes.PauseScene.prototype.addBackground = function(width, height) {
    this.background = new lime.Sprite();
    this.background.setFill("images/design/ingamemenu/background.png");
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
}
