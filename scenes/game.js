goog.provide('chemistry.Game');

goog.require('chemistry.ScoreLabel');
goog.require('chemistry.Hud');
goog.require('chemistry.Molecule');
goog.require('chemistry.Lane');
goog.require('chemistry.Level');
goog.require('lime.Layer');
goog.require('lime.animation.MoveTo');
goog.require('lime.fill.LinearGradient');

chemistry.Game = function(width, height, difficulty) {
	lime.Scene.call(this);
	this.setSize(width, height);

	this.t 	   = 0;
	this.score = 0;
	this.hp    = 50;
	this.difficulty = difficulty;
	this.level = new chemistry.Level(difficulty, this);

	this.molecules = [];

	this.addBackground(width, height);
	this.addLanes(width, height, this.level.numLanes);
	this.addMoleculeLayer(width, height);
	this.addHUD(width,height);

	this.nextMolecule = null;
	this.timeToNextMolecule = 0;
	
	lime.scheduleManager.schedule(this.tick, this);
}
goog.inherits(chemistry.Game, lime.Scene);

chemistry.Game.prototype.addHUD = function(width, height) {
	this.hud = new chemistry.Hud(appObject.screenWidth, appObject.screenWidth/4.0);
	this.appendChild(this.hud,1000);
	this.hud.lifebar.setHP(this.hp);
}

chemistry.Game.prototype.addBackground = function(width, height) {
	var fill = new lime.fill.LinearGradient().
	    setDirection(0,0,0,1). // 45' angle 
	    addColorStop(0,100,0,0,1). // start from red color
    	addColorStop(1,0,0,100,.5); // end with transparent blue
	this.background = new lime.Sprite();
	this.background.setFill(fill);
	this.background.setAnchorPoint(0,0);
	this.background.setSize(width, height);
	this.appendChild(this.background);
}

chemistry.Game.prototype.addMoleculeLayer = function(width, height) {
	this.moleculeLayer = new lime.Layer();
	this.moleculeLayer.setAnchorPoint(0,0);
	this.moleculeLayer.setSize(width, height);
	this.appendChild(this.moleculeLayer);
}

chemistry.Game.prototype.addLanes = function(width, height, numLanes) {
	this.lanes = [];
	for(var i=0; i<numLanes; i++) {
		var lane = new chemistry.Lane(width/numLanes, height, i);
		lane.setAnchorPoint(0,0);
		lane.setPosition(width/numLanes*i,0);

		this.lanes.push(lane);
		this.appendChild(lane);
	}
}

chemistry.Game.prototype.updateNextMolecule = function(dt) {
	this.timeToNextMolecule -= dt;
	if(this.timeToNextMolecule < 0) {
		// We need to create another molecule, and move the current next molecule into falling mode

		// Choose a random lane
		var lane = this.lanes[goog.math.randomInt(this.lanes.length)];
		if(this.nextMolecule != null) {
			// The next molecule exists, lets move that into falling mode in the randomly chosen lane
			lane.addMolecule(this.nextMolecule);
			var x = lane.getXMiddle();
			var y = this.getSize().height / 8;
			this.nextMolecule.setPosition(x, y);
			this.addMolecule(this.nextMolecule);
			this.nextMolecule.isFalling = true;

			var target = this.nextMolecule;
			var self = this;

			goog.events.listen(target,['mousedown','touchstart'], this.clickedMolecule);
        }
        this.nextMolecule = this.level.getNextMolecule();
		this.nextMolecule.velocity = this.level.getVelocity();
		this.scaleMolecule(this.nextMolecule);

		// Update time to next molecule
        this.timeToNextMolecule = this.level.getTimeToNextMolecule();
		this.hud.nextMolecule.newMolecule(this.nextMolecule, this.timeToNextMolecule);
	}	
};

chemistry.Game.prototype.scaleMolecule = function(molecule) {
	var size = molecule.getSize();
	var maxSize = Math.max(size.width, size.height);
	var scale = this.lanes[0].getSize().width / maxSize * 0.9;
	molecule.setScale(scale,scale)
}

chemistry.Game.prototype.addMolecule = function(molecule) {
	this.moleculeLayer.appendChild(molecule);
	this.molecules.push(molecule);
}

chemistry.Game.prototype.removeMolecule = function(molecule) {
	this.moleculeLayer.removeChild(molecule);
	var index = this.molecules.indexOf(molecule);
	this.molecules.splice(index, 1);
}

chemistry.Game.prototype.getLaneFromPosition = function(position) {
	var laneIndex = parseInt(position.x/this.getSize().width*this.lanes.length);
	return this.lanes[laneIndex];
}

chemistry.Game.prototype.addScore = function(score, molecule) {
	this.score += score;
	if(molecule.isFalling) {
		var scoreLabel = new chemistry.ScoreLabel();
	
		var animation = scoreLabel.animateScore(score, molecule.getPosition().x, molecule.getPosition().y);
		this.appendChild(scoreLabel);
		self = this;
		goog.events.listen(animation,lime.animation.Event.STOP,function(){
	    	self.removeChild(scoreLabel);
		});
	}
}

chemistry.Game.prototype.addHP = function(value) {
	this.hp += value;
	this.hp = Math.min(this.hp,100);
	this.hp = Math.max(this.hp,0);
	
	this.hud.lifebar.setHP(this.hp);
}

chemistry.Game.prototype.end = function() {
	lime.scheduleManager.unschedule(this.tick, this);
	appObject.endGame();
}

chemistry.Game.prototype.finalizeMolecule = function(molecule, lane) {
	if(lane.chainLength == molecule.chainLength) {
		var multiplier = parseInt( (lane.targetBox.getPosition().y - molecule.getPosition().y)*3 / lane.getSize().height );
		multiplier = Math.max(multiplier, 0);
		if(!molecule.isFalling) { multiplier = 5; } // Give max multiplier if molecule is in nextMolecule box

		var score = (1 + multiplier)*molecule.score;
		lane.targetBox.highlight(true);
		this.addScore(score, molecule);
		this.addHP( this.level.getHP(true) );
	} else {
		// Wrong, decrease life
		lane.targetBox.highlight(false);
		this.addHP( this.level.getHP(false) );
	}
}

chemistry.Game.prototype.clickedTargetBox = function(boxIndex) {
	var molecule;
	var isFalling = true; // Is the molecule falling or is it still in the nextMolecule-box?
	if(this.molecules.length == 0) {
		// No falling molecules, the current molecule is this.nextMolecule
		isFalling = false;
		molecule = this.nextMolecule;
		this.timeToNextMolecule = 0;
		this.nextMolecule = null;
	} else {
		// We have falling molecules. Choose the lower most molecule as current
		molecule = this.molecules[0];
		var currentLane = this.getLaneFromPosition(molecule.getPosition());

		currentLane.removeMolecule(molecule);
		this.removeMolecule(molecule);
	}

	var clickedLane = this.lanes[boxIndex];
	this.finalizeMolecule(molecule, clickedLane);
}

chemistry.Game.prototype.clickedMolecule = function(e) {
	var currentLane = self.getLaneFromPosition(e.target.getPosition());
	currentLane.increaseHighlight();

    var xDiff = e.screenPosition.x-target.getPosition().x;
	//listen for end event
    e.swallow(['mouseup','touchend'],function(){
    	currentLane.decreaseHighlight();
    	e.target.setPosition(currentLane.getPosition().x + currentLane.getSize().width / 2.0, e.target.getPosition().y);
    });

    e.swallow(['mousemove','touchmove'],function(ev){
    	e.target.setPosition(ev.screenPosition.x - xDiff, e.target.getPosition().y);
    	var newLane = self.getLaneFromPosition(e.target.getPosition());
        if(newLane !== currentLane) {
    		currentLane.removeMolecule(target);
    		currentLane.decreaseHighlight();
    		newLane.addMolecule(e.target);
    		newLane.increaseHighlight();
    		currentLane = newLane;
    	}
    });
}

chemistry.Game.prototype.tick = function(dt) {
	lime.updateDirtyObjects();
	for(var i in this.lanes) {
		var lane = this.lanes[i];
		lane.tick(dt);
	}
	this.hud.tick(dt);
	this.updateNextMolecule(dt);
	if(this.hp <= 0) this.end();
	this.t += dt;
};
