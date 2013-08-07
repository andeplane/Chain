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
    return config.getVelocity(this.game);
}

chemistry.Level.prototype.getHP = function(correctAnswer, multiplier) {
    return config.getHP(this.game, correctAnswer, multiplier);
}

chemistry.Level.prototype.getTimeToNextMolecule = function() {
	return config.getTimeToNextMolecule(this.game);
}

chemistry.Level.prototype.updateAvailableMoleculeData = function() {
	this.availableMoleculeData = [];
	for(var i in this.moleculeData) {
		var data = this.moleculeData[i];
        
		if(config.shouldAddMoleculeToLevel(this, data)) {
            this.availableMoleculeData.push(data);
        }
	}
}

chemistry.Level.prototype.newCorrectMolecule = function() {
	this.numCorrect++;
	if(this.numCorrect % config.levelUpEveryNCorrectMolecule === 0) {
        this.levelUp(); // Increase level every nth molecule
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
