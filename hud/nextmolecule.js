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
	this.timeLeftBar = new lime.Sprite().setFill("#f00");
	this.timeLeftBar.setAnchorPoint(0,1);
	this.timeLeftBar.setSize(width, 10);
	this.timeLeftBar.setPosition(-width,height);
	this.appendChild(this.timeLeftBar);
}

chemistry.NextMolecule.prototype.addMoleculeSprite = function(width, height) {
	this.moleculeSprite = new lime.Sprite();
	this.moleculeSprite.setAnchorPoint(0,1);
	this.moleculeSprite.setSize(width, height);
	this.moleculeSprite.setPosition(0,height);
	this.appendChild(this.moleculeSprite);
}

chemistry.NextMolecule.prototype.newMolecule = function(molecule, timeToNext) {
	this.timeLeftBar.setScale(1,1);
	var scaleAction = new lime.animation.ScaleTo(0,1).setDuration(timeToNext/1000.0).setEasing(lime.animation.Easing.EASEIN); // setDuration takes seconds as unit of time
	this.timeLeftBar.runAction(scaleAction);
	this.moleculeSprite.setFill(molecule.data.imageFile);
}

chemistry.NextMolecule.prototype.tick = function(dt) {
	// TODO: Add things
}