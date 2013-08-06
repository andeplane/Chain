goog.provide("chemistry.events.TargetBoxEvent");

goog.require("goog.events.Event");

chemistry.events.TargetBoxEvent = function(eventType, targetBox) {
    goog.events.Event.call(this, eventType, null);
    this.targetBox = targetBox;
}
goog.inherits(chemistry.events.TargetBoxEvent, goog.events.Event);

chemistry.events.TargetBoxEvent.CLICKED_TARGET_BOX = "CLICKED_TARGET_BOX";
