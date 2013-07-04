goog.provide('chemistry.Hud');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('chemistry.RollerCounter');
// goog.require('lime.AutoResize');

chemistry.Hud = function(width, height) {
	lime.Layer.call(this);
	this.setSize(width, height);
	this.setAnchorPoint(0,0);

	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0,0);
	console.log(this.getSize().width);
	console.log(this.getSize().height);
	colorLayer.setSize(this.getSize().width, this.getSize().height);
	colorLayer.setAutoResize(lime.AutoResize.WIDTH | lime.AutoResize.HEIGHT);
	colorLayer.setFill("#aff");
	this.appendChild(colorLayer);

	this.rollerCounter = new chemistry.RollerCounter();
	this.rollerCounter.setPosition(this.getSize().width/2, this.getSize().height/10);
	this.rollerCounter.setAutoResize(lime.AutoResize.WIDTH | lime.AutoResize.HEIGHT);
	this.appendChild(this.rollerCounter);
}

goog.inherits(chemistry.Hud, lime.Layer);