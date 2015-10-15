'use strict';

var utils = require('./event.utils.js');

exports.create = function (req, res) {
  var data = {
    body: req.body,
    ip: req.body.ip || req.herokuclientip,
    userAgent: utils.getUserAgent(req),
    protocol: req.protocol
  };

  // creating event row in database & saving id in req.eid
  var p = utils.createEvent(data)
    .then(function (event) {
      req.eid = event.id;
      return event.id;
    });
  // creating linked event
  switch (req.body.type) {
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