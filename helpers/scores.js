goog.provide('chemistry.Scores');
goog.require('chemistry.Game');

chemistry.Scores = function(balle) {
	this.allScores = [];
	this.unsentScores = [];
	this.highscores = [0, 0, 0];
    if(localStorage.allScores) this.allScores = localStorage.allScores;
    if(localStorage.unsentScores) this.unsentScores = localStorage.unsentScores;
    if(localStorage.highscores) this.highscores = localStorage.highscores;
}

chemistry.Scores.prototype.sendUnsentScores = function() {
	var http = new XMLHttpRequest();

	var url = "http://kvakkefly.com/chemadd.php";
	var data = {"fbid": appObject.facebook.fbid, 
				"name": appObject.facebook.name,
				"uuid": appObject.uuid,
				"scores": this.unsentScores
				};
	var dataString = JSON.stringify(data);
	var params = dataString;
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	http.onreadystatechange = function() {//Call a function when the state changes.
		if(http.readyState == 4 && http.status == 200) {
			this.unsentScores = [];
			localStorage.unsentScores = [];
		}
	}
	http.send(params);
}

chemistry.Scores.prototype.newScore = function() {
	var game = appObject.game;

	this.allScores.push(game.score);
	this.unsentScores.push(game.score);
	if(game.score.score > this.highscores[game.difficulty]) {
		this.highscores[game.difficulty] = game.score;
	}

	this.sendUnsentScores();
	localStorage.allScores = this.allScores;
	localStorage.highscores = this.highscores;
};
