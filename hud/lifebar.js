goog.provide('chemistry.Lifebar');

goog.require('lime.Node');
goog.require('lime.Sprite');

chemistry.Lifebar = function(width, height) {
	lime.Node.call(this);
	this.setSize(width, height);
	this.sprite = new lime.Sprite().setFill("#f00");
	this.sprite.setSize(width,height);
	this.sprite.setAnchorPoint(0,1);
	this.appendChild(this.sprite);
	this.sprite.setScale(1,1);
}
goog.inherits(chemistry.Lifebar, lime.Node);

chemistry.Lifebar.prototype.setHP = function(hp) {
	var scaleX = hp/100;
	var scaleAction = new lime.animation.ScaleTo(scaleX,1).setDuration(0.3);
	this.runAction(scaleAction);
}