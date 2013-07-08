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

	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0,0);
	colorLayer.setSize(this.getSize().width, this.getSize().height);
	colorLayer.setAutoResize(lime.AutoResize.WIDTH | lime.AutoResize.HEIGHT);
	colorLayer.setFill("#aff");
	this.appendChild(colorLayer);

	this.rollerCounter = new chemistry.RollerCounter();
	this.rollerCounter.setPosition(this.getSize().width/2, this.getSize().height/8);
	this.rollerCounter.setAutoResize(lime.AutoResize.WIDTH | lime.AutoResize.HEIGHT);
	this.appendChild(this.rollerCounter);

	this.nextMolecule = new chemistry.NextMolecule(height, height);
	this.nextMolecule.setAnchorPoint(1,0);
	this.nextMolecule.setPosition(width,0);
	this.appendChild(this.nextMolecule);

	this.priority = new chemistry.Priority(width/5.0, width/10.0);
	this.priority.setAnchorPoint(0.5,1);
	this.priority.setPosition(width/2.0, height);
	this.appendChild(this.priority);

	this.lifebar = new chemistry.Lifebar(width, 10);
	this.lifebar.setAnchorPoint(0,1);
	this.lifebar.setPosition(0,height);
	this.appendChild(this.lifebar);

	this.pauseButton = new lime.Sprite().setFill('images/pause.png').setSize(width/15.0,width/15.0).setAnchorPoint(0,0).setPosition(20,20);
	goog.events.listen(this.pauseButton, ['mousedown','touchstart'], this.pauseButtonClicked);
	this.appendChild(this.pauseButton);
}
goog.inherits(chemistry.Hud, lime.Layer);

chemistry.Hud.prototype.pauseButtonClicked = function(e) {
	appObject.pause();
};