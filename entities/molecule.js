goog.provide('chemistry.Molecule');

goog.require('lime.Sprite');
goog.require('lime.animation.RotateBy');
goog.require('lime.animation.Loop');
goog.require('goog.math');

chemistry.Molecule = function(data) {
	lime.Sprite.call(this);

	this.data = data;
	this.setSize(data.size[0],data.size[1]);
	this.setFill(data.imageFile);
	// Rotate by n*90 degrees for more variations
	var rnd = goog.math.randomInt(12);
	this.flippedFactor = goog.math.randomInt(2) == 1 ? 1 : -1; // Will be used in the scale function in game

	this.setRotation(30*rnd);
	this.moveAction = null;
	this.isFalling	   = false;
	this.targetX = 0;
	
	this.chainLength 		 = data.chainLength;
	this.numBranches 		 = data.numBranches;
	this.numFunctionalGroups = data.numFunctionalGroups;
	this.velocity 			 = 0.0;
	this.acceleration 		 = 0.0;

	this.calculateScore();
}
goog.inherits(chemistry.Molecule, lime.Sprite);

chemistry.Molecule.prototype.tick = function(dt) {
	if(this.getPosition().x != this.targetX) {
		this.setPosition(this.targetX, this.getPosition().y);
	}
}

chemistry.Molecule.prototype.calculateScore = function() {
	this.score = 10*this.chainLength;
}

chemistry.Molecule.prototype.fadeOut = function() {
	if(this.moveAction) this.moveAction.stop();

    var currentScaleX = this.getScale().x;
    var currentScaleY = this.getScale().y;
    var targetFactor = 0.5;

	var animation = new lime.animation.Spawn(
		new lime.animation.FadeTo(0).setDuration(0.3).setEasing(lime.animation.Easing.EASEIN),
        new lime.animation.ScaleTo(currentScaleX * targetFactor, currentScaleY * targetFactor).setDuration(0.7)
		).enableOptimizations();
	this.runAction(animation);
	return animation;
}

chemistry.Molecule.prototype.vibrate = function() {
	if(this.moveAction) this.moveAction.stop();
	var initialRotation = this.getRotation();

    var currentScaleX = this.getScale().x;
    var currentScaleY = this.getScale().y;
    var targetFactor = 2;
	
	var animation = new lime.animation.Sequence (
        new lime.animation.RotateBy(10).setDuration(0.045),
        new lime.animation.RotateBy(-10).setDuration(0.045),
        new lime.animation.Spawn(
            new lime.animation.Sequence (
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045),
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045),
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045),
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045),
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045),
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045),
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045),
                new lime.animation.RotateBy(10).setDuration(0.045),
                new lime.animation.RotateBy(-10).setDuration(0.045)
                ),
            new lime.animation.FadeTo(0).setDuration(0.3),
            new lime.animation.ScaleTo(currentScaleX * targetFactor, currentScaleY * targetFactor).setDuration(0.7)
            )
        ).enableOptimizations();
	
	this.runAction(animation);

	return animation;
}

chemistry.Molecule.prototype.moveTo = function(x,y) {
	if(this.moveAction) this.moveAction.stop();
	this.targetX = x;

	var pos = this.getPosition();
    var distance_x = x - pos.x;
    var distance_y = y - pos.y;
    var distance = Math.sqrt(distance_x*distance_x + distance_y*distance_y);
    t = distance / this.velocity;

    if(distance_x > 0) {
    	this.setPosition(x, pos.y);
    } 
    
    this.moveAction = new lime.animation.MoveTo(x, y).setDuration(t).setEasing(lime.animation.Easing.LINEAR).enableOptimizations();

    this.runAction(this.moveAction);
}

chemistry.Molecule.prototype.startRotate = function(rotationSpeed) {
    var duration = 2*Math.PI / rotationSpeed;
    var rotation = new lime.animation.RotateBy(360).setDuration(duration);
    var loop = new lime.animation.Loop(rotation);
    this.runAction(loop);
}

chemistry.Molecule.prototype.setMaxSize = function(maxSize) {
    var currentMaxSize = Math.max(this.getSize().width, this.getSize().height);
    var scaleFactor = maxSize / currentMaxSize;
    this.setScale(scaleFactor,scaleFactor*this.flippedFactor);
}
