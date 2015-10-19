'use strict';

var assert = require('better-assert');

var Q = require('q');

var utils = require('../event/event.utils.js');

exports.create = function (req, res) {
  assert(req.body && Array.isArray(req.body.events));

  var userAgent = utils.getUserAgent(req)
    , protocol = req.protocol;

  var promises = req.body.events.map(function (event) {
    var data = {
      body: event,
      ip: event.ip || req.herokuclientip,
      userAgent: userAgent,
      protocol: protocol
    };

    var eventId;

    // creating event row in database & saving id in req.eid
    var p = utils.createEvent(data)
      .then(function (event) {
        eventId = event.id;
        return eventId;
      });
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
  });

  Q.all(promises).then(
    function success(result) { res.send({events: result.map(function (id) { return { id: id }})});  },
    function error(err){ res.error(err); }
  );
};