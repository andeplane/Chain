goog.provide('app');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('chemistry.MainMenu');
goog.require('chemistry.Hud');

app = function(body, screenWidth, screenHeight) {
	this.director = new lime.Director(body, screenWidth, screenHeight);
    this.director.makeMobileWebAppCapable();
    goog.exportSymbol('appObject', this);
	
	this.screenHeight = screenHeight;
	this.screenWidth = screenWidth;
	this.verticalCenter = screenHeight/2;
	this.horizontalCenter = screenWidth/2;
	var scene = new lime.Scene();
	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0,0);
	colorLayer.setSize(this.screenWidth, this.screenHeight);
	colorLayer.setFill("#fbc");
	scene.appendChild(colorLayer);

	this.hud = new chemistry.Hud(screenWidth, 300);
	scene.appendChild(this.hud);

	this.mainMenu = new chemistry.MainMenu();

	this.director.replaceScene(scene);
};