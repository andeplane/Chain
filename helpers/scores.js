goog.provide('chemistry.Scores');
goog.require('chemistry.Game');

chemistry.Scores = function(balle) {
	this.allScores = [];
	this.unsentScores = [];
    this.highscores = [0, 0, 0];
    if(localStorage.allScores) this.allScores = JSON.parse(localStorage.allScores);
    if(localStorage.unsentScores) this.unsentScores = JSON.parse(localStorage.unsentScores);
    if(localStorage.highscores) this.highscores = JSON.parse(localStorage.highscores);
}

chemistry.Scores.prototype.sendUnsentScores = function() {
	var self = this;
	var url = "http://www.mn.uio.no/kjemi/english/research/about/infrastructure/tools/chain/chemadd.php";
	var http = new XMLHttpRequest();
	http.open("POST", url);
	
	var data = {"fbid": appObject.facebook.fbid, 
				"name": appObject.facebook.name,
				"uuid": localStorage.uuid,
				"scores": this.unsentScores
				};

	var dataString = JSON.stringify(data);
	var params = dataString;
	
	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	
	http.onreadystatechange = function() { 
		if(http.readyState == 4 && http.status == 200) {
			// console.log(http.responseText);
			var res = JSON.parse(http.responseText);
			if(!res.error) {
				self.unsentScores = [];
                localStorage.unsentScores = JSON.stringify([]);
			}
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
	localStorage.allScores = JSON.stringify(this.allScores);
	localStorage.highscores = JSON.stringify(this.highscores);
};
