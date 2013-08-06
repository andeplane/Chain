goog.provide('chemistry.Stats');

chemistry.Stats = function(game) {
	this.game 			 = game;
	this.numCorrect 	 = 0;
	this.numWrong		 = 0;


	goog.events.listen(game, chemistry.events.GameEvent.CORRECT_ANSWER, this.correctAnswer, false, this);
	goog.events.listen(game, chemistry.events.GameEvent.CORRECT_ANSWER, this.wrongAnswer, false, this);
}
goog.inherits(chemistry.Level, goog.events.EventTarget);

chemistry.Stats.prototype.correctAnswer = function() {
	// body...
};