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

	var numLanes = 4;
	this.lanes = [];
	for(var i=0; i<numLanes; i++) {
		var lane = new chemistry.Lane(width/numLanes, height, i);
		lane.setAnchorPoint(0,0);
		lane.setPosition(width/numLanes*i,0);

		this.lanes.push(lane);
		this.appendChild(lane);
	}
	
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
	this.hud.tick(dt);
};