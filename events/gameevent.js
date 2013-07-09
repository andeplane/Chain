goog.provide("chemistry.events.GameEvent");

goog.require("goog.events.Event");

chemistry.events.GameEvent = function(eventType, returnValue) {
    goog.events.Event.call(this, eventType, null);
    this.returnValue = returnValue
}
goog.inherits(chemistry.events.GameEvent, goog.events.Event);

chemistry.events.GameEvent.HP_CHANGED = "HP_CHANGED";
chemistry.events.GameEvent.HP_FULL = "HP_FULL";

chemistry.events.GameEvent.GAME_OVER = "GAME_OVER";

chemistry.events.GameEvent.MOLECULE_HIT_TARGET_BOX = "MOLECULE_HIT_TARGET_BOX";
