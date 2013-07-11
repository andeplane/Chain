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
	
	this.resumeButton = new lime.GlossyButton().setSize(sizeX,sizeY).setPosition(x,y - sizeY-10).setText('Resume').setColor('#00CD00').setFontSize(height/20.0);
	this.restartButton = new lime.GlossyButton().setSize(sizeX,sizeY).setPosition(x,y).setText('Restart').setColor('#00CD00').setFontSize(height/20.0);
	this.exitButton = new lime.GlossyButton().setSize(sizeX,sizeY).setPosition(x,y + sizeY + 10).setText('Return to menu').setColor('#00CD00').setFontSize(height/20.0);
	this.appendChild(this.resumeButton);
	this.appendChild(this.restartButton);
	this.appendChild(this.exitButton);

	goog.events.listen(this.resumeButton, ['mousedown','touchstart'], this.resumeButtonClicked, false, appObject.game);
	goog.events.listen(this.restartButton, ['mousedown','touchstart'], this.restartButtonClicked, false, appObject.game);
	goog.events.listen(this.exitButton, ['mousedown','touchstart'], this.returnToMenuButtonClicked, false, appObject.game);
};
goog.inherits(chemistry.scenes.PauseScene, lime.helper.PauseScene);

chemistry.scenes.PauseScene.prototype.resumeButtonClicked = function(e) {
	appObject.game.unpause(e);
}

chemistry.scenes.PauseScene.prototype.restartButtonClicked = function(e) {
    appObject.game.start();
    appObject.game.unpause(e);
}

chemistry.scenes.PauseScene.prototype.returnToMenuButtonClicked = function(e) {
	appObject.game.end();
}
