goog.provide('chemistry.Lifebar');

goog.require('chemistry.events.GameEvent');
goog.require('lime.Node');
goog.require('lime.Sprite');
goog.require('lime.animation.ColorTo');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Loop');

chemistry.Lifebar = function(width, height) {
	lime.Node.call(this);
	this.setSize(width, height);
	this.sprite = new lime.Sprite().setFill("#f00");
	this.sprite.setSize(width,height);
	this.sprite.setAnchorPoint(0,1);
	this.appendChild(this.sprite);
	this.sprite.setScale(1,1);
	this.currentAction = null;
}
goog.inherits(chemistry.Lifebar, lime.Node);

chemistry.Lifebar.prototype.setHP = function(hp) {
	var scaleX = hp/100;
	var scaleAction = new lime.animation.ScaleTo(scaleX,1).setDuration(0.3);
	this.runAction(scaleAction);
}

chemistry.Lifebar.prototype.enterFeverMode = function(e) {
	if(this.currentAction) this.currentAction.stop();

	var blink = new lime.animation.Sequence(
				new lime.animation.ColorTo("#0be100").setDuration(0.2),
				new lime.animation.ColorTo("#d5f500").setDuration(0.2)
		);
	this.currentAction = new lime.animation.Loop(blink);
	this.sprite.runAction(this.currentAction);
}

chemistry.Lifebar.prototype.exitFeverMode = function(e) {
	if(this.currentAction) this.currentAction.stop();
	this.currentAction = new lime.animation.ColorTo("#f00").setDuration(0.5);
	this.sprite.runAction(this.currentAction);
}
