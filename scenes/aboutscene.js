goog.provide('chemistry.AboutScene');

goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('lime.GlossyButton');
goog.require('lime.RoundedRect');

chemistry.AboutScene = function(width, height) {
    lime.Scene.call(this);

    this.setSize(width, height);
    this.addBackground(width, height);

    this.titleLabel = new lime.Label().setPosition(width / 2.0, appObject.gridUnit * 4).setFontSize(appObject.gridUnit * 2).setText("About Chain").setFontColor("#e7ecfe").setAnchorPoint(0.5, 0.5).setAlign("center").setSize(width, 0);
    this.backButton = new lime.Sprite().setFill("images/design/backbutton.png").setSize(8 * appObject.gridUnit, 8 * appObject.gridUnit).setAnchorPoint(0,0);
    goog.events.listen(this.backButton, ['mousedown','touchstart'], function(e) { appObject.showMainMenu(); }, false, this);

    var textContents = "Chain is a game developed at the University of Oslo.";

    this.text = new lime.Label().setText(textContents).setPosition(width/2.0, height * 0.25).setFontSize(appObject.gridUnit * 1.4).setSize(width * 0.70,0).setFontColor("#FFF").setFontFamily("Arial");

    this.howToPlay = new lime.Sprite().setFill("images/design/about/howtoplay.png").setSize(25 * appObject.gridUnit, 5 * appObject.gridUnit).setPosition(width / 2, height * 0.5);
    goog.events.listen(this.howToPlay, ['mousedown','touchstart'], this.howToPlayClicked, false, this);

    this.feedback = new lime.Sprite().setFill("images/design/about/feedback.png").setSize(25 * appObject.gridUnit, 5 * appObject.gridUnit).setPosition(width / 2, height * 0.65);
    goog.events.listen(this.feedback, ['mousedown','touchstart'], this.feedbackClicked, false, this);

    this.previousFeedback = "";

    this.highscoreEntryLayer = new lime.Layer();
    this.appendChild(this.highscoreEntryLayer);
    this.appendChild(this.titleLabel);
    this.appendChild(this.backButton);
    this.appendChild(this.text);
    this.appendChild(this.howToPlay);
    this.appendChild(this.feedback);
}
goog.inherits(chemistry.AboutScene, lime.Scene);

chemistry.AboutScene.prototype.addBackground = function(width, height) {
    this.background = new lime.Sprite();
    this.background.setFill("images/design/leaderboards/background.png");
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
}

chemistry.AboutScene.prototype.howToPlayClicked = function() {
    window.open('http://www.mn.uio.no/kjemi/english/services/knowledge/chain/playing-chain.html', '_blank');
}


chemistry.AboutScene.prototype.feedbackClicked = function() {
    this.previousFeedback = prompt("Feedback:", this.previousFeedback);
    var http = new XMLHttpRequest();

    var url = "http://kvakkefly.com/";
    var data = {"feedback": this.previousFeedback};
    var dataString = JSON.stringify(data);
    var params = dataString;

    http.open("POST", url, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
        if(http.readyState == 4) {
            if(http.status == 200) {
                alert("Thank you for your feedback!");
            } else {
                alert("Your feedback could not be sent, please try again later");
            }
        }
    }
    http.send(params);
}
