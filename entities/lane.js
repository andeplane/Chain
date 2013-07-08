goog.provide('chemistry.Lane');
goog.require('chemistry.TargetBox');

goog.require('lime.Sprite');
goog.require('lime.Node');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.actionManager');

chemistry.Lane = function(width, height, number) {
	lime.Node.call(this);
	this.setSize(width, height);

	this.molecules = [];
	this.number = number;
	this.chainLength = number+3; // TODO REMOVE ME
	this.numHighlight = 0;
	this.currentAction = null;
	this.setAnchorPoint(0,0);

	this.addHighlightSprite(width, height);
	this.addTargetBox(width, height);
}
goog.inherits(chemistry.Lane, lime.Node);

chemistry.Lane.prototype.addHighlightSprite = function(width, height) {
	this.highlightSprite = new lime.Sprite();
	this.appendChild(this.highlightSprite);
	this.highlightSprite.setSize(width,height);
	this.highlightSprite.setAnchorPoint(0,0);
	this.highlightSprite.setFill("#fff");
	this.highlightSprite.setOpacity(0);
}

chemistry.Lane.prototype.addTargetBox = function(width, height) {
	var goldenRatioInverse = 1/1.618;
	this.targetBox = new chemistry.TargetBox(width, width*goldenRatioInverse, this.number);
	this.targetBox.setAnchorPoint(0,0);
	this.targetBox.setPosition(0,height-goldenRatioInverse*width);
	this.appendChild(this.targetBox);

	var self = this;
	goog.events.listen(this.targetBox,['mousedown','touchstart'], function(e) {
		var correctAnswer = appObject.game.clickedTargetBox(self.number);
		self.targetBox.highlight(correctAnswer);
    });
}

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
	this.processMolecules(dt);
}

chemistry.Lane.prototype.processMolecules = function(dt) {
	var moleculesToBeRemoved = [];
	for(var i in this.molecules) {
		var molecule = this.molecules[i];
		molecule.tick(dt);
		if(molecule.getPosition().y >= this.targetBox.getPosition().y) {
			if(this.chainLength == molecule.chainLength) {
				// Correct, give score and increase life
				multiplier = 0;

				var score = (1 + multiplier)*molecule.score;
				appObject.game.addScore(score);
				appObject.game.addHP(5);
			} else {
				// Wrong, decrease life
				appObject.game.addHP(-10);
			}

			moleculesToBeRemoved.push(molecule);
		}
	}

	for(var i in moleculesToBeRemoved) {
		var molecule = moleculesToBeRemoved[i];
		this.removeMolecule(molecule);
		appObject.game.removeMolecule(molecule);
	}
}

chemistry.Lane.prototype.increaseHighlight = function() {
	this.numHighlight += 1;
	this.refreshHighlight();
}

chemistry.Lane.prototype.decreaseHighlight = function() {
	this.numHighlight -= 1;
	this.refreshHighlight();
}

chemistry.Lane.prototype.refreshHighlight = function() {
	if(this.currentAction) this.currentAction.stop();

	this.currentAction = new lime.animation.FadeTo(0.2*this.numHighlight);
	this.currentAction.setDuration(0.3);
	this.highlightSprite.runAction(this.currentAction);
}