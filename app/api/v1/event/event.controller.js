'use strict';

var config = rootRequire('config');

var utils = require('./event.utils.js');

var mq = require('./event.mq.js')
  , session = require('./../../../../sessions.js')
  , database = require('./event.database.js');

var statsd = rootRequire('statsd');

exports.create = function (req, res) {
  var ip = req.body.ip || req.userIp;

  var data = {
    eventType: req.body.type,
    body: req.body,
    ip: ip,
    maxmindInfos: utils.getMaxmindInfos(ip),
    userAgent: utils.getUserAgent(req),
    protocol: req.protocol
  };

  // forwarding to message queue.
  if (config.mq) {
    mq.forward(data);
  }

  // updating client session
  if (data.eventType !== 'stop') {
    session.touch(data);
  }

  statsd.client.increment('event.insert.'+req.body.type+'.hit');

  // insert event in the database
  database.insert(data)
    .then(
    function success(eventId) { res.send({id: eventId});  },
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
