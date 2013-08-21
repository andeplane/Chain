goog.provide('chemistry.Config');

chemistry.Config = function() {
	this.levelUpEveryNCorrectMolecule = 10;
	this.getTimeToNextMolecule = function(game) {
		if(game.difficulty == 0) {
			return 4000/(0.7*Math.log(game.level.level + Math.exp(1)));
		} 
		if(game.difficulty == 1) {
			return 4000/(0.7*Math.log(game.level.level + Math.exp(1)));
		} 
		if(game.difficulty == 2) {
			return 4000/(0.7*Math.log(game.level.level + Math.exp(1)));
		} 
	}

	this.getVelocity = function(game) { 
		if(game.difficulty == 0) {
			return appObject.baseVelocity*Math.log(game.level.level + Math.exp(1)); 
		} 
		if(game.difficulty == 1) {
			return appObject.baseVelocity*Math.log(game.level.level + Math.exp(1)); 
		} 
		if(game.difficulty == 2) {
			return appObject.baseVelocity*Math.log(game.level.level + Math.exp(1)); 
		} 
	}

	this.getHP = function(game, correctAnswer, multiplier) { 
		if(correctAnswer) {return Math.min(4, 7-0.1*game.level.level); } 
		else { return Math.max(-30, -10 - game.level.level) } 
	}

	this.shouldAddMoleculeToLevel = function(level, data) {
		// Check if this chainlength is available
		if(level.availableChainLengths.indexOf(data.chainLength) == -1) return false;

		// Skip molecules with many functional groups for easy and medium
		if(level.difficulty == 0) {
			if(data.numFunctionalGroups > 0) return false;
			if(level.level < 3 && data.numBranches > 0) return false;
			if(level.level < 5 && data.numBranches > 1) return false;
		}

		if(level.difficulty == 1) {
			if(data.numFunctionalGroups > 1) return false;
			if(level.level < 3 && data.numBranches > 0) return false;
			if(level.level < 5 && data.numBranches > 1) return false;
		}

		if(level.difficulty == 2) {
			if(level.level < 3 && data.numBranches > 0) return false;
			if(level.level < 5 && data.numBranches > 1) return false;
		}

		return true;
	}

	this.getAvailableChainLengths = function(level) {
		if(level.difficulty == 0) {
			if(level.level < 3) return [3,4,5];
			if(level.level < 5) return [4,5,6];
			if(level.level < 10) return [5,6,7];
			if(level.level < 15) return [6,7,8];

			return [6,7,8];
		}

		if(level.difficulty == 1) {
			if(level.level < 3) return [3,4,5];
			if(level.level < 5) return [4,5,6];
			if(level.level < 10) return [5,6,7];
			if(level.level < 15) return [6,7,8];

			return [6,7,8];
		}

		if(level.difficulty == 2) {
			if(level.level < 5) return [3,4,5];
			if(level.level < 10) return [4,5,6];
			if(level.level < 15) return [5,6,7];

			return [5,6,7];
		}
		
		return [];
	}

	this.calculateScore = function(game, multiplier, molecule) {
		return (1 + multiplier + 4*game.fever)*molecule.score;
	}

	goog.exportSymbol('config', this);
}
