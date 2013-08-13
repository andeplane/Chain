goog.provide('chemistry.Leaderboard');
goog.require('chemistry.HighscoreEntry');

goog.require('lime.Scene');
goog.require('lime.Sprite');

chemistry.Leaderboard = function(width, height, difficulty) {
	lime.Scene.call(this);

	this.setSize(width, height);
	this.addBackground(width, height);

	this.difficulty = difficulty;
	this.title = difficulty == 0 ? "Easy Leaderboards" : (difficulty == 1 ? "Medium Leaderboards" : "Hard Leaderboards");
	this.statusLabel = new lime.Label().setPosition(appObject.screenWidth / 2.0, 20).setFontSize(30).setText("Loading ...").setFontColor("#fff");
	this.backButton = new lime.Label().setText("<<").setPosition(appObject.screenWidth / 2.0 - 200, 20).setFontSize(30).setFontColor("#fff");
	goog.events.listen(this.backButton, ['mousedown','touchstart'], function(e) { appObject.showMainMenu(); }, false, this);

	this.highscoreEntryLayer = new lime.Layer().setSize(width, height);
	this.appendChild(this.highscoreEntryLayer);
	this.appendChild(this.statusLabel);
	this.appendChild(this.backButton);

	this.refresh();
}
goog.inherits(chemistry.Leaderboard, lime.Scene);

chemistry.Leaderboard.prototype.addBackground = function(width, height) {
    this.background = new lime.Sprite();
    this.background.setFill("design/export/background.png");
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
}

chemistry.Leaderboard.prototype.refresh = function() {
	this.statusLabel.setText("Loading ...");
	this.highscoreEntryLayer.removeAllChildren();

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
				self.highscoreEntryLayer.appendChild(highscoreEntry);
				highscoreEntry.setPosition(appObject.screenWidth / 2.0, 80 + 20*i);
			}
			self.statusLabel.setText(self.title);
			if(scores.length == 0) self.statusLabel.setText("No scores.");
		}
	}
	http.send(null);
};