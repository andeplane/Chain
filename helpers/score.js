goog.provide('chemistry.Score');

chemistry.Score = function() {
	this.score = 0;
	this.timestamp = new Date().getTime() / 1000;
}

chemistry.Score.prototype.add = function(value) {
	this.score += value;
}