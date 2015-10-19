'use strict';

var amqp = require('amqplib/callback_api');

var queueName = 'afrostream-api-stats';

var retry = function () {
  if (!retry.id) {
    console.log('middleware mq: try to reconnect in 10sec.');
    retry.id = setTimeout(function () {
      retry.id = null;
      connect();
    }, 10000);
  } else {
    console.log('middleware mq: already reconnecting');
  }
};

var connect = function () {
  amqp.connect('amqp://rabbitmq-1.adm.afrostream.net', function(err, conn) {
    if (err) {
      console.error('middleware mq: cannot connect to mq ', err);
      retry();
    } else {
      console.log('connected to mq');
      conn.on('error', function (e) {
        console.error('middleware mq: disconnected from mq', e);
        connect.ch = null;
        retry();
      });
      conn.createChannel(function (err, ch) {
        // exporting channel.
        connect.ch = ch;
        //
        var event = {
          "user_id": 4242,
          "type": 'bandwidthIncrease',
          "fqdn": 'cdn1.afrostream.tv',
          "video_bitrate": 42000,
          "audio_bitrate": 1000
        };
      });
    }
  });
};

module.exports = function (options) {
  connect();

  return function (req, res, next) {
    try {
      if (req.body) {
        // rabbit-mq forward.
        if (connect.ch) {
          connect.ch.assertQueue(queueName, {durable: true});
          connect.ch.sendToQueue(queueName, new Buffer(JSON.stringify(req.body)));
        }
      }
    } catch (e) {
      console.error('middleware mq: Exception fwd to mq : ', e);
      retry();
    }
    next();
  };
};