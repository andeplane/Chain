goog.provide('chemistry.MainMenu');

goog.require('chemistry.events.GameEvent');

goog.require('lime.Scene');
goog.require('lime.GlossyButton');

chemistry.MainMenu = function(width, height) {
	lime.Scene.call(this);

	this.addBackground(width, height);

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

    goog.events.listen(easy, ['mousedown','touchstart'], this.easyButtonClicked, false, this);
    goog.events.listen(medium, ['mousedown','touchstart'], this.mediumButtonClicked, false, this);
    goog.events.listen(hard, ['mousedown','touchstart'], this.hardButtonClicked, false, this);
}
goog.inherits(chemistry.MainMenu, lime.Scene);

chemistry.MainMenu.prototype.addBackground = function(width, height) {
    var fill = new lime.fill.LinearGradient().
    setDirection(0,0,0,1). // 45' angle
    addColorStop(0,100,0,0,1). // start from red color
    addColorStop(1,0,0,100,.5); // end with transparent blue
    this.background = new lime.Sprite();
    this.background.setFill(fill);
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
}

chemistry.MainMenu.prototype.easyButtonClicked = function(e) {
	appObject.newGame(1);
}
chemistry.MainMenu.prototype.mediumButtonClicked = function(e) {
	appObject.newGame(2);
}
chemistry.MainMenu.prototype.hardButtonClicked = function(e) {
    appObject.newGame(3);
}
