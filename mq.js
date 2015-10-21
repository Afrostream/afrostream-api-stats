'use strict';

/**
 * FIXME:
 *   refacto this using a mq object, and exporting it
 *   with methods : connect() and send()
 *   send() should trigger connect() if not connected
 *   all methods should return promises.
 *
 * @type {exports|module.exports}
 */
var amqp = require('amqplib/callback_api');

var exchangeName = 'afrostream-api-stats';

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

var connect = function (endPoint) {
  amqp.connect(endPoint, function(err, conn) {
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
      });
    }
  });
};

var send = function (data) {
  try {
    if (connect.ch) {
      connect.ch.assertExchange(exchangeName, 'fanout', {durable: true});
      connect.ch.publish(exchangeName, '', new Buffer(JSON.stringify(data)));
    }
  } catch (e) {
    console.error('middleware mq: Exception fwd to mq : ', e);
    retry();
  }
};

/*
 * exporting connect & send
 */
module.exports.connect = connect;
module.exports.send = send;