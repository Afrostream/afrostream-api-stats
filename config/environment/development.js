'use strict';

module.exports = {
  allowOrigin: '*',
  knex: {
    debug: true,
    client: 'pg',
    connection: 'postgres://postgres:root@localhost:5432/cdnselector'
  }
};