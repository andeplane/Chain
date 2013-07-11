goog.provide("chemistry.events.GameEvent");

goog.require("goog.events.Event");

chemistry.events.GameEvent = function(eventType, returnValue) {
    goog.events.Event.call(this, eventType, null);
    this.returnValue = returnValue
}
goog.inherits(chemistry.events.GameEvent, goog.events.Event);

chemistry.events.GameEvent.HP_CHANGED = "HP_CHANGED";
chemistry.events.GameEvent.ENTER_FEVER_MODE = "ENTER_FEVER_MODE";
chemistry.events.GameEvent.EXIT_FEVER_MODE = "EXIT_FEVER_MODE";

chemistry.events.GameEvent.GAME_OVER = "GAME_OVER";
chemistry.events.GameEvent.LEVEL_UP = "LEVEL_UP";
chemistry.events.GameEvent.WRONG_ANSWER = "WRONG_ANSWER";
chemistry.events.GameEvent.CORRECT_ANSWER = "CORRECT_ANSWER";