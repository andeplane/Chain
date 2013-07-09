goog.provide("chemistry.events.LaneEvent");

goog.require("goog.events.Event");

chemistry.events.LaneEvent = function(eventType, laneNumber, molecule, returnValue) {
    goog.events.Event.call(this, eventType, null);
    this.laneNumber = laneNumber
    this.molecule = molecule;
    this.returnValue = returnValue
}
goog.inherits(chemistry.events.LaneEvent, goog.events.Event);

chemistry.events.LaneEvent.MOLECULE_HIT_TARGET_BOX = "MOLECULE_HIT_TARGET_BOX";
