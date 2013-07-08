goog.provide('chemistry.MainMenu');

goog.require('lime.Scene');
goog.require('lime.GlossyButton');

chemistry.MainMenu = function() {
	lime.Scene.call(this);

	var x = appObject.horizontalCenter;
	var y = appObject.verticalCenter;
	var sizeX = appObject.screenWidth/3;
	var sizeY = appObject.screenWidth/6;

	var easy   = new lime.GlossyButton("Easy").setSize(sizeX,sizeY).setFontSize(70).setPosition(x,y-sizeY-10);
	var medium = new lime.GlossyButton("Medium").setSize(sizeX,sizeY).setFontSize(70).setPosition(x,y);
	var hard   = new lime.GlossyButton("Hard").setSize(sizeX,sizeY).setFontSize(70).setPosition(x,y+sizeY+10);
	this.appendChild(easy);
	this.appendChild(medium);
	this.appendChild(hard);

	goog.events.listen(easy, ['mousedown','touchstart'], this.easyButtonClicked);
	goog.events.listen(medium, ['mousedown','touchstart'], this.mediumButtonClicked);
	goog.events.listen(hard, ['mousedown','touchstart'], this.hardButtonClicked);
}
goog.inherits(chemistry.MainMenu, lime.Scene)

chemistry.MainMenu.prototype.easyButtonClicked = function(e) {
	appObject.newGame(1);
}
chemistry.MainMenu.prototype.mediumButtonClicked = function(e) {
	appObject.newGame(2);
}
chemistry.MainMenu.prototype.hardButtonClicked = function(e) {
	appObject.newGame(3);
}