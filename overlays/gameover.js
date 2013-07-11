goog.provide("chemistry.overlays.GameOver");

goog.require("lime.Layer");
goog.require("lime.Sprite");
goog.require("lime.Label");
goog.require("lime.GlossyButton");
goog.require("lime.animation.FadeTo");
goog.require("lime.animation.ScaleTo");
goog.require("lime.animation.Event");

chemistry.overlays.GameOver = function(width, height) {
    lime.Layer.call(this);

    this.setSize(width, height);

    this.background = new lime.Sprite();
    this.background.setFill("#fff");
    this.background.setSize(width, height);
    this.background.setPosition(0,0);
    this.background.setAnchorPoint(0,0);
    this.background.setOpacity(0.4);
    this.appendChild(this.background);

    this.gameOverLabel = new lime.Label("Game over");
    this.gameOverLabel.setFontSize(width / 16);
    this.gameOverLabel.setFontFamily('Pusab');
    this.gameOverLabel.setFontColor('#e00');
    this.gameOverLabel.setSize(width, width / 10);
    this.gameOverLabel.setPosition(width/2, height/2 -  width / 6);
    this.appendChild(this.gameOverLabel);

    this.retryButton = new lime.GlossyButton("Retry");
    this.retryButton.setFontSize(width / 16);
    this.retryButton.setSize(width / 2, width / 6);
    this.retryButton.setPosition(width/2, height/2 +  width / 6);

    goog.events.listen(this.retryButton, ["click"], this.retryButtonClicked, false, this);

    this.appendChild(this.retryButton);

    this.endGameButton = new lime.GlossyButton("End game");
    this.endGameButton.setFontSize(width / 16);
    this.endGameButton.setSize(width / 2, width / 6);
    this.endGameButton.setPosition(width/2, height/2 + 2* width / 6);

    goog.events.listen(this.endGameButton, ["click"], this.endGameButtonClicked, false, this);

    this.appendChild(this.endGameButton);
}
goog.inherits(chemistry.overlays.GameOver, lime.Layer);

chemistry.overlays.GameOver.prototype.gameOver = function() {
    this.setHidden(false);
    this.setOpacity(0);
    var animation = new lime.animation.FadeTo(1).setDuration(0.3);
    this.runAction(animation);
}

chemistry.overlays.GameOver.prototype.retryButtonClicked = function(ev) {
    var animation = new lime.animation.FadeTo(0).setDuration(0.3);
    this.runAction(animation);
    goog.events.listen(animation, lime.animation.Event.STOP, function() {
        goog.events.dispatchEvent(this, chemistry.overlays.GameOver.event.RETRY_BUTTON_CLICKED);
    }, false, this);
}

chemistry.overlays.GameOver.prototype.endGameButtonClicked = function(ev) {
    var animation = new lime.animation.FadeTo(0).setDuration(0.3);
    this.runAction(animation);
    goog.events.listen(animation, lime.animation.Event.STOP, function() {
        goog.events.dispatchEvent(this, chemistry.overlays.GameOver.event.END_GAME_BUTTON_CLICKED);
    }, false, this);
}

chemistry.overlays.GameOver.event = {
    RETRY_BUTTON_CLICKED: "RETRY_BUTTON_CLICKED",
    END_GAME_BUTTON_CLICKED: "END_GAME_BUTTON_CLICKED"
}
