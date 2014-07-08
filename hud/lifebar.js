goog.provide('chemistry.Lifebar');

goog.require('chemistry.events.GameEvent');
goog.require('lime.Node');
goog.require('lime.Sprite');
goog.require('lime.animation.ColorTo');
goog.require('lime.animation.Sequence');
goog.require('lime.animation.Loop');

chemistry.Lifebar = function(width, height) {
	lime.Node.call(this);
    this.setSize(width, height);

    var gridUnit = appObject.gridUnit;

//    this.background = new lime.Sprite().setFill("images/design/lifebar.png");
//    this.background.setSize(width, height);
//    this.background.setAnchorPoint(0,0);
//    this.appendChild(this.background);

    this.pulseBackground = new lime.Sprite().setFill("images/design/lifebar-pulsing.png");
    this.pulseBackground.setSize(25.8*gridUnit, 3.0*gridUnit);
    this.pulseBackground.setAnchorPoint(0,0);
    this.pulseBackground.setHidden(true);
    this.appendChild(this.pulseBackground);

	this.sprite = new lime.Sprite().setFill("#f00");
    this.sprite.setSize(23.8*gridUnit,0.8*gridUnit);
    this.sprite.setPosition(1.1*gridUnit, 1.1*gridUnit);
    this.sprite.setAnchorPoint(0,0);
    this.appendChild(this.sprite);

//    this.setScale(0.5,1);
	this.currentAction = null;
}
goog.inherits(chemistry.Lifebar, lime.Node);

chemistry.Lifebar.prototype.setHP = function(hp) {
	var scaleX = hp/100;
	var scaleAction = new lime.animation.ScaleTo(scaleX,1).setDuration(0.3).enableOptimizations();
    this.sprite.runAction(scaleAction);
}

chemistry.Lifebar.prototype.enterFeverMode = function(e) {
    if(this.currentAction) {
        this.currentAction.stop();
    }
    this.pulseBackground.setHidden(false);
//    this.background.setHidden(true);

	var blink = new lime.animation.Sequence(
				new lime.animation.ColorTo("#0be100").setDuration(0.2),
				new lime.animation.ColorTo("#d5f500").setDuration(0.2)
		);
	this.currentAction = new lime.animation.Loop(blink).enableOptimizations();
	this.sprite.runAction(this.currentAction);
}

chemistry.Lifebar.prototype.exitFeverMode = function(e) {
    if(this.currentAction) {
        this.currentAction.stop();
    }

    this.pulseBackground.setHidden(false);
//    this.background.setHidden(true);

	this.currentAction = new lime.animation.ColorTo("#f00").setDuration(0.5).enableOptimizations();
	this.sprite.runAction(this.currentAction);
}
