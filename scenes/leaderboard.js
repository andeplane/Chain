goog.provide('chemistry.Leaderboard');
goog.require('chemistry.HighscoreEntry');

goog.require('lime.Scene');

chemistry.Leaderboard = function(difficulty) {
	lime.Scene.call(this);
	this.setSize(appObject.screenWidth, appObject.screenHeight);
	this.difficulty = difficulty;
	this.title = difficulty == 0 ? "Easy Leaderboards" : (difficulty == 1 ? "Medium Leaderboards" : "Hard Leaderboards");
	this.statusLabel = new lime.Label().setPosition(appObject.screenWidth / 2.0, 20).setFontSize(30).setText("Loading ...");
	this.backButton = new lime.Label().setText("<<").setPosition(appObject.screenWidth / 2.0 - 200, 20).setFontSize(30);
	goog.events.listen(this.backButton, ['mousedown','touchstart'], function(e) { appObject.showMainMenu(); }, false, this);
	this.refresh();
}
goog.inherits(chemistry.Leaderboard, lime.Scene);

chemistry.Leaderboard.prototype.refresh = function() {
	this.removeAllChildren();
	this.appendChild(this.statusLabel);
	this.appendChild(this.backButton);
	this.statusLabel.setText("Loading ...");
	
	var http = new XMLHttpRequest();

	var url = "http://kvakkefly.com/leaderboards.php?difficulty="+this.difficulty;
	http.open("GET", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var self = this;
	http.onreadystatechange = function() { 
		if(http.readyState == 4 && http.status == 200) {
			var scores = JSON.parse(http.responseText);
			for(var i in scores) {
				var index = parseInt(i) + 1;
				var score = scores[i];
				var name = score.name;
				var value = score.score;
				var highscoreEntry = new chemistry.HighscoreEntry(index, name, value);
				self.appendChild(highscoreEntry);
				highscoreEntry.setPosition(appObject.screenWidth / 2.0, 80 + 20*i);
			}
			self.statusLabel.setText(self.title);
			if(scores.length == 0) self.statusLabel.setText("No scores.");
		}
	}
	http.send(null);
};