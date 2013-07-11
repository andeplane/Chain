goog.provide('chemistry.Game');

goog.require('chemistry.ScoreLabel');
goog.require('chemistry.Hud');
goog.require('chemistry.Molecule');
goog.require('chemistry.Lane');
goog.require('chemistry.Level');
goog.require('chemistry.overlays.LevelUp');
goog.require('chemistry.overlays.GameOver');
goog.require('chemistry.events.GameEvent');
goog.require('chemistry.events.LaneEvent');
goog.require('chemistry.MultiplierLabel');

goog.require('lime.Layer');
goog.require('lime.animation.MoveTo');
goog.require('lime.fill.LinearGradient');

chemistry.Game = function(width, height, difficulty) {
    lime.Scene.call(this);

    this.setSize(width, height);

    this.t = -999;
    this.score = -999;
    this.hp = -999;

	this.difficulty = difficulty;
    this.level = new chemistry.Level(difficulty, this);
    goog.events.listen(this.level, chemistry.events.GameEvent.LEVEL_UP, this.levelUp, false, this);
	this.fever = false;

	this.molecules = [];

	this.addBackground(width, height);
	this.addLanes(width, height, this.level.numLanes);
	this.addMarkerLayer(width, height);
	this.addMoleculeLayer(width, height);
	this.addHUD(width,height);
	this.addMarkers(width, height);
    this.addMarkers(width, height);
    this.addLevelUpOverlay(width, height);
//    this.addFeverModeOverlay(width, height);
    this.addKeyboardEventListener();
    this.addGameOverOverlay(width, height);

    this.restart();
}
goog.inherits(chemistry.Game, lime.Scene);

// Game states
chemistry.Game.state = {
    RUNNING: 1,
    PAUSED: 2,
    GAME_OVER: 3
};

chemistry.Game.prototype.restart = function() {
    this.t 	   = 0;
    this.score = 0;
    this.setHP(50);
    this.level.reset();

    this.nextMolecule = null;
    this.timeToNextMolecule = 0;
    lime.scheduleManager.schedule(this.tick, this);
    this.state = chemistry.Game.state.RUNNING;
}

chemistry.Game.prototype.retry = function() {
    this.gameOverOverlay.setHidden(true);
    this.restart();
    lime.updateDirtyObjects();
}

chemistry.Game.prototype.pause = function() {
    this.state = chemistry.Game.state.PAUSED;
    lime.scheduleManager.unschedule(this.tick, this);
}

chemistry.Game.prototype.addKeyboardEventListener = function() {
    goog.events.listen(goog.global, ['keydown'], function (e) {
        if(this.state !== chemistry.Game.state.RUNNING) {
            return;
        }
		var obj = {};
        switch (e.keyCode) {
            case 49: //1
            		obj.laneNumber = 0;
                    this.clickedTargetBox(obj);
                break;
            case 50: //2
            		obj.laneNumber = 1;
                    this.clickedTargetBox(obj);
                break;
            case 51: //3
            		obj.laneNumber = 2;
                    this.clickedTargetBox(obj);
                break;
            case 52: //4
            	if(this.numLanes < 4) return;
            	obj.laneNumber = 3;
                this.clickedTargetBox(obj);
                break;          
        }
    }, false, this);
}

chemistry.Game.prototype.addHUD = function(width, height) {
    this.hud = new chemistry.Hud(appObject.screenWidth, appObject.screenWidth/4.0);
    this.appendChild(this.hud,1000);
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

chemistry.Game.prototype.addLevelUpOverlay = function(width, height) {
    this.levelUpOverlay = new chemistry.overlays.LevelUp(width, height);
    this.levelUpOverlay.setAnchorPoint(0,0);
    this.appendChild(this.levelUpOverlay);
    this.levelUpOverlay.setHidden(true);
}

chemistry.Game.prototype.addGameOverOverlay = function(width, height) {
    this.gameOverOverlay = new chemistry.overlays.GameOver(width, height);
    this.gameOverOverlay.setAnchorPoint(0,0);
    this.appendChild(this.gameOverOverlay);
    this.gameOverOverlay.setHidden(true);
    goog.events.listen(this.gameOverOverlay, chemistry.overlays.GameOver.event.RETRY_BUTTON_CLICKED, this.retry, false, this);
    goog.events.listen(this.gameOverOverlay, chemistry.overlays.GameOver.event.END_GAME_BUTTON_CLICKED, this.quit, false, this);
}

chemistry.Game.prototype.levelUp = function(event) {
    this.removeAllMolecules();

    this.levelUpOverlay.levelUp(this.level.level);
}

chemistry.Game.prototype.moleculeHitTargetBox = function(event) {
    var lane = this.lanes[event.laneNumber];
    var molecule = event.molecule;
    this.finalizeMolecule(molecule, lane);
}

chemistry.Game.prototype.clickedTargetBox = function(event) {
    if(this.state !== chemistry.Game.state.RUNNING) {
        return;
    }

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
        // this.removeMolecule(molecule);
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
            // The next molecule exists, lets move that into falling mode
            var moleculeWidth = this.nextMolecule.getSize().width*this.nextMolecule.getScale().x;
            var x = moleculeWidth + goog.math.randomInt(this.getSize().width - 2*moleculeWidth);

            var y = this.getSize().height / 8;
            this.nextMolecule.setPosition(x, y);
            this.nextMolecule.targetX = x;
            this.addMolecule(this.nextMolecule);
            this.nextMolecule.isFalling = true;

            var pos = this.nextMolecule.getPosition();
            this.nextMolecule.moveTo(pos.x, this.getSize().height);
            
            var target = this.nextMolecule;
            var self = this;
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
    // Make sure the molecules aren't bigger than 1/nth of the screen width.
    var moleculeMaxSize = Math.max(molecule.getSize().width, molecule.getSize().height);
    var maxSize = this.getSize().width / 5.0;
    var scale = Math.min(maxSize / moleculeMaxSize, 1.0);
    molecule.setScale(scale,scale);
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
        }, false, this);
    }
}

chemistry.Game.prototype.setHP = function(value) {
    var oldHP = this.hp;
    this.hp = goog.math.clamp(value, 0, 100);

    this.hud.lifebar.setHP(this.hp);

    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.HP_CHANGED));
    if(this.hp === 100 && oldHP !== 100) {
        this.enterFeverMode();
    } else if(this.hp !== 100 && oldHP === 100) {
        this.exitFeverMode();
    }
}

chemistry.Game.prototype.addHP = function(value) {
    var oldHP = this.hp;
    oldHP += value;
    this.setHP(oldHP);
}

chemistry.Game.prototype.enterFeverMode = function() {
    this.fever = true;
//    this.feverModeOverlay.enterFeverMode();
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.ENTER_FEVER_MODE));
}

chemistry.Game.prototype.exitFeverMode = function() {
	this.fever = false;
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.EXIT_FEVER_MODE));
}

chemistry.Game.prototype.addMolecule = function(molecule) {
    this.moleculeLayer.appendChild(molecule);
    this.molecules.push(molecule);
}

chemistry.Game.prototype.removeMolecule = function(molecule) {
    goog.events.removeAll(molecule);
    this.moleculeLayer.removeChild(molecule);
    var index = this.molecules.indexOf(molecule);
    this.molecules.splice(index, 1);
}

chemistry.Game.prototype.removeAllMolecules = function() {
    for(var i in this.molecules) {
        var molecule = this.molecules[i];
        goog.events.removeAll(molecule);
        this.moleculeLayer.removeChild(molecule);
    }

    this.molecules = [];
}

chemistry.Game.prototype.quit = function() {
    appObject.endGame();
}

chemistry.Game.prototype.gameOver = function() {
    this.removeAllMolecules();
    this.state = chemistry.Game.state.GAME_OVER;
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.GAME_OVER));
    this.gameOverOverlay.gameOver();
    lime.scheduleManager.unschedule(this.tick, this);
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
        goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.CORRECT_ANSWER));

        // Remove molecule from molecule list, so that we can start working on the next one
        var index = this.molecules.indexOf(molecule);
        this.molecules.splice(index, 1);

        // Create vibration effect and remove the molecule afterwards
        var fade = molecule.fadeOut();
        goog.events.listen(fade, lime.animation.Event.STOP, function(e) {
            this.moleculeLayer.removeChild(molecule);
        }, false, this);
    } else {
        lane.targetBox.highlight(false);
        this.addHP( this.level.getHP(false) );
        goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.WRONG_ANSWER));

        // Remove molecule from molecule list, so that we can start working on the next one
        var index = this.molecules.indexOf(molecule);
        this.molecules.splice(index, 1);

        // Create vibration effect and remove the molecule afterwards
        var vib = molecule.vibrate();
        goog.events.listen(vib, lime.animation.Event.STOP, function(e) {
            this.moleculeLayer.removeChild(molecule);
        }, false, this);
    }
}

chemistry.Game.prototype.processMolecules = function(dt) {
    var moleculesToBeRemoved = [];
    for(var i in this.molecules) {
        var molecule = this.molecules[i];
        molecule.tick(dt);
        var lane = this.getLaneFromPosition(molecule.getPosition());

        if(molecule.getPosition().y >= lane.targetBox.getPosition().y) {
            moleculesToBeRemoved.push(molecule);

            lane.targetBox.highlight(false);
            this.addHP( this.level.getHP(false) );
            goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.WRONG_ANSWER));
        }
    }

    for(var i in moleculesToBeRemoved) {
        var molecule = moleculesToBeRemoved[i];
        this.removeMolecule(molecule);
    }
}

chemistry.Game.prototype.pause = function(ev) {
    // First broadcast pause event
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.PAUSE));

    // Stop movement on all molecules
    for(var i in this.molecules) {
        var molecule = this.molecules[i];
        molecule.moveAction.stop();
    }

    // Tell director to pause
    this.getDirector().setPaused(true);
    // Draw pause menu
    lime.updateDirtyObjects();
}

chemistry.Game.prototype.unpause = function(ev) {
    // First broadcast unpause event
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.UNPAUSE));

    // Resume movement on all molecules
    for(var i in this.molecules) {
        var molecule = this.molecules[i];
        molecule.moveTo(molecule.targetX, this.getSize().height);
    }

    // Tell director to unpause
    this.getDirector().setPaused(false);
}

chemistry.Game.prototype.tick = function(dt) {
    this.hud.tick(dt);
    this.processMolecules(dt);
    this.updateNextMolecule(dt);
    if(this.hp <= 0) this.gameOver();
    this.t += dt;
};
