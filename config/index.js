'use strict';

var _ = require('lodash');

var all = {
  port: process.env.PORT || 3003,
  knex: {
    debug: true,
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/cdnselector'
  }
};

module.exports = _.merge(
  all,
  require('./environment/' + process.env.NODE_ENV + '.js') || {}
);
