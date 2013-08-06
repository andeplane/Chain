goog.provide('chemistry.HighscoreEntry');

goog.require('lime.Node');
goog.require('lime.Label');
chemistry.HighscoreEntry = function(number, name, score) {
	lime.Node.call(this);
	this.setAnchorPoint(0.5,0.5);
	this.setSize(300, 20);
	var nameLabel = new lime.Label().setText(number+".  "+name);
	// nameLabel.setSize(nameLabel.getSize().width + 30, nameLabel.getSize().height);

	var scoreLabel = new lime.Label().setText(score);
	scoreLabel.setAnchorPoint(1,0.5);
	nameLabel.setAnchorPoint(0,0.5);

	nameLabel.setPosition(-this.getSize().width/2.0, 0);
	scoreLabel.setPosition(this.getSize().width/2.0, 0);
	
	this.appendChild(nameLabel);
	this.appendChild(scoreLabel);
}
goog.inherits(chemistry.HighscoreEntry, lime.Node);