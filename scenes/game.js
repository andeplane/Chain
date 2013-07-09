goog.provide('chemistry.Game');

goog.require('chemistry.ScoreLabel');
goog.require('chemistry.Hud');
goog.require('chemistry.Molecule');
goog.require('chemistry.Lane');
goog.require('chemistry.Level');
goog.require('chemistry.events.GameEvent');
goog.require('chemistry.events.LaneEvent');
goog.require('chemistry.MultiplierLabel');

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
	this.fever = false;

	this.molecules = [];

	this.addBackground(width, height);
	this.addLanes(width, height, this.level.numLanes);
	this.addMarkerLayer(width, height);
	this.addMoleculeLayer(width, height);
	this.addHUD(width,height);
	this.addMarkers(width, height);

	this.nextMolecule = null;
	this.timeToNextMolecule = 0;
	
	lime.scheduleManager.schedule(this.tick, this);
}
goog.inherits(chemistry.Game, lime.Scene);

chemistry.Game.prototype.addHUD = function(width, height) {
    this.hud = new chemistry.Hud(appObject.screenWidth, appObject.screenWidth/4.0);
    this.appendChild(this.hud,1000);
    this.hud.lifebar.setHP(this.hp);
    goog.events.listen(this, chemistry.events.GameEvent.ENTER_FEVER_MODE, this.hud.lifebar.enterFeverMode, false, this.hud.lifebar);
	goog.events.listen(this, chemistry.events.GameEvent.EXIT_FEVER_MODE,  this.hud.lifebar.exitFeverMode, false, this.hud.lifebar);
	goog.events.listen(this, chemistry.events.GameEvent.ENTER_FEVER_MODE, this.hud.rollerCounter.enterFeverMode, false, this.hud.rollerCounter);
	goog.events.listen(this, chemistry.events.GameEvent.EXIT_FEVER_MODE,  this.hud.rollerCounter.exitFeverMode, false, this.hud.rollerCounter);
}

chemistry.Game.prototype.addMarkerLayer = function(width, height) {
	this.markerLayer = new lime.Layer().setSize(width,height);
	this.appendChild(this.markerLayer);
}

chemistry.Game.prototype.addMarkers = function(width, height) {
    this.markers = [];
    for(var i=2; i<=5; i++) {
    	var multiplierLabel = new chemistry.MultiplierLabel(i);
		this.markers.push(multiplierLabel);

		if(i < 5) {
			multiplierLabel.setPosition(width / 15, height/6 + (5 - i)*height/6);
			this.markerLayer.appendChild(multiplierLabel);
		} else {
			var size = this.hud.nextMolecule.getSize();

			multiplierLabel.setPosition(- (8*size.width / 10), size.width/10 );
			this.hud.nextMolecule.appendChild(multiplierLabel);
		}
		
    }
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
        goog.events.listen(lane, chemistry.events.LaneEvent.MOLECULE_HIT_TARGET_BOX, this.moleculeHitTargetBox, false, this);
        goog.events.listen(lane, chemistry.events.LaneEvent.CLICKED_TARGET_BOX, this.clickedTargetBox, false, this);
    }
}

chemistry.Game.prototype.moleculeHitTargetBox = function(event) {
    var lane = this.lanes[event.laneNumber];
    var molecule = event.molecule;
    this.finalizeMolecule(molecule, lane);
}

chemistry.Game.prototype.clickedTargetBox = function(event) {
    var boxIndex = event.laneNumber;
    var molecule;
    if(this.molecules.length == 0) {
        // No falling molecules, the current molecule is this.nextMolecule
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

            goog.events.listen(target,['mousedown','touchstart'], this.clickedMolecule, false, this);
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
    this.hud.rollerCounter.jump();
    if(molecule.isFalling) {
        var scoreLabel = new chemistry.ScoreLabel();

        var animation = scoreLabel.animateScore(score, molecule.getPosition().x, molecule.getPosition().y);
        this.appendChild(scoreLabel);
        goog.events.listen(animation,lime.animation.Event.STOP,function(){
            this.removeChild(scoreLabel);
        },false,this);
    }
}

chemistry.Game.prototype.addHP = function(value) {
    var oldHP = this.hp;
    this.hp += value;
    this.hp = goog.math.clamp(this.hp, 0, 100);

    this.hud.lifebar.setHP(this.hp);

    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.HP_CHANGED));
    if(this.hp === 100) {
    	this.enterFeverMode();
    } else if(oldHP === 100) {
    	this.exitFeverMode();
    }
}

chemistry.Game.prototype.enterFeverMode = function() {
	this.fever = true;
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.ENTER_FEVER_MODE));
}

chemistry.Game.prototype.exitFeverMode = function() {
	this.fever = false;
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.EXIT_FEVER_MODE));
}

chemistry.Game.prototype.end = function() {
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.GAME_OVER));
    lime.scheduleManager.unschedule(this.tick, this);
    appObject.endGame();
}

chemistry.Game.prototype.finalizeMolecule = function(molecule, lane) {
    if(lane.chainLength === molecule.chainLength) {
    	// First, calculate the multiplier by checking if the molecule is above the marker
    	var multiplier = 1;
    	var y = molecule.getPosition().y;
    	var marker = null;

    	for(var i=4; i>=2; i--) {
    		// Compare molecule position to multiplier marker i

    		var index = i-2; // The 2x multiplier is the 0th element in the array
    		var tmpMarker = this.markers[index];
    		if(y < tmpMarker.getPosition().y) {
    			multiplier = i;
    			marker = tmpMarker;
    			break;
    		}
    	}

        if(!molecule.isFalling) {
        	// If we are not falling, the molecule is the nextMolecule
        	marker = this.markers[5-2];
        	multiplier = 5;
        } // Give max multiplier if molecule is in nextMolecule box

        var score = (1 + multiplier + 4*this.fever)*molecule.score;
        lane.targetBox.highlight(true);
        this.addScore(score, molecule);
        this.addHP( this.level.getHP(true) );
        if(marker) { marker.jump(); }
    } else {
        // Wrong, decrease life
        lane.targetBox.highlight(false);
        this.addHP( this.level.getHP(false) );
    }
    if(molecule.isDragging) {
    	var currentLane = this.getLaneFromPosition(molecule.getPosition());
    	currentLane.decreaseHighlight();
    }
}

chemistry.Game.prototype.clickedMolecule = function(e) {
	if(e.target.isDragging) return;
	e.target.isDragging = true;
    var currentLane = this.getLaneFromPosition(e.target.getPosition());
    currentLane.increaseHighlight();
	var self = this;

    var xDiff = self.screenToLocal(e.screenPosition).x - e.target.getPosition().x;
    
    //listen for end event
    e.swallow(['mouseup','touchend'],function(){
    	e.target.isDragging = false;
    	currentLane.decreaseHighlight();
        e.target.setPosition(currentLane.getXMiddle(), e.target.getPosition().y);
    });

    e.swallow(['mousemove','touchmove'],function(ev) {
    	// Make sure the molecule is within the screen
    	var newXPosition = self.screenToLocal(ev.screenPosition).x - xDiff;
    	newXPosition = goog.math.clamp(newXPosition, 0, self.getSize().width - 1);

        e.target.setPosition(newXPosition, e.target.getPosition().y);
        var newLane = self.getLaneFromPosition(e.target.getPosition());
        if(newLane !== currentLane) {
            currentLane.removeMolecule(e.target);
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
