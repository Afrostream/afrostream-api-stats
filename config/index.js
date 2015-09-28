'use strict';

var _ = require('lodash');

var all = {
  port: process.env.PORT || 3003,
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/cdnselector',
    pool: {
      min: 1,
      max: 2
    }
  }
};

module.exports = _.merge(
  all,
  require('./environment/' + process.env.NODE_ENV + '.js') || {}
);
