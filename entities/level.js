goog.provide('chemistry.Level');

goog.require('chemistry.MoleculeData');

chemistry.Level = function(difficulty, game) {
	this.difficulty    = difficulty;
	this.game 		   = game;
	this.numLanes	   = 3;
	this.numMolecules  = 0;
	this.level  	   = 1;
	this.moleculeData  = new chemistry.MoleculeData().getMoleculeData();
	this.availableMoleculeData = [];
	this.updateAvailableMoleculeData();
}

chemistry.Level.prototype.getVelocity = function() {
	return 0.2*this.difficulty*Math.log(this.level + Math.exp(1));
}

chemistry.Level.prototype.getHP = function(correctAnswer) {
	return correctAnswer ? 5 : -10;
}

chemistry.Level.prototype.getTimeToNextMolecule = function() {
	return 2000/(this.difficulty*0.7*Math.log(this.level + Math.exp(1)));
}

chemistry.Level.prototype.updateAvailableMoleculeData = function() {
	this.availableMoleculeData = [];
	for(var i in this.moleculeData) {
		var data = this.moleculeData[i];
		// Skip molecules with many functional groups for easy and medium
		if(this.difficulty == 1 && data.numFunctionalGroups > 0) continue;
		if(this.difficulty == 2 && data.numFunctionalGroups > 1) continue;
		if(this.level < 1000 && data.chainLength > 5) continue;

		this.availableMoleculeData.push(data);
	}
}

chemistry.Level.prototype.getNextMolecule = function() {
	// Choose a random new molecule
    
	var moleculeData = this.availableMoleculeData[goog.math.randomInt(this.availableMoleculeData.length)];

	// Create molecule object and scale it into lane size
	var molecule = new chemistry.Molecule(moleculeData);

	this.numMolecules++;
	if(this.numMolecules % 5 === 0) this.level++; // Increase level every 5th molecule

	return molecule
}