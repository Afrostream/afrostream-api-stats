'use strict';

var assert = require('better-assert');

var config = rootRequire('config');

var Q = require('q');

var utils = require('../event/event.utils.js');

var mq = require('../event/event.mq.js')
  , session = require('../event/event.user-session.js')
  , database = require('../event/event.database.js');

exports.create = function (req, res) {
  assert(req.body && Array.isArray(req.body.events));

  var userAgent = utils.getUserAgent(req)
    , protocol = req.protocol;

  var promises = req.body.events
    .map(function (event) {
      var ip = event.ip || req.herokuclientip;

      var data = {
        eventType: event.type,
        body: event,
        ip: ip,
        maxmindInfos: utils.getMaxmindInfos(ip),
        userAgent: userAgent,
        protocol: protocol
      };

      // forwarding to message queue.
      if (config.mq) {
        mq.forward(data);
      }

      // updating client session
      session.touch(data);

      // insert event in the database
      return database.insert(data);
    });

  Q.all(promises).then(
    function success(result) { res.send({events: result.map(function (eventId) { return { id: eventId }})});  },
    function error(err){ res.error(err); }
  );
};