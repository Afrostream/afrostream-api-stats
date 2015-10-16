'use strict';

var models = rootRequire('models.js');
var Event = models.Event
  , EventBandwidth = models.EventBandwidth
  , EventError = models.EventError
  , EventStart = models.EventStart
  , EventStop = models.EventStop;

var assert = require('better-assert');

var maxmind = require('maxmind');

var getMaxmindInfo = function (ip) {
  var asn, country, m;
  try {
    m = String(maxmind.getAsn(ip)).match(/AS([0-9]+).*/);
    asn = m ? m[1] : '';
    country = maxmind.getCountry(ip);
  } catch (e) {
    console.error('maxmind error ', e);
  }
  return  {
    asn: asn ? asn : '',
    countryCode : (country && country.code) ? country.code : ''
  };
};

var createEvent = function (data) {
  assert(data);
  assert(data.body);
  assert(data.ip);

  var maxmindInfo = getMaxmindInfo(data.ip);

  return new Event({
    user_id: data.body.user_id,
    ip: data.ip,
    fqdn: data.body.fqdn,
    type: data.body.type,
    country: maxmindInfo.countryCode,
    asn: maxmindInfo.asn
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
    number: data.body.number,
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
    protocol: data.protocol
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

var getUserAgent = function (req) {
  return req.headers['user-agent'] ? String(req.headers['user-agent']) : '';
};

module.exports.createEvent = createEvent;
module.exports.createEventBandwidth = createEventBandwidth;
module.exports.createEventError = createEventError;
module.exports.createEventStart = createEventStart;
module.exports.createEventStop = createEventStop;
module.exports.getUserAgent = getUserAgent;
