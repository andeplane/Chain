goog.provide("chemistry.overlays.FeverMode");

goog.require("lime.Layer");
goog.require('lime.animation.Spawn');
goog.require("lime.animation.FadeTo");
goog.require("lime.animation.Loop");
goog.require("lime.animation.Sequence");
goog.require("lime.animation.ScaleTo");
goog.require("lime.animation.RotateTo");

chemistry.overlays.FeverMode = function(width, height) {
    lime.Layer.call(this);

    this.setSize(width, height);

    this.feverModeText = new lime.Label("Fever mode!");
    this.feverModeText.setFontSize(width / 16);
    this.feverModeText.setFontFamily('Sonsie One');
    this.feverModeText.setFontColor('#e00');
    this.feverModeText.setSize(width, width / 10);
    this.feverModeText.setPosition(width/2, height/2);
    this.appendChild(this.feverModeText);
}
goog.inherits(chemistry.overlays.FeverMode, lime.Layer);

chemistry.overlays.FeverMode.prototype.enterFeverMode = function() {
    this.setHidden(false);
    this.feverModeText.setOpacity(1);
    this.feverModeText.setScale(1);
    //    var loopAnimation = new lime.animation.Loop(
    //                new lime.animation.Sequence (
    //                    new lime.animation.RotateTo(10).setDuration(0.045),
    //                    new lime.animation.RotateTo(20).setDuration(0.045)
    //                    )
    //                ).setLimit(10);
    //    var animation = loopAnimation;
    var animation =
            new lime.animation.Sequence (
                new lime.animation.RotateTo(10).setDuration(0.045),
                new lime.animation.RotateTo(20).setDuration(0.045),
                new lime.animation.RotateTo(10).setDuration(0.045),
                new lime.animation.RotateTo(20).setDuration(0.045),
                new lime.animation.Spawn(
                    new lime.animation.Sequence (
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045),
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045),
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045),
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045),
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045),
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045),
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045),
                        new lime.animation.RotateTo(10).setDuration(0.045),
                        new lime.animation.RotateTo(20).setDuration(0.045)
                        ),
                    new lime.animation.FadeTo(0).setDuration(1.0),
                    new lime.animation.ScaleTo(8).setDuration(2.0)
                    )
                );
    this.feverModeText.runAction(animation);
    goog.events.listen(animation, lime.animation.Event.STOP, this.endedAnimation, false, this);
}

chemistry.overlays.FeverMode.prototype.endedAnimation = function(event) {
    this.setHidden(true);
}
