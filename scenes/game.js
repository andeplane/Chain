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
goog.require('chemistry.overlays.Tutorial');

goog.require('lime.Layer');
goog.require('lime.animation.MoveTo');
goog.require('lime.animation.FadeTo');
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
    this.targetBoxes = [];
    this.numLeftToConceal = 0;

    this.addBackground(width, height);
    this.updateTargetBoxes();
    this.addMarkerLayer(width, height);
    this.addMoleculeLayer(width, height);
    this.addHUD(width,height);
    this.addMarkers(width, height);
    this.addLevelUpOverlay(width, height);
    //    this.addFeverModeOverlay(width, height);
    this.addKeyboardEventListener();
    this.addGameOverOverlay(width, height);

    this.showTutorialScreen(width, height, difficulty);
}
goog.inherits(chemistry.Game, lime.Scene);

// Game states
chemistry.Game.state = {
    RUNNING: 1,
    PAUSED: 2,
    GAME_OVER: 3
};

chemistry.Game.prototype.showTutorialScreen = function(width, height, difficulty) {
    this.tutorialScreen = new chemistry.overlays.Tutorial(width, height, difficulty);
    this.appendChild(this.tutorialScreen);
    goog.events.listen(this.tutorialScreen, ['mousedown', 'touchstart'], this.hideTutorialScreen, false, this);
    this.tutorialScreen.reveal();
}

chemistry.Game.prototype.hideTutorialScreen = function() {
    goog.events.removeAll(this.tutorialScreen);
    this.tutorialScreen.conceal(function() {
        this.removeChild(this.tutorialScreen);
        this.tutorialScreen = null;
        this.restart();
    }, false, this);
}

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
            obj.targetBox = this.targetBoxes[0];
            this.clickedTargetBox(obj);
            break;
        case 50: //2
            obj.targetBox = this.targetBoxes[1];
            this.clickedTargetBox(obj);
            break;
        case 51: //3
            obj.targetBox = this.targetBoxes[2];
            this.clickedTargetBox(obj);
            break;
        case 81: //3
            console.log("Woot!")
            this.level.levelUp();
            break;
        case 52: //4
            if(this.numLanes < 4) {
                return;
            }
            obj.targetBox = this.targetBoxes[3];
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

            multiplierLabel.setPosition(- (7.6*size.width / 10), size.width/10 );
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

chemistry.Game.prototype.updateTargetBoxes = function() {

    this.numLeftToConceal = this.targetBoxes.length;
    if(this.numLeftToConceal === 0) {
        this.createAndRevealTargetBoxes();
        return;
    }

    for(var i = 0; i < this.targetBoxes.length; i++) {
        this.concealAndRemoveTargetBox(i);
    }
}

chemistry.Game.prototype.concealAndRemoveTargetBox = function(boxNumber) {
    console.log("Concealing: " + boxNumber)
    this.targetBoxes[boxNumber].conceal(function() {
        console.log("Conceal finished for " + boxNumber);
        goog.events.removeAll(this.targetBoxes[boxNumber]);
        this.removeChild(this.targetBoxes[boxNumber]);
        this.numLeftToConceal -= 1;
        if(this.numLeftToConceal === 0) {
            this.createAndRevealTargetBoxes();
        }
    }, this);
}

chemistry.Game.prototype.createAndRevealTargetBoxes = function() {
    console.log("Create and reveal!");
    var width = this.getSize().width;
    var height = this.getSize().height;
    var gridUnit = width / 40;
    var currentX = 0;
    var spriteWidth = 20 * gridUnit;
    var spriteStartX = -3*gridUnit;
    var spriteIncrementX = 14 * gridUnit;
    var spriteHeight = 9 * gridUnit;

    this.targetBoxes = [];

    for(var i=0; i<this.level.availableChainLengths.length; i++) {
        var spriteX = spriteStartX + i * spriteIncrementX;
        var chainLength = this.level.availableChainLengths[i];
        console.log("Creating " + i + " " + chainLength);
        var targetBox = new chemistry.TargetBox(spriteWidth, 9 * gridUnit, i, chainLength);
        targetBox.setAnchorPoint(0,0);
        targetBox.setPosition(spriteX, height);
        this.appendChild(targetBox);
        this.targetBoxes.push(targetBox);

        goog.events.listen(targetBox, chemistry.events.TargetBoxEvent.CLICKED_TARGET_BOX, this.clickedTargetBox, false, this);
        targetBox.reveal(0.2 + 0.2*(i+0.3));
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
    this.nextMolecule = null;
    this.timeToNextMolecule = 0;
    this.updateNextMolecule();

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

    var maxSize = this.getSize().width / 15.0*Math.min(molecule.chainLength, 6);
    // var maxSize = this.getSize().width / 10.0;
    molecule.setMaxSize(maxSize);
}

chemistry.Game.prototype.getLaneFromPosition = function(position) {
    var laneIndex = parseInt(position.x/this.getSize().width*this.targetBoxess.length);
    return this.targetBoxess[laneIndex];
}

chemistry.Game.prototype.addScore = function(score, molecule) {
    this.score.add(score);
    this.hud.rollerCounter.jump();
    var scoreLabel = new chemistry.ScoreLabel();
    var animation;

    if(molecule.isFalling) {
        animation = scoreLabel.animateScore(score, molecule.getPosition().x, molecule.getPosition().y);
    } else {
        var pos = this.hud.nextMolecule.getPosition();
        var size = this.hud.nextMolecule.getSize();
        animation = scoreLabel.animateScore(score, pos.x-size.width/2, pos.y+size.height/2);
    }

    this.appendChild(scoreLabel);
    goog.events.listen(animation,lime.animation.Event.STOP,function(){
        this.removeChild(scoreLabel);
    }, false, this);
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
    this.cleanUp();
    this.state = chemistry.Game.state.GAME_OVER;
    appObject.endGame();
}

chemistry.Game.prototype.cleanUp = function() {
    this.unpause();
    this.removeAllMolecules();
    lime.scheduleManager.unschedule(this.tick, this);
}

chemistry.Game.prototype.gameOver = function() {
    this.cleanUp();
    this.state = chemistry.Game.state.GAME_OVER;
    goog.events.dispatchEvent(this, new chemistry.events.GameEvent(chemistry.events.GameEvent.GAME_OVER));
    this.gameOverOverlay.gameOver();
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
        var score = config.calculateScore(this, multiplier, molecule)
        targetBox.highlight(true);
        this.addScore(score, molecule);
        this.addHP( this.level.getHP(true, multiplier) );
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
    this.addHP( this.level.getHP(false, 0) );
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

        if(molecule.getPosition().y + molecule.getSize().height >= this.boardEdgeY) {
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
    if(this.tutorialScreen) {
        return;
    }

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
