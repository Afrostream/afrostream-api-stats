'use strict';

var maxmind = require('maxmind');

var getAsnInteger = function (ip) {
  var asn, m;
  try {
    m = String(maxmind.getAsn(ip)).match(/AS([0-9]+).*/);
    asn = m ? parseInt(m[1]) : '';
  } catch (e) {
    console.error('maxmind error ', e);
  }
  return asn ? asn : 0;
};

var getCountryCode = function (ip) {
  var country;
  try {
    country = maxmind.getCountry(ip);
  } catch (e) {
    console.error('maxmind error ', e);
  }
  return (country && country.code) ? country.code : '';
};

module.exports.getAsnInteger = getAsnInteger;
module.exports.getCountryCode = getCountryCode;