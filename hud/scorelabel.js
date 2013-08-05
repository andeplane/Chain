goog.provide('chemistry.ScoreLabel');

goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.FadeTo');

chemistry.ScoreLabel = function() {
	lime.Label.call(this);

	this.setFontFamily('Pusab');
	this.setFontColor('#d2c601');
}
goog.inherits(chemistry.ScoreLabel, lime.Label);

chemistry.ScoreLabel.prototype.animateScore = function(score, x, y) {
	console.log(score);
	this.setText(parseInt(score.score));
	this.setPosition(x,y);
	var animation = new lime.animation.Spawn(
		new lime.animation.ScaleTo(15,15).setDuration(1.0).enableOptimizations(),
		new lime.animation.FadeTo(0).setDuration(0.5).enableOptimizations()
		).enableOptimizations();
	this.runAction(animation);
	return animation;
}