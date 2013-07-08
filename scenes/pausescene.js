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
	
	this.resumeButton = new lime.GlossyButton().setSize(sizeX,sizeY).setPosition(x,y - sizeY).setText('Resume').setColor('#00CD00').setFontSize(height/20.0);
	this.exitButton = new lime.GlossyButton().setSize(sizeX,sizeY).setPosition(x,y + sizeY).setText('Return to menu').setColor('#00CD00').setFontSize(height/20.0);
	this.appendChild(this.resumeButton);
	this.appendChild(this.exitButton);

	goog.events.listen(this.resumeButton, ['mousedown','touchstart'], this.resumeButtonClicked);
	// goog.events.listen(this.exitButton, ['mousedown','touchstart'], appObject.game.end);
};
goog.inherits(chemistry.scenes.PauseScene, lime.helper.PauseScene);

chemistry.scenes.PauseScene.prototype.resumeButtonClicked = function(e) {
	appObject.unpause();
}