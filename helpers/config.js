goog.provide('chemistry.Config');

chemistry.Config = function() {

	this.levelUpEveryNCorrectMolecule = 10;
	this.getTimeToNextMolecule = function(game) {
		return 2000/(0.7*Math.log(2*game.level.level + Math.exp(1)));
	}

	this.getVelocity = function(game) { 
		return appObject.baseVelocity*Math.log(2*game.level.level + Math.exp(1)); 
	}

	this.getHP = function(game, correctAnswer, multiplier) { 
		if(correctAnswer) {return Math.min(4, 7-0.1*game.level.level); } 
		else { return Math.max(-30, -10 - game.level.level) } 
	}

	this.shouldAddMoleculeToLevel = function(level, data) {
		// Skip molecules with many functional groups for easy and medium
		if(level.difficulty == 1 && data.numFunctionalGroups > 0) return false;
		if(level.difficulty == 2 && data.numFunctionalGroups > 1) return false;
		if(level.level < 1000 && data.chainLength > 5) return false;

		return true;
	}

	this.calculateScore = function(game, multiplier, molecule) {
		return (1 + multiplier + 4*game.fever)*molecule.score;
	}

	goog.exportSymbol('config', this);
}
