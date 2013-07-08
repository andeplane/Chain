goog.provide('chemistry.TargetBox');

goog.require('lime.Node');
goog.require('lime.Sprite');

chemistry.TargetBox = function(width, height, number) {
	console.log('balle'+number);
	lime.Node.call(this);
	this.setSize(width, height);
	this.number = number;

	var colors = ["#fea", "#29f", "#00f", "#ab0"];
	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0,0);
	colorLayer.setSize(this.getSize().width, this.getSize().height);
	colorLayer.setAutoResize(lime.AutoResize.WIDTH | lime.AutoResize.HEIGHT);
	colorLayer.setFill(colors[number]);
	this.appendChild(colorLayer);
}
goog.inherits(chemistry.TargetBox, lime.Node);