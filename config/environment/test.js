'use strict';

var debugSql = ((process.env.NODE_DEBUG||'').indexOf('sql') !== -1);

module.exports = {
  allowOrigin: '*',
  knex: {
    debug: debugSql,
    client: 'pg',
    connection: 'postgres://postgres:root@localhost:5432/cdnselector'
  },
  redisUrl: undefined // default configuration (local redis server)
};