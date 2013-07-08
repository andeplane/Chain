goog.provide('chemistry.Game');

goog.require('chemistry.Hud');
goog.require('chemistry.Molecule');
goog.require('chemistry.Lane');
goog.require('lime.Layer');
goog.require('lime.animation.MoveTo');
goog.require('lime.fill.LinearGradient');

chemistry.Game = function(width, height, difficulty) {
	console.log(window.innerWidth);
	console.log(window.innerHeight);

	lime.Scene.call(this);
	this.setSize(width, height);

	this.score = 0;
	this.hp    = 50;
	this.difficulty = difficulty;
	this.molecules = [];

	this.addBackground(width, height);
	this.addLanes(width, height, 4);
	this.addMoleculeLayer(width, height);

	this.hud = new chemistry.Hud(appObject.screenWidth, appObject.screenWidth/4.0);
	this.appendChild(this.hud,1000);
	this.hud.lifebar.setHP(this.hp);

	this.nextMolecule = null;
	this.timeToNextMolecule = 0;
	
	lime.scheduleManager.schedule(this.tick, this);
}
goog.inherits(chemistry.Game, lime.Scene);

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

var data = {chainLength: 4, numBranches: 1, numFunctionalGroups: 0, imageFile: "images/molecules/test.png?"+goog.math.randomInt(10000)};

chemistry.Game.prototype.updateNextMolecule = function(dt) {
	this.timeToNextMolecule -= dt;
	if(this.timeToNextMolecule < 0) {
		var lane = this.lanes[goog.math.randomInt(this.lanes.length)];
		if(this.nextMolecule != null) {
			lane.addMolecule(this.nextMolecule);
			var x = lane.getPosition().x + lane.getSize().width / 2.0;
			this.nextMolecule.setPosition(x, 0);
			
			this.addMolecule(this.nextMolecule);

			var target = this.nextMolecule;
			var self = this;

			goog.events.listen(target,['mousedown','touchstart'], function(e) {
				var currentLane = self.getLaneFromPosition(target.getPosition());
				currentLane.increaseHighlight();

                var xDiff = e.screenPosition.x-target.getPosition().x;
				//listen for end event
		        e.swallow(['mouseup','touchend'],function(){
		        	currentLane.decreaseHighlight();
		        	target.setPosition(currentLane.getPosition().x + currentLane.getSize().width / 2.0, target.getPosition().y);
		        });

		        e.swallow(['mousemove','touchmove'],function(ev){
		        	target.setPosition(ev.screenPosition.x - xDiff, target.getPosition().y);
		        	var newLane = self.getLaneFromPosition(target.getPosition());
                    if(newLane !== currentLane) {
		        		currentLane.removeMolecule(target);
		        		currentLane.decreaseHighlight();
		        		newLane.addMolecule(target);
		        		newLane.increaseHighlight();
		        		currentLane = newLane;
		        	}
		        });
            });
        }

		this.nextMolecule = new chemistry.Molecule(data);
		this.nextMolecule.velocity = 0.2*this.difficulty;
		var size = this.nextMolecule.getSize();
		var maxSize = Math.max(size.width, size.height);
		var scale = lane.getSize().width / maxSize * 0.9;
		this.nextMolecule.setScale(scale,scale)
		this.timeToNextMolecule = 2000;
		this.hud.nextMolecule.newMolecule(this.nextMolecule, this.timeToNextMolecule);
	}	
};

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

chemistry.Game.prototype.tick = function(dt) {
	lime.updateDirtyObjects();
	for(var i in this.lanes) {
		var lane = this.lanes[i];
		lane.tick(dt);
	}
	this.hud.tick(dt);
	this.updateNextMolecule(dt);
	if(this.hp <= 0) this.end();
};

chemistry.Game.prototype.addScore = function(value) {
	this.score += value*this.difficulty;
}

chemistry.Game.prototype.addHP = function(value) {
	this.hp += value;
	this.hp = Math.min(this.hp,100);
	this.hp = Math.max(this.hp,0);
	console.log(this.hp);

	this.hud.lifebar.setHP(this.hp);
}

chemistry.Game.prototype.end = function() {
	lime.scheduleManager.unschedule(this.tick, this);
	appObject.endGame();
}

chemistry.Game.prototype.clickedTargetBox = function(boxIndex) {
	if(this.molecules.length == 0) {
		this.addHP(-10);
		return false;
	}

	var molecule = this.molecules[0];
	var clickedLane = this.lanes[boxIndex];
	var currentLane = this.getLaneFromPosition(molecule.getPosition());

	currentLane.removeMolecule(molecule);
	this.removeMolecule(molecule);

	if(clickedLane.chainLength == molecule.chainLength) {
		var multiplier = (clickedLane.targetBox.getPosition().y - molecule.getPosition().y)*3 / clickedLane.getSize().height;
		multiplier = multiplier<0 ? 0 : multiplier;

		var score = (1 + multiplier)*molecule.score;
		this.addScore(score);
		this.addHP(5);
		return true;
	} else {
		// Wrong, decrease life
		this.addHP(-10);
		return false;
	}
}




