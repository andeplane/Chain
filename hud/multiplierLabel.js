goog.provide('chemistry.MultiplierLabel');

goog.require('lime.Label');

chemistry.MultiplierLabel = function(multiplier) {
	lime.Label.call(this);

	this.setFontSize(30).
        setFontFamily("Sonsie One").
        setFontColor("#c8d5fc").
		setText(multiplier+"x");
	this.currentAction = null;
	// COLORS: [Not used, not used, bronze, silver, gold, diamond]
	this.colors = ["#000", "#000", "#CD7F32", "#CCCCCC", "#EAC117", "#0EBFE9"];
}
goog.inherits(chemistry.MultiplierLabel, lime.Label);

chemistry.MultiplierLabel.prototype.jump = function() {
	if(this.currentAction) this.currentAction.stop();

	this.currentAction = new lime.animation.Sequence(
		new lime.animation.ScaleTo(2,2).setDuration(0.1),
		new lime.animation.ScaleTo(1,1).setDuration(0.1)
		);
	this.runAction(this.currentAction);
}
