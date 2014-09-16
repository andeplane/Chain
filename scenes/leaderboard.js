goog.provide('chemistry.Leaderboard');
goog.require('chemistry.HighscoreEntry');

goog.require('lime.Scene');
goog.require('lime.Sprite');

chemistry.Leaderboard = function(width, height, difficulty) {
	lime.Scene.call(this);

	this.setSize(width, height);
	this.addBackground(width, height);

	this.difficulty = difficulty;
    switch(difficulty) {
    case 0:
        this.title = "Easy"
        break;
    case 1:
        this.title = "Medium"
        break;
    case 2:
        this.title = "Hard"
        break;
    }
    this.titleLabel = new lime.Label().setPosition(width / 2.0, appObject.gridUnit * 4).setFontSize(appObject.gridUnit * 2).setText("Loading ...").setFontColor("#e7ecfe").setAnchorPoint(0.5, 0.5).setAlign("center").setSize(width, 0);
    this.titleLabel2 = new lime.Label().setPosition(width / 2.0, appObject.gridUnit * 7).setFontSize(appObject.gridUnit * 2).setText("Leaderboards").setFontColor("#e7ecfe").setAlign("center").setSize(width, 0);
    this.backButton = new lime.Sprite().setFill("images/design/backbutton.png").setSize(8 * appObject.gridUnit, 8 * appObject.gridUnit).setAnchorPoint(0,0);
	goog.events.listen(this.backButton, ['mousedown','touchstart'], function(e) { appObject.showMainMenu(); }, false, this);

	this.highscoreEntryLayer = new lime.Layer();
    this.appendChild(this.highscoreEntryLayer);
    this.appendChild(this.titleLabel);
    this.appendChild(this.titleLabel2);
	this.appendChild(this.backButton);
}
goog.inherits(chemistry.Leaderboard, lime.Scene);

chemistry.Leaderboard.prototype.addBackground = function(width, height) {
    this.background = new lime.Sprite();
    this.background.setFill("images/design/leaderboards/background.png");
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
}

chemistry.Leaderboard.prototype.setOffline = function() {
    this.titleLabel.setText("Not connected.");
}

chemistry.Leaderboard.prototype.refresh = function() {
    this.titleLabel.setText("Loading ...");
	this.highscoreEntryLayer.removeAllChildren();

    var startYPosition = appObject.gridUnit * 15;

	var http = new XMLHttpRequest();

	// var url = "http://kvakkefly.com/leaderboards.php?difficulty="+this.difficulty;
    var url = "http://www.mn.uio.no/kjemi/english/research/about/infrastructure/tools/chain/leaderboards.php?difficulty="+this.difficulty;
	http.open("GET", url, true);

	// Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	http.timeout = 5000;
	var self = this;
	http.ontimeout = this.setOffline;

	http.onreadystatechange = function() { 
		if(http.readyState == 4 && http.status == 200) {
			var scores = JSON.parse(http.responseText);
            scores.length = 12;
			for(var i in scores) {
				var index = parseInt(i) + 1;
				var score = scores[i];
				var name = score.name;
                var value = score.score;

                var color = "#e7ecfe";
                if(appObject.facebook.name === name && (name !== "Anonymous" || name !== "Banana")) {
                    color = "#ffd270";
                }

                var numberLabel = new lime.Label().setText("#" + index).setFontColor(color).setAlign("left").setFontSize(appObject.gridUnit * 1);
                var nameLabel = new lime.Label().setText(name).setFontColor(color).setAlign("left").setFontFamily("Arial").setStyle("italic").setFontWeight("bold").setFontSize(appObject.gridUnit * 1);
                var scoreLabel = new lime.Label().setText(value).setFontColor(color).setAlign("right").setFontSize(appObject.gridUnit * 1);

                numberLabel.setAnchorPoint(0,0.5);
                nameLabel.setAnchorPoint(0,0.5);
                scoreLabel.setAnchorPoint(1,0.5);

                numberLabel.setPosition(appObject.gridUnit * 8, startYPosition + appObject.gridUnit * 2.5 * i);
                nameLabel.setPosition(appObject.gridUnit * 11, startYPosition + appObject.gridUnit * 2.5 * i);
                scoreLabel.setPosition(appObject.gridUnit * 32, startYPosition + appObject.gridUnit * 2.5 * i);

                self.highscoreEntryLayer.appendChild(numberLabel);
                self.highscoreEntryLayer.appendChild(nameLabel);
				self.highscoreEntryLayer.appendChild(scoreLabel);
			}
            self.titleLabel.setText(self.title);
            if(scores.length === 0) {
                var noScoresLabel = new lime.Label().setText("No scores yet...").setFontColor("#fff").setAlign("center").setFontSize(appObject.gridUnit * 2);
                noScoresLabel.setPosition(self.getSize().width / 2, self.getSize().height / 2);
                self.highscoreEntryLayer.appendChild(noScoresLabel);
            }
		}
	}
	if(appObject.isConnected) {
		http.send(null);
	} else {
		this.setOffline();
	}
	
};
