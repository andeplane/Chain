goog.provide('chemistry.Score');

chemistry.Score = function(difficulty) {
	this.score = 0;
	this.timestamp = parseInt(new Date().getTime() / 1000);
	this.difficulty = difficulty;
	this.hash = md5(this.timestamp+"-"+localStorage.uuid+"-"+this.score);
}

chemistry.Score.prototype.add = function(value) {
	this.score += value;
	this.hash = md5(this.timestamp+"-"+localStorage.uuid+"-"+this.score);
}