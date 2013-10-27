goog.provide('chemistry.AboutScene');

goog.require('lime.Scene');
goog.require('lime.Sprite');

chemistry.AboutScene = function(width, height) {
    lime.Scene.call(this);

    this.setSize(width, height);
    this.addBackground(width, height);

    this.titleLabel = new lime.Label().setPosition(width / 2.0, appObject.gridUnit * 4).setFontSize(appObject.gridUnit * 2).setText("About Chain").setFontColor("#e7ecfe").setAnchorPoint(0.5, 0.5).setAlign("center").setSize(width, 0);
    this.backButton = new lime.Sprite().setFill("images/design/backbutton.png").setSize(8 * appObject.gridUnit, 8 * appObject.gridUnit).setAnchorPoint(0,0);
    goog.events.listen(this.backButton, ['mousedown','touchstart'], function(e) { appObject.showMainMenu(); }, false, this);

    var textContents = "Chain is a game developed at the University of Oslo. ";

    this.text = new lime.Label().setText(textContents).setPosition(width/2.0, height/1.8).setFontSize(appObject.gridUnit * 1.4).setSize(width * 0.70,height*0.6).setFontColor("#FFF").setFontFamily("Arial");

    this.highscoreEntryLayer = new lime.Layer();
    this.appendChild(this.highscoreEntryLayer);
    this.appendChild(this.titleLabel);
    this.appendChild(this.backButton);
    this.appendChild(this.text);
}
goog.inherits(chemistry.AboutScene, lime.Scene);

chemistry.AboutScene.prototype.addBackground = function(width, height) {
    this.background = new lime.Sprite();
    this.background.setFill("images/design/leaderboards/background.png");
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
}
