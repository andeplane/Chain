goog.provide('chemistry.Molecule');
goog.require('lime.Sprite');
goog.require('goog.math');

chemistry.Molecule = function(data) {
	lime.Sprite.call(this);

	this.setFill(data.imageFile);
	// setScale(-1,1) works as flipY
	if(goog.math.randomInt(2) % 2 == 0) this.setScale(-1,1);
	// Also rotate by n*90 degrees for more variations
	var rnd = goog.math.randomInt(4);
	this.setRotation(90*rnd);
	
	this.chainLength 		 = data.chainLength;
	this.numBranches 		 = data.numBranches;
	this.numFunctionalGroups = data.numFunctionalGroups;
	this.velocity 			 = 0.0;
	this.acceleration 		 = 0.0;
}
goog.inherits(chemistry.Molecule, lime.Sprite);

chemistry.Molecule.prototype.tick = function(dt) {
	// TODO: Lane snapping?
	this.velocity += this.acceleration*dt;
	this.setPosition(this.getPosition().x, this.getPosition().y + this.velocity*dt);
}