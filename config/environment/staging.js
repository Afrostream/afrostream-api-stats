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
  },
  mq: { endpoint: 'amqp://rabbitmq-1.adm.afrostream.net' },
  redisUrl: process.env.REDIS_URL
};