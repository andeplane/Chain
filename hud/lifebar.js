goog.provide('chemistry.Lifebar');

goog.require('lime.Node');
goog.require('lime.Sprite');

chemistry.Lifebar = function(width, height) {
	lime.Node.call(this);
	this.setSize(width, height);
	this.sprite = new lime.Sprite().setFill("#f00");
	this.sprite.setAnchorPoint(0,1);
	this.appendChild(this.sprite);

	this.setHp(50);
}
goog.inherits(chemistry.Lifebar, lime.Node);

chemistry.Lifebar.prototype.setHp = function(value) {
	this.hp = value;
	this.sprite.setSize(this.getSize().width * this.hp/100, 10);
}