'use strict';

/**
 * Storing in redis the fact that the clientIsAlive
 *
 */
var cluster = require('cluster');
var workerId = (cluster.worker && cluster.worker.id) ? cluster.worker.id : 'master';
var dynoId = process.env.DYNO || 'unknown';
var workerUUID = dynoId + ':' + workerId;

/**
 * Touch session :
 *  - mark the session as alive
 *  - when session timeout => event stop.
 * @param clientId
 */
var touch = function (data) {
  /*
  var userId = data.body.user_id;

  redisclient.set('client.'+clientId, workerUUID);
  // handling event stop
  */
  // FIXME
};

module.exports.touch = touch;