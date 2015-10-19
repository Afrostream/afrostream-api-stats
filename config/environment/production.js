'use strict';

process.env.NO_ASSERT = true; // enforce.

module.exports = {
  allowOrigin: '*',
  knex: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://postgres:root@localhost:5432/cdnselector',
    pool: {
      min: 1,
      max: 2
    }
  },
  fwdToMq: true
};