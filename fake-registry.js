'use strict';

var Registry = function () {
  this.eventsId = 0;
  this.events = {};
};

Registry.prototype.createEvent = function (event) {
  event.id = this.eventsId;
  this.events[event.id ] = event;
  this.eventsId++;
  return event;
};

Registry.prototype.getEvent = function (eventId) {
  return this.events[eventId];
};

module.exports = new Registry();