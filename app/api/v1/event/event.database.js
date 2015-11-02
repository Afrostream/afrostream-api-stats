'use strict';

var models = rootRequire('models.js');
var Event = models.Event
  , EventBandwidth = models.EventBandwidth
  , EventError = models.EventError
  , EventStart = models.EventStart
  , EventStop = models.EventStop;

var assert = require('better-assert');

var Q = require('q');

var utils = require('./event.utils.js');

var createEvent = function (data) {
  assert(data);
  assert(data.body);
  assert(data.ip);
  assert(data.maxmindInfos);

  return new Event({
    user_id: data.body.user_id,
    ip: data.ip,
    fqdn: data.body.fqdn,
    type: data.body.type,
    country: data.maxmindInfos.countryCode,
    asn: data.maxmindInfos.asn
  }).save();
};

var createEventBandwidth = function (data, eventId) {
  assert(data);
  assert(data.body);

  return new EventBandwidth({
    event_id: eventId,
    video_bitrate: data.body.video_bitrate,
    audio_bitrate: data.body.audio_bitrate
  }).save();
};

var createEventError = function (data, eventId) {
  assert(data);
  assert(data.body);

  return new EventError({
    event_id: eventId,
    number: data.body.number || 0,
    message: data.body.message
  }).save();
};

var createEventStart = function (data, eventId) {
  assert(data);
  assert(data.body);
  assert(data.userAgent);
  assert(data.protocol);

  return new EventStart({
    event_id: eventId,
    os: data.body.os,
    os_version: data.body.os_version,
    web_browser: data.body.web_browser,
    web_browser_version: data.body.web_browser_version,
    user_agent: data.userAgent,
    resolution_size: data.body.resolution_size,
    flash_version: data.body.flash_version,
    html5_video: data.body.html5_video,
    relative_url: data.body.relative_url,
    protocol: data.protocol,
    // non mandatory for the client
    // -2 <=> nothing received. -1 <=> client error
    video_bitrate: data.body.video_bitrate || -2,
    audio_bitrate: data.body.audio_bitrate || -2
  }).save();
};

var createEventStop = function (data, eventId) {
  assert(data);
  assert(data.body);

  return new EventStop({
    event_id: eventId,
    timeout: data.body.timeout,
    frames_dropped: data.body.frames_dropped
  }).save();
};

var insert = function (data) {
  if (data.eventType === 'ping') {
    // no database insertion for event ping.
    // FIXME: should update column "last_update" (date) in table event_start.
    return Q(null);
  }

  // creating event row in database
  return createEvent(data)
    .then(function (event) {
      return Q().then(function () {
        // creating linked event
        switch (data.eventType) {
          case 'bandwidthIncrease':
          case 'bandwidthDecrease':
            return createEventBandwidth(data, event.id);
            break;
          case 'error':
            return createEventError(data, event.id);
            break;
          case 'buffering':
            break;
          case 'start':
            return createEventStart(data, event.id);
            break;
          case 'stop':
            return createEventStop(data, event.id);
            break;
          default:
            assert(false);
            break;
        }
      })
        .then(function (linkedEvent) {
        return event.id;
      });
    });
};

module.exports.insert = insert;
module.exports.createEvent = createEvent;
module.exports.createEventBandwidth = createEventBandwidth;
module.exports.createEventError = createEventError;
module.exports.createEventStart = createEventStart;
module.exports.createEventStop = createEventStop;
