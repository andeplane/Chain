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

    var gridUnit = width / 40;

    this.background = new lime.Sprite();
    this.background.setFill("design/export/gameover/background.png");
    this.background.setSize(width, height);
    this.background.setPosition(0,0);
    this.background.setAnchorPoint(0,0);
    this.appendChild(this.background);

//    this.gameOverLabel = new lime.Label("Game over");
//    this.gameOverLabel.setFontSize(width / 16);
//    this.gameOverLabel.setFontFamily('Sonsie One');
//    this.gameOverLabel.setFontColor('#c8d5fc');
//    this.gameOverLabel.setSize(width, width / 10);
//    this.gameOverLabel.setPosition(width/2, height/2 -  width / 6);
//    this.appendChild(this.gameOverLabel);

    this.retryButton = new lime.Sprite().setFill("design/export/gameover/retrybutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit,19*gridUnit).setAnchorPoint(0,0);

    goog.events.listen(this.retryButton, ["mousedown", "touchstart"], this.retryButtonClicked, false, this);

    this.appendChild(this.retryButton);

<<<<<<< HEAD
    this.endGameButton = new lime.Sprite().setFill("design/export/gameover/endgamebutton.png").setSize(30*gridUnit,7*gridUnit).setPosition(5*gridUnit,25*gridUnit).setAnchorPoint(0,0);
=======
    this.endGameButton = new lime.GlossyButton("Main Menu");
    this.endGameButton.setFontSize(width / 16);
    this.endGameButton.setSize(width / 2, width / 6);
    this.endGameButton.setPosition(width/2, height/2 + 2* width / 6);
>>>>>>> 999c09e8247d6d1b8203d921fe6e3d8a0f6cbf04

    goog.events.listen(this.endGameButton, ["mousedown", "touchstart"], this.endGameButtonClicked, false, this);

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
    if(this.getHidden()) return;
    var animation = new lime.animation.FadeTo(0).setDuration(0.3);
    this.runAction(animation);
    goog.events.listen(animation, lime.animation.Event.STOP, function() {
        goog.events.dispatchEvent(this, chemistry.overlays.GameOver.event.RETRY_BUTTON_CLICKED);
    }, false, this);
}

chemistry.overlays.GameOver.prototype.endGameButtonClicked = function(ev) {
    if(this.getHidden()) return;
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
