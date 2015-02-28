goog.provide('chemistry.Lane');
goog.require('chemistry.TargetBox');

goog.require('lime.Sprite');
goog.require('lime.Node');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.actionManager');

chemistry.Lane = function(width, height, number) {
	lime.Node.call(this);
	this.setSize(width, height);

	this.molecules = [];
	this.number = number;
	this.chainLength = number+3; // TODO REMOVE ME
	this.numHighlight = 0;
	this.currentAction = null;
	this.setAnchorPoint(0,0);

	this.addHighlightSprite(width, height);
	this.addTargetBox(width, height);
}
goog.inherits(chemistry.Lane, lime.Node);

chemistry.Lane.prototype.addHighlightSprite = function(width, height) {
	this.highlightSprite = new lime.Sprite();
	this.appendChild(this.highlightSprite);
	this.highlightSprite.setSize(width,height);
	this.highlightSprite.setAnchorPoint(0,0);
	this.highlightSprite.setFill("#fff");
	this.highlightSprite.setOpacity(0);
}

chemistry.Lane.prototype.addTargetBox = function(width, height) {
	var goldenRatioInverse = 1/1.618;
    this.targetBox = new chemistry.TargetBox(width, width*goldenRatioInverse, this.number, this.chainLength);
	this.targetBox.setAnchorPoint(0,0);
	this.targetBox.setPosition(0,height-goldenRatioInverse*width);
	this.appendChild(this.targetBox);

	var self = this;
    goog.events.listen(this.targetBox,['mousedown','touchstart'], function(e) {
        goog.events.dispatchEvent(this, new chemistry.events.LaneEvent(chemistry.events.LaneEvent.CLICKED_TARGET_BOX, this.number), null);
    }, false, this);
}
