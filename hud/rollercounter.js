goog.provide('chemistry.RollerCounter');
goog.require('lime.Label');

chemistry.RollerCounter = function() {
	lime.Label.call(this);
	this.setFontSize(40);
	this.setFontFamily('Pusab');
	this.setFontColor('#e00');
	this.setText('0');
	this.currentScore = 0;
	this.currentAction = null;
}
goog.inherits(chemistry.RollerCounter, lime.Label);

chemistry.RollerCounter.prototype.tick = function() {
	// TODO: Update label text based on currentScore
	var diff = parseInt(appObject.game.score) - this.currentScore;
	if(diff > 200)      { this.currentScore += 23; }
	else if(diff > 100) { this.currentScore += 17; }
	else if(diff > 50)  { this.currentScore += 9; }
	else if(diff > 30)  { this.currentScore += 6; }
	else if(diff > 10)  { this.currentScore += 3; }
	else if(diff>0) 	{ this.currentScore += 1; }

	this.setText(this.currentScore);
}

chemistry.RollerCounter.prototype.jump = function() {
	if(this.currentAction) {this.currentAction.stop(); }

	this.currentAction = new lime.animation.Sequence(
		new lime.animation.ScaleTo(1.7,1.7).setDuration(0.1).setEasing(lime.animation.Easing.LINEAR),
		new lime.animation.ScaleTo(1,1).setDuration(0.2)
		);
	this.runAction(this.currentAction);
}