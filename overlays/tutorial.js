goog.provide('chemistry.overlays.Tutorial');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.FadeTo');

chemistry.overlays.Tutorial = function(width, height, difficulty) {
    lime.Layer.call(this);
    this.setSize(width, height);
    this.setAnchorPoint(0,0);

    var tutorialImageFile = "";
    var questionMarkImageFile = "images/design/tutorials/questionmark.png";
    switch(difficulty) {
    case 0:
        tutorialImageFile = "images/design/tutorials/tutorial-easy.png";
        break;
    case 1:
        tutorialImageFile = "images/design/tutorials/tutorial-medium.png";
        break;
    case 2:
        tutorialImageFile = "images/design/tutorials/tutorial-hard.png";
        break;
    }

    var tutorialScreenBackground = new lime.Sprite().setFill("#000").setOpacity(0.6).setSize(width, height).setAnchorPoint(0,0);
    var imageRatio = 1.5;
    this.tutorialSprite = new lime.Sprite().setFill(tutorialImageFile).setSize(height / imageRatio, height).setAnchorPoint(0.5,0.5);
    this.appendChild(tutorialScreenBackground);
    this.appendChild(this.tutorialSprite);

    var questionMarkButton = new lime.Sprite().setFill(questionMarkImageFile).setPosition(0.0, 0.0);
    goog.events.listen(questionMarkButton, ['mousedown','touchstart'], this.questionMarkClicked, false, this);
    this.appendChild(questionMarkButton);
    this.isShowingTutorialExplanation = false;
}
goog.inherits(chemistry.overlays.Tutorial, lime.Layer);

chemistry.overlays.Tutorial.prototype.questionMarkClicked = function(e) {
    console.log("clicked question mark")
}

chemistry.overlays.Tutorial.prototype.reveal = function() {
    this.tutorialSprite.setPosition(-this.getSize().width + -this.getSize().width / 2, this.getSize().height / 2);
    var animation = new lime.animation.MoveTo(this.getSize().width / 2, this.getSize().height / 2).setDuration(0.5).setEasing(lime.animation.Easing.EASEINOUT);
    this.tutorialSprite.runAction(animation);
}

chemistry.overlays.Tutorial.prototype.conceal = function(callback, nothing, self) {
    var animation = new lime.animation.FadeTo(0).setDuration(0.2);
    goog.events.listen(animation, lime.animation.Event.STOP, callback, nothing, self);
    this.runAction(animation);
}
