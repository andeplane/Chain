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

// attach the .compare method to Array's prototype to call it on any array
chemistry.Level.prototype.compareArrays = function(array1, array2) {
    // if the other array is a falsy value, return
    if (!array1 || !array2) {
        return false;
    }

    // compare lengths - can save a lot of time
    if (array1.length != array2.length) {
        return false;
    }

    for (var i = 0; i < array1.length; i++) {
        if (array1[i] != array2[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

chemistry.Level.prototype.reset = function() {
    this.level  	   		= 1;
    this.numCorrect 	    = 0;
    this.numMolecules  		= 0;
    this.numLanes	   		= 3;

    this.updateAvailableMoleculesAndButtons();
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

chemistry.Level.prototype.updateAvailableMoleculesAndButtons = function() {
    var oldAvailableChainLengths = this.availableChainLengths;
    this.availableChainLengths = config.getAvailableChainLengths(this);
    if(oldAvailableChainLengths && this.compareArrays(oldAvailableChainLengths, this.availableChainLengths) === false) {
        // We need to switch the buttons
        this.game.updateTargetBoxes();
    }

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
    this.updateAvailableMoleculesAndButtons();
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.LEVEL_UP));
}
