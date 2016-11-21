'use strict';

var ans = require('afrostream-node-statsd');

ans.init({
  module: 'afrostream-api-stats'
});

module.exports = ans;
