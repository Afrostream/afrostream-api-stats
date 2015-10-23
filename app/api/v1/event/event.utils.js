'use strict';

var maxmind = rootRequire('maxmind.js');

var getMaxmindInfos = function (ip) {
  return  {
    asn: maxmind.getAsnInteger(ip),
    countryCode : maxmind.getCountryCode(ip)
  };
};

var getUserAgent = function (req) {
  return req.headers['user-agent'] ? String(req.headers['user-agent']) : '';
};

module.exports.getMaxmindInfos = getMaxmindInfos;
module.exports.getUserAgent = getUserAgent;