goog.provide("chemistry.events.LaneEvent");

goog.require("goog.events.Event");

chemistry.events.LaneEvent = function(eventType, laneNumber, molecule) {
    goog.events.Event.call(this, eventType, null);
    this.laneNumber = laneNumber
    this.molecule = molecule;
}
goog.inherits(chemistry.events.LaneEvent, goog.events.Event);

chemistry.events.LaneEvent.MOLECULE_HIT_TARGET_BOX = "MOLECULE_HIT_TARGET_BOX";
chemistry.events.LaneEvent.CLICKED_TARGET_BOX = "CLICKED_TARGET_BOX";
