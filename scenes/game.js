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

	this.addBackground(width, height);
	this.addLanes(width, height, 4);
	this.addMoleculeLayer(width, height);

	this.hud = new chemistry.Hud(appObject.screenWidth, appObject.screenWidth/4.0);
	this.appendChild(this.hud,1000);
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
			
			this.moleculeLayer.appendChild(this.nextMolecule);

			var target = this.nextMolecule;
			var self = this;

			goog.events.listen(target,['mousedown','touchstart'], function(e) {
				var currentLane = self.getLaneFromPosition(e.target.getPosition());
				currentLane.increaseHighlight();

				var xDiff = e.screenPosition.x-e.target.getPosition().x;
				//listen for end event
		        e.swallow(['mouseup','touchend'],function(){
		        	currentLane.decreaseHighlight();
		        });

		        e.swallow(['mousemove','touchmove'],function(ev){
		        	e.target.setPosition(ev.screenPosition.x - xDiff, e.target.getPosition().y);
		        	var newLane = self.getLaneFromPosition(e.target.getPosition());
		        	if(newLane != currentLane) {
		        		currentLane.decreaseHighlight();
		        		newLane.increaseHighlight();
		        		currentLane = newLane;
		        	}
		        });
		    });
		}

		this.nextMolecule = new chemistry.Molecule(data);
		this.nextMolecule.velocity = 0.05;
		var size = this.nextMolecule.getSize();
		var maxSize = Math.max(size.width, size.height);
		var scale = lane.getSize().width / maxSize * 0.9;
		this.nextMolecule.setScale(scale,scale)
		this.timeToNextMolecule = 2000;
		this.hud.nextMolecule.newMolecule(this.nextMolecule, this.timeToNextMolecule);
	}	
};

chemistry.Game.prototype.getLaneFromPosition = function(position) {
	var laneIndex = parseInt(position.x/this.getSize().width*this.lanes.length);
	console.log("Index: "+laneIndex);
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
};