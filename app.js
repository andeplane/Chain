goog.provide('limeApp');

goog.require('chemistry.MainMenu');
goog.require('chemistry.Game');
goog.require('chemistry.Facebook');
goog.require('chemistry.Scores');
goog.require('chemistry.Leaderboard');
goog.require('chemistry.Config');
goog.require('chemistry.LoadingScene')
goog.require('chemistry.MoleculeData')

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('lime.audio.Audio');
goog.require('lime.transitions.Dissolve');

lime.Label.defaultFont = "Sonsie One";

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

limeApp = function(body, screenWidth, screenHeight) {
    // Store variables locally
    this.body = body
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    // Setup everything else
    if(!localStorage.uuid) {
        localStorage.uuid = guid();
    }
    this.director = new lime.Director(body, this.screenWidth, this.screenHeight);
    this.loadingScene = new chemistry.LoadingScene(this.screenWidth, this.screenHeight);
    this.director.replaceScene(this.loadingScene);
    // Preload images
    this.loader = new goog.net.ImageLoader();
    this.moleculeData = new chemistry.MoleculeData().getMoleculeData();
    goog.events.listen( this.loader , goog.events.EventType.LOAD , this.imageLoaded , false , this );
    goog.events.listen( this.loader , goog.net.EventType.COMPLETE , this.imagesCompletelyLoaded , false , this );
    //this.loader.addImage( "tmp/hugeimage.png", 'tmp/hugeimage.png' );
    this.nImagesToLoad = this.moleculeData.length;
    this.nLoadedImages = 0;
    for(var i = 0; i < this.moleculeData.length; i++) {
        this.loader.addImage(this.moleculeData[i].imageFile,this.moleculeData[i].imageFile);
    }
    this.loader.start();
};

limeApp.prototype.setupApp = function() {
    this.director.makeMobileWebAppCapable();
    this.director.pauseClassFactory = chemistry.scenes.PauseScene;
    goog.exportSymbol('appObject', this);
    this.verticalCenter = this.screenHeight/2;
    this.horizontalCenter = this.screenWidth/2;
    this.baseVelocity = this.screenHeight / 20;
    this.gridUnit = this.screenWidth / 40;
    this.config = new chemistry.Config();
    this.isConnected = true;
    var self = this;
    document.addEventListener("online", function() {
        self.isConnected = true;
    }, false);

    document.addEventListener("offline", function() {
        self.isConnected = false;
    }, false);

    var scene = new lime.Scene();
    this.leaderboards = [];
    for(var i=0; i<3; i++) {
        var leaderboard = new chemistry.Leaderboard(this.screenWidth, this.screenHeight, i);
        this.leaderboards.push(leaderboard);
    }

    // this.audio = new lime.audio.Audio("assets/EIVISSA_SALINAS_feat._DJ_HSERES_-_Belly_Rythm.mp3");
    // this.audio.play();

    this.facebook = new chemistry.Facebook();
    this.mainMenu = new chemistry.MainMenu(this.screenWidth, this.screenHeight);
    this.scores = new chemistry.Scores();
    this.director.replaceScene(this.mainMenu);
}

limeApp.prototype.newGame = function(difficulty) {
    this.game = new chemistry.Game(this.screenWidth, this.screenHeight, difficulty);
    
	// this.director.replaceScene(this.game,lime.transitions.Dissolve, 0.2);
	this.director.replaceScene(this.game);
	lime.updateDirtyObjects();
}

limeApp.prototype.endGame = function() {
	// this.director.replaceScene(this.mainMenu,lime.transitions.Dissolve, 0.2);
	this.director.replaceScene(this.mainMenu);
	this.game = null;
	lime.updateDirtyObjects();
}

limeApp.prototype.showLeaderboard = function(difficulty) {
    this.director.replaceScene(this.leaderboards[difficulty]);
    this.leaderboards[difficulty].refresh();
}

limeApp.prototype.showMainMenu = function() {
    this.director.replaceScene(this.mainMenu);
}

limeApp.prototype.imageLoaded = function() {
    this.nLoadedImages += 1;
    this.loadingScene.setProgress(this.nLoadedImages / this.nImagesToLoad);
}

limeApp.prototype.imagesCompletelyLoaded = function() {
    this.setupApp();
}
