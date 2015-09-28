'use strict';

var knex = require('./knex.js')
  , bookshelf = require('bookshelf')(knex);

var Event = bookshelf.Model.extend({
  tableName: 'event'
});

var EventBandwidth = bookshelf.Model.extend({
  tableName: 'event_bandwidth',
  event: function () {
    return this.hasOne(Event);
  }
});

var EventError = bookshelf.Model.extend({
  tableName: 'event_error',
  event: function () {
    return this.hasOne(Event);
  }
});

var EventStart = bookshelf.Model.extend({
  tableName: 'event_start',
  event: function () {
    return this.hasOne(Event);
  }
});

var EventStop = bookshelf.Model.extend({
  tableName: 'event_stop',
  event: function () {
    return this.hasOne(Event);
  }
});

module.exports = {
  Event: Event,
  EventBandwidth: EventBandwidth,
  EventError: EventError,
  EventStart: EventStart,
  EventStop: EventStop
};