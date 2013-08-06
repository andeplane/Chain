goog.provide('chemistry.Game');

goog.require('chemistry.ScoreLabel');
goog.require('chemistry.Hud');
goog.require('chemistry.Molecule');
goog.require('chemistry.Lane');
goog.require('chemistry.Level');
goog.require('chemistry.overlays.LevelUp');
goog.require('chemistry.overlays.GameOver');
goog.require('chemistry.events.GameEvent');
goog.require('chemistry.events.TargetBoxEvent');
goog.require('chemistry.MultiplierLabel');
goog.require('chemistry.Score');

goog.require('lime.Layer');
goog.require('lime.animation.MoveTo');
goog.require('lime.fill.LinearGradient');

chemistry.Game = function(width, height, difficulty) {
    lime.Scene.call(this);

    this.setSize(width, height);
    var gridUnit = width / 40;
    this.boardEdgeY = 51 * gridUnit;

    this.difficulty = difficulty;
    this.t = -999;
    this.score = new chemistry.Score(this.difficulty);
    this.hp = -999;
    
    this.level = new chemistry.Level(difficulty, this);
    goog.events.listen(this.level, chemistry.events.GameEvent.LEVEL_UP, this.levelUp, false, this);
	this.fever = false;

	this.molecules = [];

	this.addBackground(width, height);
    this.addTargetBoxes(width, height, this.level.numLanes);
	this.addMarkerLayer(width, height);
	this.addMoleculeLayer(width, height);
	this.addHUD(width,height);
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
    lime.scheduleManager.unschedule(this.tick, this);
    this.removeAllMolecules();
    this.t 	   = 0;
    this.score = new chemistry.Score(this.difficulty);
    this.setHP(50);
    this.level.reset();
    this.hud.reset();

    this.nextMolecule = null;
    this.timeToNextMolecule = 0;
    this.state = chemistry.Game.state.RUNNING;
    lime.scheduleManager.schedule(this.tick, this);
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
                    obj.boxNumber = 0;
                    this.clickedTargetBox(obj);
                break;
            case 50: //2
                    obj.boxNumber = 1;
                    this.clickedTargetBox(obj);
                break;
            case 51: //3
                    obj.boxNumber = 2;
                    this.clickedTargetBox(obj);
                break;
            case 52: //4
            	if(this.numLanes < 4) return;
                obj.boxNumber = 3;
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
    goog.events.listen(this, chemistry.events.GameEvent.GAME_OVER, this.hud.nextMolecule.gameOver, false, this.hud.nextMolecule);
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
    this.background = new lime.Sprite();
    this.background.setFill("design/export/background.png");
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

chemistry.Game.prototype.addTargetBoxes = function(width, height, numLanes) {
    this.targetBoxes = [];
    var gridUnit = width / 40;
    var currentX = 0;
    var spriteWidths = [14 * gridUnit, 18 * gridUnit, 15 * gridUnit];
    var spriteXs = [0, 12 * gridUnit, 25 * gridUnit];
    var spriteHeight = 9 * gridUnit;
    for(var i=0; i<numLanes; i++) {
//        var lane = new chemistry.Lane(width/numLanes, height, i);
//        lane.setAnchorPoint(0,0);
//        lane.setPosition(width/numLanes*i,0);

//        this.targetBoxess.push(lane);
//        this.appendChild(lane);
//        var goldenRatioInverse = 1/1.618;
        var spriteWidth = spriteWidths[i];
        var spriteX = spriteXs[i];
        var chainLength = i + 3;
        var targetBox = new chemistry.TargetBox(spriteWidth, 9 * gridUnit, i, chainLength, "design/export/button" + chainLength + ".png");
        targetBox.setAnchorPoint(0,0);
        targetBox.setPosition(spriteX, height - spriteHeight);
        this.appendChild(targetBox);

//        var self = this;
//        goog.events.listen(targetBox,['mousedown','touchstart'], this.clickedTargetBox, false, this);
        goog.events.listen(targetBox, chemistry.events.TargetBoxEvent.CLICKED_TARGET_BOX, this.clickedTargetBox, false, this);
//        goog.events.listen(lane, chemistry.events.LaneEvent.CLICKED_TARGET_BOX, this.clickedTargetBox, false, this);
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

chemistry.Game.prototype.moleculeOutOfBounds = function(event) {
    var molecule = event.molecule;
    this.finalizeMolecule(molecule, null);
}

chemistry.Game.prototype.clickedTargetBox = function(event) {
    if(this.state !== chemistry.Game.state.RUNNING) {
        return;
    }

    var clickedBox = event.targetBox;
    var molecule;
    if(this.molecules.length === 0) {
        // No falling molecules, the current molecule is this.nextMolecule
        molecule = this.nextMolecule;
        this.timeToNextMolecule = 0;
        this.nextMolecule = null;
    } else {
        // We have falling molecules. Choose the lower most molecule as current
        molecule = this.molecules[0];
        // this.removeMolecule(molecule);
    }

    this.finalizeMolecule(molecule, clickedBox);
}

chemistry.Game.prototype.updateNextMolecule = function(dt) {
    this.timeToNextMolecule -= dt;
    if(this.timeToNextMolecule < 0) {
        // We need to create another molecule, and move the current next molecule into falling mode

        // Choose a random lane
        var lane = this.targetBoxes[goog.math.randomInt(this.targetBoxes.length)];
        if(this.nextMolecule !== null) {
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
    var laneIndex = parseInt(position.x/this.getSize().width*this.targetBoxess.length);
    return this.targetBoxess[laneIndex];
}

chemistry.Game.prototype.addScore = function(score, molecule) {
    this.score.add(score);
    this.hud.rollerCounter.jump();
    if(molecule.isFalling) {
        var scoreLabel = new chemistry.ScoreLabel();

        var animation = scoreLabel.animateScore(this.score, molecule.getPosition().x, molecule.getPosition().y);
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
    appObject.scores.newScore();
    // Update roller counter so it shows final score
    this.hud.rollerCounter.currentScore = this.score.score;
    this.hud.rollerCounter.tick();
}

chemistry.Game.prototype.finalizeMolecule = function(molecule, targetBox) {
    if(!molecule) {
        return;
    }

    if(targetBox.chainLength === molecule.chainLength) {
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
        targetBox.highlight(true);
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
        targetBox.highlight(false);
        this.failMolecule(molecule);
    }

    if(this.hp <= 0) this.gameOver();
}

chemistry.Game.prototype.failMolecule = function(molecule) {
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

chemistry.Game.prototype.processMolecules = function(dt) {
    var moleculesToBeRemoved = [];
    for(var i in this.molecules) {
        var molecule = this.molecules[i];
        molecule.tick(dt);

        if(molecule.getPosition().y + molecule.getSize().height / 2 >= this.boardEdgeY) {
            moleculesToBeRemoved.push(molecule);

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
