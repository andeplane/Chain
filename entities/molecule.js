goog.provide('chemistry.Molecule');

goog.require('lime.Sprite');
goog.require('lime.animation.RotateTo');
goog.require('goog.math');

chemistry.Molecule = function(data) {
	lime.Sprite.call(this);

	this.data = data;
	this.setSize(data.size[0],data.size[1]); // TODO REMOVE ME!!!
	this.setFill(data.imageFile);
	// Rotate by n*90 degrees for more variations
	var rnd = goog.math.randomInt(4);
	this.setRotation(90*rnd);
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
	var animation = new lime.animation.Spawn(
		new lime.animation.FadeTo(0).setDuration(0.3).setEasing(lime.animation.Easing.EASEIN),
    	new lime.animation.ScaleTo(0.5).setDuration(0.7)
		).enableOptimizations();
	this.runAction(animation);
	return animation;
}

chemistry.Molecule.prototype.vibrate = function() {
	var initialRotation = this.getRotation();

	var animation = new lime.animation.Sequence (
        new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
        new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
        new lime.animation.Spawn(
            new lime.animation.Sequence (
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(10 + initialRotation).setDuration(0.045),
                new lime.animation.RotateTo(20 + initialRotation).setDuration(0.045)
                ),
            new lime.animation.FadeTo(0).setDuration(0.3),
            new lime.animation.ScaleTo(2).setDuration(0.7)
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
