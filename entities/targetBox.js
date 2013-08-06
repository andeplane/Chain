goog.provide('chemistry.TargetBox');

goog.require('lime.Node');
goog.require('lime.Sprite');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.FadeTo');

chemistry.TargetBox = function(width, height, number, chainLength) {
	lime.Node.call(this);
	this.setSize(width, height);
	this.number = number;

//	var colors = ["#eee", "#ddd", "#eee", "#ddd"];
	
	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0,0);
    colorLayer.setSize(width, height);
    colorLayer.setFill("design/export/button" + chainLength + ".png");
	this.appendChild(colorLayer);

//    var numberLabel = new lime.Label(chainLength);
//    numberLabel.setPosition(width/2, height/2);
//    numberLabel.setFontSize(width/5);
//    numberLabel.setFontFamily("Sonsie One");
//    this.appendChild(numberLabel);

	this.highlightLayer = new lime.Sprite();
	this.highlightLayer.setAnchorPoint(0,0);
	this.highlightLayer.setSize(width, height);
	this.highlightLayer.setFill("#fff");
	this.highlightLayer.setOpacity(0);
	this.appendChild(this.highlightLayer);
}
goog.inherits(chemistry.TargetBox, lime.Node);

chemistry.TargetBox.prototype.highlight = function(correctAnswer) {
	if(correctAnswer) {
		this.highlightLayer.setFill("#0f0");
	} else {
		this.highlightLayer.setFill("#f00");
	}
	this.highlightLayer.runAction(new lime.animation.Sequence(
		new lime.animation.FadeTo(0.3).setDuration(0.1),
		new lime.animation.FadeTo(0).setDuration(0.3)
		));
}
