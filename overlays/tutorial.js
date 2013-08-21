goog.provide('chemistry.overlays.Tutorial');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.FadeTo');

chemistry.overlays.Tutorial = function(width, height, difficulty) {
    lime.Layer.call(this);
    this.setSize(width, height);
    this.setAnchorPoint(0,0);

    var imageFile = "";
    switch(difficulty) {
    case 0:
        imageFile = "design/tutorials/tutorial-easy.png";
        break;
    case 1:
        imageFile = "design/tutorials/tutorial-medium.png";
        break;
    case 2:
        imageFile = "design/tutorials/tutorial-hard.png";
        break;
    }

    var tutorialScreenBackground = new lime.Sprite().setFill("#000").setOpacity(0.6).setSize(width, height).setAnchorPoint(0,0);
    this.tutorialSprite = new lime.Sprite().setFill(imageFile).setSize(width, height).setAnchorPoint(0,0);
    this.appendChild(tutorialScreenBackground);
    this.appendChild(this.tutorialSprite);
}
goog.inherits(chemistry.overlays.Tutorial, lime.Layer);

chemistry.overlays.Tutorial.prototype.reveal = function() {
    this.tutorialSprite.setPosition(-this.getSize().width, 0);
    var animation = new lime.animation.MoveTo(0,0).setDuration(1.0).setEasing(lime.animation.Easing.EASEINOUT);
    this.tutorialSprite.runAction(animation);
}

chemistry.overlays.Tutorial.prototype.conceal = function(callback, nothing, self) {
    var animation = new lime.animation.FadeTo(0);
    goog.events.listen(animation, lime.animation.Event.STOP, callback, nothing, self);
    this.runAction(animation);
}
