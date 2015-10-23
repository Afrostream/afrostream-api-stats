'use strict';

var mq = rootRequire('mq.js');

var forward = function (data) {
  // raw message
  var message = JSON.parse(JSON.stringify(data.body));

  // raw message + additionnal data
  if (data.eventType === 'start') {
    message.ip = data.ip;
    message.userAgent = data.userAgent;
    message.protocol = data.protocol;
    message.country = data.maxmindInfos.countryCode;
    message.asn = data.maxmindInfos.asn;
  } else {
    delete message.fqdn;
  }
  mq.send(message);
};

module.exports.forward = forward;