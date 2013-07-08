goog.provide('chemistry.Lane');
goog.require('chemistry.TargetBox');

goog.require('lime.Node');

chemistry.Lane = function(width, height, number) {
	lime.Node.call(this);
	this.setSize(width, height);

	this.molecules = [];
	this.number = number;
	this.targetBox = new chemistry.TargetBox(width, width, number);
	this.setAnchorPoint(0,0);
	this.targetBox.setPosition(0,height-width);
	this.appendChild(this.targetBox);

}
goog.inherits(chemistry.Lane, lime.Node);

chemistry.Lane.prototype.addMolecule = function(molecule) {
	this.molecules.push(molecule);
}

chemistry.Lane.prototype.removeMoleculeAtIndex = function(index) {
	this.molecules.splice(index, 1);
}

chemistry.Lane.prototype.removeMolecule = function(molecule) {
	var index = this.molecules.indexOf(molecule);
	this.removeMoleculeAtIndex(index);
}

chemistry.Lane.prototype.tick = function(dt) {
	for(var i in this.molecules) {
		var molecule = this.molecules[i];
		molecule.tick(dt);
	}
}