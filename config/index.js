'use strict';

var _ = require('lodash');

var all = {
  port: process.env.PORT || 3003,

  session: {
    dataTimeout: 3 * 60,  // seconds
    clientTimeout: 2 * 60 // seconds
  }
};

module.exports = _.merge(
  all,
  require('./environment/' + process.env.NODE_ENV + '.js') || {}
);

