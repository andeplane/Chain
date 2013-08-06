goog.provide("chemistry.overlays.LevelUp");

goog.require("lime.Layer");
goog.require("lime.animation.FadeTo");
goog.require("lime.animation.ScaleTo");

chemistry.overlays.LevelUp = function(width, height) {
    lime.Layer.call(this);

    this.setSize(width, height);

    this.levelUpText = new lime.Label("Level 5");
    this.levelUpText.setFontSize(width / 16);
    this.levelUpText.setFontFamily('Sonsie One');
    this.levelUpText.setFontColor('#e00');
    this.levelUpText.setSize(width, width / 10);
    this.levelUpText.setPosition(width/2, height/2);
    this.appendChild(this.levelUpText);
}
goog.inherits(chemistry.overlays.LevelUp, lime.Layer);

chemistry.overlays.LevelUp.prototype.levelUp = function(levelNumber) {
    this.setHidden(false);
    this.levelUpText.setText("Level " + levelNumber);
    this.levelUpText.setOpacity(1);
    this.levelUpText.setScale(1);
    var animation = new lime.animation.Spawn(
        new lime.animation.ScaleTo(10,10).setDuration(3.0),
        new lime.animation.FadeTo(0).setDuration(2.0)
        );
    this.levelUpText.runAction(animation);
    goog.events.listen(animation, lime.animation.Event.STOP, this.endedLevelUp, false, this);
}

chemistry.overlays.LevelUp.prototype.endedLevelUp = function(event) {
    this.setHidden(true);
}
