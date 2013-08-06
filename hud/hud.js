goog.provide('chemistry.Hud');

goog.require('lime.Layer');
goog.require('lime.Sprite');
goog.require('chemistry.RollerCounter');
goog.require('chemistry.Lifebar');
goog.require('chemistry.NextMolecule');
goog.require('chemistry.Priority');
goog.require('chemistry.scenes.PauseScene');
// goog.require('lime.AutoResize');

chemistry.Hud = function(width, height) {
	lime.Layer.call(this);
	this.setSize(width, height);
	this.setAnchorPoint(0,0);

    var gridUnit = width * 1.0 / 40.0;

    this.lifebar = new chemistry.Lifebar(26 * gridUnit, 3 * gridUnit);
    this.lifebar.setAnchorPoint(0,0);
    this.lifebar.setPosition(4 * gridUnit, 7 * gridUnit);
    this.appendChild(this.lifebar);

    var colorLayer = new lime.Sprite();
    colorLayer.setAnchorPoint(0,0);
    colorLayer.setSize(40*gridUnit, 11*gridUnit);
//    colorLayer.setAutoResize(lime.AutoResize.WIDTH | lime.AutoResize.HEIGHT);
    colorLayer.setFill("design/export/header.png");
    this.appendChild(colorLayer);

	this.rollerCounter = new chemistry.RollerCounter();
    this.rollerCounter.setPosition(17.5*gridUnit, 3.5*gridUnit);
	this.rollerCounter.setAutoResize(lime.AutoResize.WIDTH | lime.AutoResize.HEIGHT);
	this.appendChild(this.rollerCounter);

    this.nextMolecule = new chemistry.NextMolecule(height, height);
    this.nextMolecule.setAnchorPoint(1,0);
    this.nextMolecule.setPosition(width,0);
	this.appendChild(this.nextMolecule);

	// this.priority = new chemistry.Priority(width/5.0, width/10.0);
	// this.priority.setAnchorPoint(0.5,1);
	// this.priority.setPosition(width/2.0, height);
    // this.appendChild(this.priority);

    this.pauseButton = new lime.Sprite().setSize(7*gridUnit, height).setAnchorPoint(0,0).setPosition(0,0);
	goog.events.listen(this.pauseButton, ['mousedown','touchstart'], this.pauseButtonClicked);
	this.appendChild(this.pauseButton);
}
goog.inherits(chemistry.Hud, lime.Layer);

chemistry.Hud.prototype.tick = function(dt) {
	this.rollerCounter.tick(dt);
	this.nextMolecule.tick(dt);
}

chemistry.Hud.prototype.pauseButtonClicked = function(e) {
	appObject.game.pause();
};
