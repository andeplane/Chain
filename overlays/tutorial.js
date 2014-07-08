goog.provide('chemistry.overlays.Tutorial');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.FadeTo');

chemistry.overlays.Tutorial = function(width, height, difficulty, onHide, game) {
    lime.Layer.call(this);
    this.setSize(width, height);
    this.setAnchorPoint(0,0);
    this.onHide = onHide;

    var gridUnit = appObject.gridUnit;
    this.tutorialImageFile = "";
    this.tutorialTextImageFile = "";
    var questionMarkImageFile = "images/design/tutorials/questionmark.png";
    switch(difficulty) {
    case 0:
        this.tutorialImageFile = "images/design/tutorials/tutorial-easy.png";
        this.tutorialTextImageFile = "images/design/tutorials/tutorial-easy-text.png";
        break;
    case 1:
        this.tutorialImageFile = "images/design/tutorials/tutorial-medium.png";
        this.tutorialTextImageFile = "images/design/tutorials/tutorial-medium-text.png";
        break;
    case 2:
        this.tutorialImageFile = "images/design/tutorials/tutorial-hard.png";
        this.tutorialTextImageFile = "images/design/tutorials/tutorial-hard-text.png";
        break;
    }

    this.tutorialScreenBackground = new lime.Sprite().setFill("#000").setOpacity(0.6).setSize(width, height).setAnchorPoint(0,0);
    var imageRatio = 1.5;
    this.tutorialSprite = new lime.Sprite().setFill(this.tutorialImageFile).setSize(height / imageRatio, height).setAnchorPoint(0.5,0.5);
    this.appendChild(this.tutorialScreenBackground);
    this.appendChild(this.tutorialSprite);

    goog.events.listen(this.tutorialScreenBackground, ['mousedown', 'touchstart'], this.onHide, false, game);

    var questionMarkButton = new lime.Sprite().setFill(questionMarkImageFile).setPosition(7.0*gridUnit, 7.0*gridUnit).setSize(6*gridUnit, 6*gridUnit).setAnchorPoint(0,0);
    goog.events.listen(questionMarkButton, ['mousedown','touchstart'], this.questionMarkClicked, false, this);
    this.appendChild(questionMarkButton);
    
    this.isShowingTutorialText = false;
}
goog.inherits(chemistry.overlays.Tutorial, lime.Layer);

chemistry.overlays.Tutorial.prototype.questionMarkClicked = function(e) {
    e.event.stopPropagation();
    if(this.isShowingTutorialText) {
        this.tutorialSprite.setFill(this.tutorialImageFile)
    } else {
        this.tutorialSprite.setFill(this.tutorialTextImageFile)
    }
    
    this.isShowingTutorialText = !this.isShowingTutorialText;
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
