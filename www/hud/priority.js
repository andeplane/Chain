goog.provide('chemistry.Priority');
goog.require('lime.Sprite');

chemistry.Priority = function(width, height) {
	lime.Sprite.call(this);
	this.setSize(width, height);

	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0.5,1);
	colorLayer.setSize(width, height);
	colorLayer.setFill("#abc");
	this.appendChild(colorLayer);
}
goog.inherits(chemistry.Priority, lime.Sprite);