goog.provide('chemistry.Level');

goog.require('chemistry.MoleculeData');
goog.require('chemistry.events.GameEvent');

chemistry.Level = function(difficulty, game) {
	this.difficulty    		= difficulty;
	this.game 		   		= game;
    this.numLanes	   		= -999;
    this.numMolecules  		= -999;
    this.numCorrect 	    = -999;
    this.level  	   		= -999;
	this.moleculeData  		= new chemistry.MoleculeData().getMoleculeData();
    this.availableMoleculeData = [];

    this.reset();

	goog.events.listen(game, chemistry.events.GameEvent.CORRECT_ANSWER, this.newCorrectMolecule, false, this);
}
goog.inherits(chemistry.Level, goog.events.EventTarget);

chemistry.Level.prototype.reset = function() {
    this.level  	   		= 1;
    this.numCorrect 	    = 0;
    this.numMolecules  		= 0;
    this.numLanes	   		= 3;

    this.updateAvailableMoleculeData();
}

chemistry.Level.prototype.getVelocity = function() {
	var baseVelocity = appObject.screenHeight / 15;
	return baseVelocity*Math.log(this.level + Math.exp(1));
}

chemistry.Level.prototype.getHP = function(correctAnswer) {
	return correctAnswer ? 5 : -10;
}

chemistry.Level.prototype.getTimeToNextMolecule = function() {
	return 2000/(0.7*Math.log(this.level + Math.exp(1)));
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

chemistry.Level.prototype.newCorrectMolecule = function() {
	this.numCorrect++;
	if(this.numCorrect % 5 === 0) {
        this.levelUp(); // Increase level every 5th molecule
    }
}

chemistry.Level.prototype.getNextMolecule = function() {
    this.numMolecules++;
    // Choose a random new molecule
    var moleculeData = this.availableMoleculeData[goog.math.randomInt(this.availableMoleculeData.length)];
    
    // Create molecule object and scale it into lane size
    var molecule = new chemistry.Molecule(moleculeData);

    return molecule;
}

chemistry.Level.prototype.levelUp = function() {
    this.level++;
    this.updateAvailableMoleculeData();
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.LEVEL_UP));
}
