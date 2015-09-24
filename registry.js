'use strict';

var assert = require('better-assert');

var knex = require('./knex.js');

var Registry = function () {

};

/*
 user_id integer NOT NULL,
 ip cidr NOT NULL,
 protocol uri_scheme NOT NULL DEFAULT 'https'::uri_scheme,
 fqdn character varying(255) NOT NULL,
 relative_url character varying(255) NOT NULL,
 type event_types NOT NULL,
 id bigserial NOT NULL,
 country character(2) NOT NULL,
 asn smallint NOT NULL,
 date timestamp with time zone NOT NULL DEFAULT now(),
 CONSTRAINT events_pkey PRIMARY KEY (id)
 */
Registry.prototype.createEvent = function (event) {
  /*
  assert(event);
  assert(event.user_id);
  assert(event.ip);
  assert(event.protocol);
  assert(event.fqdn);
  assert(event.relative_url);
  assert(event.type);
  assert(event.country);
  assert(event.asn);
  assert(event.data);
*/
  event = {
    user_id: 42,
    ip: '127.0.0.1',
    protocol: 'http',
    fqdn: 'cdn1.afrostream.tv',
    relative_url: '/foo/bar'+Math.random(),
    type: 'bandwidthDecrease',
    country: 'FR',
    asn: 1
  };
  return knex('event').returning('id').insert(event);
};

Registry.prototype.getEvent = function (eventId) {
  return knex('event').where({id: eventId});
};

module.exports = new Registry();