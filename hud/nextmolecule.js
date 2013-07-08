goog.provide('chemistry.NextMolecule');

goog.require('lime.Node');
goog.require('lime.Sprite');
goog.require('lime.animation.ScaleTo');

chemistry.NextMolecule = function(width, height) {
	lime.Node.call(this);
	this.setSize(width, height);
	
	this.addBackground(width, height);
	this.addTimeLeftBar(width, height);
	this.addMoleculeSprite(width, height);
	
}
goog.inherits(chemistry.NextMolecule, lime.Node);

chemistry.NextMolecule.prototype.addBackground = function(width, height) {
	this.background = new lime.Sprite();
	this.background.setAnchorPoint(0,0);
	this.background.setPosition(-width,0);
	this.background.setSize(width, height);
	this.background.setFill("#afa");
	this.appendChild(this.background);
}

chemistry.NextMolecule.prototype.addTimeLeftBar = function(width, height) {
	this.timeLeftBar = new lime.Sprite().setFill("#0ac");
	this.timeLeftBar.setAnchorPoint(1,1);
	this.timeLeftBar.setSize(10, height);
	this.timeLeftBar.setPosition(0,height);
	this.appendChild(this.timeLeftBar);
}

chemistry.NextMolecule.prototype.addMoleculeSprite = function(width, height) {
	this.moleculeSprite = new lime.Sprite();
	this.moleculeSprite.setFill("#fff");
	this.moleculeSprite.setPosition(-width/2.0,height/2.0);
	this.appendChild(this.moleculeSprite);
}

chemistry.NextMolecule.prototype.newMolecule = function(molecule, timeToNext) {
	this.timeLeftBar.setScale(1,1);
	var scaleAction = new lime.animation.ScaleTo(1,0).setDuration(timeToNext/1000.0).setEasing(lime.animation.Easing.EASEIN); // setDuration takes seconds as unit of time
	this.timeLeftBar.runAction(scaleAction);
	this.moleculeSprite.setFill(molecule.data.imageFile);
	this.moleculeSprite.setRotation(molecule.getRotation());

	var size = this.moleculeSprite.getSize();
	var maxSize = Math.max(size.width, size.height);
	var scale = this.getSize().width / maxSize * 0.8;
	this.moleculeSprite.setScale(scale,scale);
}

chemistry.NextMolecule.prototype.tick = function(dt) {
	// TODO: Add things
}