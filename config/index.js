'use strict';

var _ = require('lodash');

var all = {
  port: process.env.PORT || 3003
};

module.exports = _.merge(
  all,
  require('./environment/' + process.env.NODE_ENV + '.js') || {}
);
