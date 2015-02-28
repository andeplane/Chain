goog.provide('limeApp');

goog.require('chemistry.MainMenu');
goog.require('chemistry.Game');
goog.require('chemistry.Facebook');
goog.require('chemistry.Scores');
goog.require('chemistry.Leaderboard');
goog.require('chemistry.Config');
goog.require('chemistry.LoadingScene')
goog.require('chemistry.MoleculeData')
goog.require('chemistry.AboutScene')

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Sprite');
goog.require('lime.audio.Audio');
goog.require('lime.transitions.Dissolve');

goog.require('goog.net.ImageLoader')

lime.Label.defaultFont = "Audiowide";

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

limeApp = function(body, screenWidth, screenHeight, scaling) {
    // Store variables locally
    this.body = body
    this.screenHeight = screenHeight;
    this.screenWidth = screenWidth;
    this.scaling = scaling;
    
    // Setup everything else
    if(!localStorage.uuid) {
        localStorage.uuid = guid();
    }
    this.director = new lime.Director(body, this.screenWidth, this.screenHeight);
    this.loadingScene = new chemistry.LoadingScene(this.screenWidth, this.screenHeight);
    this.director.replaceScene(this.loadingScene);
    this.preloadImagesAndStart();
};

limeApp.prototype.preloadImagesAndStart = function() {
    // Preload images
    this.loader = new goog.net.ImageLoader();
    this.moleculeData = new chemistry.MoleculeData().getMoleculeData();
    goog.events.listen( this.loader , goog.events.EventType.LOAD , this.imageLoaded , false , this );
    goog.events.listen( this.loader , goog.net.EventType.COMPLETE , this.imagesCompletelyLoaded , false , this );

    this.loader.addImage("./images/design/mainmenu/background.png", "./images/design/mainmenu/background.png");
    // this.loader.addImage("./images/design/mainmenu/hardbutton.png", "./images/design/mainmenu/hardbutton.png");
    // this.loader.addImage("./images/design/mainmenu/leaderboards.png", "./images/design/mainmenu/leaderboards.png");
    // this.loader.addImage("./images/design/mainmenu/loginbutton.png", "./images/design/mainmenu/loginbutton.png");
    // this.loader.addImage("./images/design/mainmenu/mediumbutton.png", "./images/design/mainmenu/mediumbutton.png");
    // this.loader.addImage("./images/design/mainmenu/easybutton.png", "./images/design/mainmenu/easybutton.png");
    // this.loader.addImage("./images/design/button7.png", "./images/design/button7.png");
    // this.loader.addImage("./images/design/ingamemenu/restartbutton.png", "./images/design/ingamemenu/restartbutton.png");
    // this.loader.addImage("./images/design/ingamemenu/continuebutton.png", "./images/design/ingamemenu/continuebutton.png");
    // this.loader.addImage("./images/design/ingamemenu/background.png", "./images/design/ingamemenu/background.png");
    // this.loader.addImage("./images/design/ingamemenu/mainmenubutton.png", "./images/design/ingamemenu/mainmenubutton.png");
    // this.loader.addImage("./images/design/tutorials/tutorial-hard.png", "./images/design/tutorials/tutorial-hard.png");
    // this.loader.addImage("./images/design/tutorials/tutorial-easy.png", "./images/design/tutorials/tutorial-easy.png");
    // this.loader.addImage("./images/design/tutorials/tutorial-medium.png", "./images/design/tutorials/tutorial-medium.png");
    // this.loader.addImage("./images/design/button8.png", "./images/design/button8.png");
    // this.loader.addImage("./images/design/button4.png", "./images/design/button4.png");
    // this.loader.addImage("./images/design/pausebutton.png", "./images/design/pausebutton.png");
    // this.loader.addImage("./images/design/leaderboards/background.png", "./images/design/leaderboards/background.png");
    // this.loader.addImage("./images/design/lifebar-pulsing.png", "./images/design/lifebar-pulsing.png");
    // this.loader.addImage("./images/design/button6.png", "./images/design/button6.png");
    // this.loader.addImage("./images/design/failbox.png", "./images/design/failbox.png");
    // this.loader.addImage("./images/design/background.png", "./images/design/background.png");
    // this.loader.addImage("./images/design/button5.png", "./images/design/button5.png");
    // this.loader.addImage("./images/design/button3.png", "./images/design/button3.png");
    // this.loader.addImage("./images/design/header.png", "./images/design/header.png");
    // this.loader.addImage("./images/design/button-3.png", "./images/design/button-3.png");
    // this.loader.addImage("./images/design/highlight-success.png", "./images/design/highlight-success.png");
    // this.loader.addImage("./images/design/backbutton.png", "./images/design/backbutton.png");
    // this.loader.addImage("./images/design/highlight-fail.png", "./images/design/highlight-fail.png");
    // this.loader.addImage("./images/design/lifebar.png", "./images/design/lifebar.png");
    // this.loader.addImage("./images/design/gameover/background.png", "./images/design/gameover/background.png");
    // this.loader.addImage("./images/design/gameover/retrybutton.png", "./images/design/gameover/retrybutton.png");
    // this.loader.addImage("./images/design/gameover/endgamebutton.png", "./images/design/gameover/endgamebutton.png");
    //
    //
    // // Then all molecule images
    // this.nImagesToLoad = this.moleculeData.length + 40;
    // this.nLoadedImages = 0;
    // for(var i = 0; i < this.moleculeData.length; i++) {
    //     this.loader.addImage(this.moleculeData[i].imageFile, this.moleculeData[i].imageFile);
    // }
    this.loader.start();
}

limeApp.prototype.setupApp = function() {
    this.director.makeMobileWebAppCapable();
    this.director.pauseClassFactory = chemistry.scenes.PauseScene;
    goog.exportSymbol('appObject', this);
    this.verticalCenter = this.screenHeight/2;
    this.horizontalCenter = this.screenWidth/2;
    this.baseVelocity = this.screenHeight / 20;
    this.gridUnit = this.screenWidth / 40;
    this.gridUnitH = this.screenHeight / 40;
    this.config = new chemistry.Config();
    this.isConnected = true;
    var self = this;
    document.addEventListener("online", function() {
        alert("Online!");
        self.isConnected = true;
    }, false);

    document.addEventListener("offline", function() {
        alert("Offline!");
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
    this.aboutScene = new chemistry.AboutScene(this.screenWidth, this.screenHeight);
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
    this.showMainMenu();
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

limeApp.prototype.showAbout = function() {
    this.director.replaceScene(this.aboutScene);
}

limeApp.prototype.imageLoaded = function() {
    this.nLoadedImages += 1;
    this.loadingScene.setProgress(this.nLoadedImages / this.nImagesToLoad);
}

limeApp.prototype.imagesCompletelyLoaded = function() {
    this.setupApp();
}
