goog.provide('chemistry.NextMolecule');

goog.require('lime.Node');
goog.require('lime.Sprite');

chemistry.NextMolecule = function(width, height) {
	lime.Node.call(this);
	this.setSize(width, height);
	
	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0,0);
	colorLayer.setPosition(-width,0);
	colorLayer.setSize(width, height);
	colorLayer.setFill("#afa");
	this.appendChild(colorLayer);
}
goog.inherits(chemistry.NextMolecule, lime.Node);

chemistry.NextMolecule.prototype.tick = function(dt) {
	// TODO: Add things
}