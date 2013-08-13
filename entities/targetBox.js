goog.provide('chemistry.TargetBox');

goog.require('lime.Node');
goog.require('lime.Sprite');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.FadeTo');

chemistry.TargetBox = function(width, height, number, chainLength, imageFilePrefix) {
	lime.Node.call(this);
	this.setSize(width, height);
	this.number = number;
    this.chainLength = chainLength;

//	var colors = ["#eee", "#ddd", "#eee", "#ddd"];

    var imageFile = "design/export/button" + chainLength + ".png";
    var imageFileSuccess = "design/export/highlight-success.png";
    var imageFileFail = "design/export/highlight-fail.png";
	
    var buttonImage = new lime.Sprite();
    buttonImage.setAnchorPoint(0,0);
    buttonImage.setSize(width, height);
    buttonImage.setFill(imageFile);
    this.appendChild(buttonImage);

//    var numberLabel = new lime.Label(chainLength);
//    numberLabel.setPosition(width/2, height/2);
//    numberLabel.setFontSize(width/5);
//    numberLabel.setFontFamily("Sonsie One");
//    this.appendChild(numberLabel);

    goog.events.listen(buttonImage,['mousedown','touchstart'], function(e) {
        goog.events.dispatchEvent(this, new chemistry.events.TargetBoxEvent(chemistry.events.TargetBoxEvent.CLICKED_TARGET_BOX, this), null);
    }, false, this);

    this.buttonImageSuccess = new lime.Sprite();
    this.buttonImageSuccess.setAnchorPoint(0,0);
    this.buttonImageSuccess.setSize(width, height);
    this.buttonImageSuccess.setFill(imageFileSuccess);
    this.buttonImageSuccess.setOpacity(0);
    this.appendChild(this.buttonImageSuccess);

    this.buttonImageFail = new lime.Sprite();
    this.buttonImageFail.setAnchorPoint(0,0);
    this.buttonImageFail.setSize(width, height);
    this.buttonImageFail.setFill(imageFileFail);
    this.buttonImageFail.setOpacity(0);
    this.appendChild(this.buttonImageFail);
}
goog.inherits(chemistry.TargetBox, lime.Node);

chemistry.TargetBox.prototype.highlight = function(correctAnswer) {
    var fadeAnimation = new lime.animation.Sequence(
                new lime.animation.FadeTo(1.0).setDuration(0.1),
                new lime.animation.FadeTo(0).setDuration(0.3)
                );
    if(correctAnswer) {
        this.buttonImageSuccess.runAction(fadeAnimation);
    } else {
        this.buttonImageFail.runAction(fadeAnimation);
    }
}
