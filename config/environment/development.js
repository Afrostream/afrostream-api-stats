'use strict';

module.exports = {
  session: {
    dataTimeout: 5,  // seconds
    clientTimeout: 3 // seconds
  },

  allowOrigin: '*',
  knex: {
    debug: true,
    client: 'pg',
    connection: 'postgres://postgres:root@localhost:5432/cdnselector'
  },
  redisUrl: undefined // default configuration (local redis server)
};