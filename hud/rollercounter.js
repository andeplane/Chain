goog.provide('chemistry.RollerCounter');
goog.require('lime.Label');

chemistry.RollerCounter = function() {
	lime.Label.call(this);
	this.setFontSize(50);
	this.setText('0');
	this.currentScore = 0;
}
goog.inherits(chemistry.RollerCounter, lime.Label);

chemistry.RollerCounter.prototype.tick = function() {
	// TODO: Update label text based on currentScore
	this.currentScore = appObject.game.score;
	this.setText(this.currentScore);
}

// TODO:
// Add flashy effects