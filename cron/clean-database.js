process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var knex = require('../knex');

var date = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).toISOString();

console.log('clean database start ' + process.env.NODE_ENV);

/*
 delete from event_bandwidth where event_id in (select id as event_id from event where event.date < '2016-01-01 00:00:00');
 delete from event_error     where event_id in (select id as event_id from event where event.date < '2016-01-01 00:00:00');
 delete from event_start     where event_id in (select id as event_id from event where event.date < '2016-01-01 00:00:00');
 delete from event_stop      where event_id in (select id as event_id from event where event.date < '2016-01-01 00:00:00');
 delete from event where event.date < '2016-01-01 00:00:00';
 */
knex.raw("delete from event_bandwidth where event_id in (select id as event_id from event where event.date < '" + date + "')")
  .then(function () {
    return knex.raw("delete from event_error where event_id in (select id as event_id from event where event.date < '" + date + "')");
  })
  .then(function () {
    return knex.raw("delete from event_start where event_id in (select id as event_id from event where event.date < '" + date + "')");
  })
  .then(function () {
    return knex.raw("delete from event_stop where event_id in (select id as event_id from event where event.date < '" + date + "')");
  })
  .then(function () {
    return knex.raw("delete from event where event.date < '" + date + "'");
  })
  .then(
    function success() { console.log('clean database success'); process.exit(); },
    function error(e) { console.error('clean database error ' + e, e); process.exit(); }
  );