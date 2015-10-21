'use strict';

var assert = require('better-assert');

var config = rootRequire('config');

var Q = require('q');

var utils = require('../event/event.utils.js');
var mq = rootRequire('mq.js');

exports.create = function (req, res) {
  assert(req.body && Array.isArray(req.body.events));

  var userAgent = utils.getUserAgent(req)
    , protocol = req.protocol;

  var promises = req.body.events
    .map(function (event) {
      var data = {
        body: event,
        ip: event.ip || req.herokuclientip,
        userAgent: userAgent,
        protocol: protocol
      };

      // forwarding to mq.
      var maxmindInfo;
      if (config.mq) {
        maxmindInfo = utils.getMaxmindInfo(data.ip);
        var message = JSON.parse(JSON.stringify(req.body));
        message.ip = data.ip;
        message.userAgent = data.userAgent;
        message.protocol = data.protocol;
        mq.send(message);
      }

      var eventId;

      var p;

      switch (event.type) {
        case 'bandwidthIncrease':
        case 'bandwidthDecrease':
        case 'error':
        case 'buffering':
        case 'start':
        case 'stop':
          // creating event row in database & saving id in req.eid
          p = utils.createEvent(data, maxmindInfo)
            .then(function (event) {
              eventId = event.id;
              return eventId;
            });
          break;
        case 'ping':
          return null; // skip db creation
          break;
        default:
          break
      }
      // creating linked event
      switch (event.type) {
        case 'bandwidthIncrease':
        case 'bandwidthDecrease':
          p = p.then(utils.createEventBandwidth.bind(null, data));
          break;
        case 'error':
          p = p.then(utils.createEventError.bind(null, data));
          break;
        case 'buffering':
          // nothing
          break;
        case 'start':
          p = p.then(utils.createEventStart.bind(null, data));
          break;
        case 'stop':
          p = p.then(utils.createEventStop.bind(null, data));
          break;
        default:
          break;
      }

      // resolving eventId
      return p.then(function () { return eventId; });
    })
    .filter(function (promise) {
      return promise !== null;
    });

  Q.all(promises).then(
    function success(result) { res.send({events: result.map(function (id) { return { id: id }})});  },
    function error(err){ res.error(err); }
  );
};