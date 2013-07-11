goog.provide('app');

goog.require('chemistry.MainMenu');
goog.require('chemistry.Game');
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('lime.audio.Audio');
goog.require('lime.transitions.Dissolve');

app = function(body, screenWidth, screenHeight) {
    this.director = new lime.Director(body, screenWidth, screenHeight);
    this.director.makeMobileWebAppCapable();
    this.director.pauseClassFactory = chemistry.scenes.PauseScene;
    goog.exportSymbol('appObject', this);

    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.verticalCenter = screenHeight/2;
    this.horizontalCenter = screenWidth/2;
    var scene = new lime.Scene();
    // this.audio = new lime.audio.Audio("assets/EIVISSA_SALINAS_feat._DJ_HSERES_-_Belly_Rythm.mp3");
    // this.audio.play();

    this.mainMenu = new chemistry.MainMenu(screenWidth, screenHeight);
    this.director.replaceScene(this.mainMenu);
};

app.prototype.newGame = function(difficulty) {
    this.game = new chemistry.Game(this.screenWidth, this.screenHeight, difficulty);
    
    this.director.replaceScene(this.game);
}

app.prototype.endGame = function() {
    this.director.replaceScene(this.mainMenu);
    this.game = null;
    lime.updateDirtyObjects();
    this.director.setPaused(false);
}

