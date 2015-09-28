'use strict';

var models = rootRequire('models.js');
var Event = models.Event
  , EventBandwidth = models.EventBandwidth
  , EventError = models.Error
  , EventStart = models.EventStart
  , EventStop = models.EventStop;

var createEvent = function (req) {
  return new Event({
    user_id: req.body.user_id,
    ip: req.ip,
    fqdn: req.body.fqdn,
    type: req.body.type,
    // FIXME: geoip.
    country: 'FR',
    asn: 42
  }).save();
};

var createEventBandwidth = function (req, eventId) {
  return new EventBandwidth({
    event_id: eventId,
    video_bitrate: req.body.video_bitrate,
    audio_bitrate: req.body.audio_bitrate
  }).save();
};

var createEventError = function (req, eventId) {
  return new EventError({
    event_id: eventId,
    number: req.body.number,
    message: req.body.message
  }).save();
};

var createEventStart = function (req, eventId) {
  return new EventStart({
    event_id: eventId,
    os: req.body.os,
    os_version: req.body.os_version,
    web_browser: req.body.web_browser,
    web_browser_version: req.body.web_browser_version,
    user_agent: req.body.user_agent,
    resolution_size: req.body.resolution_size,
    flash_version: req.body.flash_version,
    html5_video: req.body.html5_video,
    relative_url: req.body.relative_url,
    protocol: req.protocol
  }).save();
};

var createEventStop = function (req, eventId) {
  return new EventStop({
    event_id: eventId,
    timeout: req.body.timeout,
    frames_dropped: req.body.frames_dropped
  }).save();
};

exports.create = function (req, res) {
  var p;

  p = createEvent(req)
    .then(function (event) { req.eid = event.id; return event.id; });
  switch (req.body.type) {
    case 'bandwidthIncrease':
    case 'bandwidthDecrease':
      p = p.then(createEventBandwidth.bind(null, req));
      break;
    case 'error':
      p = p.then(createEventError.bind(null, req));
      break;
    case 'buffering':
      // nothing
      break;
    case 'start':
      p = p.then(createEventStart.bind(null, req));
      break;
    case 'stop':
      p = p.then(createEventStop.bind(null, req));
      break;
    default:
      break;
  }
  //
  p.then(
    function success() { res.send({id: req.eid});  },
    function error(err){ res.error(err); }
  );
};

exports.show = function (req, res) {
  new Event({id: req.params.id}).fetch().then(
    function (m) {
      if (m) {
        res.json(m.toJSON());
      } else {
        res.json({});
      }
    },
    res.error
  );
};