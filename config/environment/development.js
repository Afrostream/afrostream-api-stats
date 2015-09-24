'use strict';

module.exports = {
  allowOrigin: '*',
  knex: {
    client: 'pg',
    connection: 'postgres://postgres:root@localhost:5432/cdnselector'
  }
};