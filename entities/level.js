goog.provide('chemistry.Level');

chemistry.Level = function(difficulty, game) {
	this.difficulty = difficulty;
	this.game 		= game;
}

chemistry.Level.prototype.getVelocity = function() {

}

chemistry.Level.prototype.getHP = function(correctAnswer) {
	return correctAnswer ? 5 : -10;
}