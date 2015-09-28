'use strict';

module.exports = {
  allowOrigin: '*',
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/cdnselector',
    pool: {
      min: 1,
      max: 2
    }
  }
};