goog.provide('chemistry.Score');

chemistry.Score = function(difficulty) {
	this.score = 0;
	this.timestamp = new Date().getTime() / 1000;
	this.difficulty = difficulty;
}

chemistry.Score.prototype.add = function(value) {
	this.score += value;
}