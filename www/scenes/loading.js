goog.provide('chemistry.LoadingScene');

goog.require('chemistry.events.GameEvent');
goog.require('chemistry.Facebook');

goog.require('lime.Sprite');
goog.require('lime.Label');
goog.require('lime.Scene');
goog.require('lime.GlossyButton');

chemistry.LoadingScene = function(width, height) {
    lime.Scene.call(this);

    this.background = new lime.Sprite();
    this.background.setFill("images/design/mainmenu/background.png");
    this.background.setAnchorPoint(0,0);
    this.background.setSize(width, height);
    this.appendChild(this.background);
    this.loadingText = new lime.Label().setFontFamily("Arial").setText("Loading...").setFontSize(height * 0.03).setFontColor("#FFFFFF").setAnchorPoint(0.5, 0.5).setPosition(width / 2, height / 2);
    this.appendChild(this.loadingText);
}
goog.inherits(chemistry.LoadingScene, lime.Scene);

chemistry.LoadingScene.prototype.setProgress = function(progress) {
    var progressPercent = Math.round(progress * 100,0);
    this.loadingText.setText("Loading " + progressPercent + " %")
}
