'use strict';

var config = require('./config');

var redisclient = require('./redisclient.js');

var mq = require('./app/api/v1/event/event.mq.js')
  , database = require('./app/api/v1/event/event.database.js');

var Q = require('q');

// should be injected
var statsd = rootRequire('statsd');

/**
 * Storing in redis the fact that the clientIsAlive
 *
 */
var cluster = require('cluster');
var workerId = (cluster.worker && cluster.worker.id) ? cluster.worker.id : 'master';
var dynoId = process.env.DYNO || 'unknown';
var workerUUID = dynoId + ':' + workerId;

var sessions = { /*userId: Session*/};

var sessionDataTimeout = config.session.dataTimeout; // in seconds.
var clientTimeout = config.session.clientTimeout; // in seconds

var Session = function () {
  this.timeoutId = null;
  // last event data
  this.lastEventData = null;
  this.startData = null;
};

/**
 * create or update a session
 *
 * set in redis 2 keys :
 *
 *   session.lastWorker = workerUUID
 *   session.events.event_start = event_start
 *
 * @param data
 */
Session.prototype.touch = function (data) {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
  // importing data in session object
  this.lastEventData = JSON.parse(JSON.stringify(data));
  if (data.eventType === 'start') {
    this.startData = JSON.parse(JSON.stringify(data));
    this.startData.startTime = new Date();
  }
  // messing with redis:
  // we register in Redis that we received a message for this session
  // the key "session.user.4242.lastWorker" will contain the last worker having received messages.
  try {
    redisclient.setex(this.getSessionName()+".lastWorker", sessionDataTimeout, workerUUID);
    if (data.eventType === 'start') {
      redisclient.set(this.getSessionName() + ".events.event_start", JSON.stringify(this.startData));
    }
    redisclient.expire(this.getSessionName() + ".events.event_start", sessionDataTimeout);
  } catch (err) {
    console.error('session: redis: ', err);
  }
  // we check the session status
  this.timeoutId = setTimeout(this.checkTimeout.bind(this), clientTimeout * 1000);
};

Session.prototype.checkTimeout = function () {
  this.timeoutId = null;
  // the session might have timedout
  // we need to check if we are the last "worker" having received message
  Q.all([
    Q.ninvoke(redisclient, 'get', this.getSessionName()+".events.event_start"),
    Q.ninvoke(redisclient, 'get', this.getSessionName()+".lastWorker")
  ]).then(function (results) {
    if (!results[0]) {
      console.error('session: we will not stop a session with missing event_start');
      return;
    }
    if (!results[1]) {
      console.error('session: redis: empty key '+this.getSessionName()+".lastWorker");
      return;
    }
    //
    var uuid = results[1].toString();
    if (uuid === workerUUID) {
      console.log('session: the session ' + this.getSessionName() + ' timedout.');
      // creating event stop
      var data = {
        eventType: 'stop',
        body: {
          user_id: this.lastEventData.body.user_id,
          type: 'stop',
          fqdn: this.lastEventData.body.fqdn,
          timeout: true,
          frames_dropped: 0
        },
        ip: this.lastEventData.ip,
        maxmindInfos: this.lastEventData.maxmindInfos,
        userAgent: this.lastEventData.userAgent,
        protocol: this.lastEventData.protocol
      };
      // fwd to message queue (disabled)
      /*if (config.mq) {
       mq.forward(data);
       }*/
      database.insert(data).then(
        function () { },
        console.error.bind(console)
      );
    } else {
      console.log('session: workerUUID missmatch (' + uuid + ' VS ' + workerUUID + ') -> skip');
    }
  }.bind(this),
    function (err) {
    console.error('session: redis: error stopping session ' + this.getSessionName() + ' ', err);
    }.bind(this));
};

Session.prototype.getSessionName = function () {
  return "session.user."+this.lastEventData.body.user_id;
};

/**
 * Touch session :
 *  - mark the session as alive
 *  - when session timeout => event stop.
 * @param clientId
 */
var touch = function (data) {
  var userId = data.body.user_id;

  // get/create session
  var session = sessions[userId] || new Session();
  sessions[userId] = session;
  // touch
  session.touch(data);
};

var getActives = function () {
  return Q.ninvoke(redisclient, 'keys', 'session.user.*.events.event_start')
    .then(function (keys) {
      return Q.all(keys.map(function (key) {
        return Q.ninvoke(redisclient, 'get', key)
      }));
    })
    .then(
      function success(results) { return results; },
      function error(err) {
        console.error('session: redis: cannot get sessions ', err);
        return [];
      }
    );
};

// adding some metrics :)
setInterval(function () {
  sessions.getActives()
    .then(
      function (sessions) {
        statsd.client.gauge('sessions.actives', sessions && sessions.length || 0);
      },
      function (err) { /* nothing */ }
    );
}, 10000);


module.exports.touch = touch;
module.exports.getActives = getActives;
