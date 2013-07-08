goog.provide('chemistry.Game');

goog.require('chemistry.Hud');
goog.require('lime.Scene');
goog.require('chemistry.Molecule');
goog.require('chemistry.Lane');

chemistry.Game = function(width, height, difficulty) {
	lime.Scene.call(this);
	this.setSize(width, height);

	var colorLayer = new lime.Sprite();
	colorLayer.setAnchorPoint(0,0);
	colorLayer.setSize(width, height);
	colorLayer.setFill("#fbc");
	this.appendChild(colorLayer);

	this.lanes = [];
	this.lanes.push(new chemistry.Lane(width/2.0, height, 0));
	this.lanes[0].setAnchorPoint(0,0);
	this.lanes[0].setPosition(0,0);

	this.lanes.push(new chemistry.Lane(width/2.0, height, 1));
	this.lanes[1].setAnchorPoint(0,0);
	this.lanes[1].setPosition(width/2.0,0);

	this.hud = new chemistry.Hud(appObject.screenWidth, appObject.screenWidth/4.0);
	this.appendChild(this.hud);

	

	var data = {chainLength: 4, numBranches: 1, numFunctionalGroups: 0, imageFile: "images/molecules/test.png"};
	var molecule = new chemistry.Molecule(data);
	molecule.velocity = 1;
	this.lanes[0].addMolecule(molecule);
	this.appendChild(molecule);
	
	lime.scheduleManager.schedule(this.tick, this);
}
goog.inherits(chemistry.Game, lime.Scene);

chemistry.Game.prototype.tick = function(dt) {
	for(var i in this.lanes) {
		var lane = this.lanes[i];
		lane.tick(dt);
	}
};