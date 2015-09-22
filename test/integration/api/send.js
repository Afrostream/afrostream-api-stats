'use strict';

var assert = require('better-assert');

// bootstrapping the tests (env var, ,..)
require('../../bootstrap.js');
// requesting app
var app = rootRequire('/app');

// third party
var request = require('supertest')
  , Q = require('q');

// events
var eventsType = ['bandwidthIncrease', 'bandwidthDecrease', 'error', 'buffering', 'start', 'stop'];

describe('/api/v1/send', function () {
  describe('POST multiple events (bulk)', function () {
    var events = Array.apply(null, {length:5})
      .map(function () {
        return {
          clientId:  Math.randomInt()
        , type: eventsType.randomPick()
        , videoBitrate: Math.randomInt()
        , audioBitrate: Math.randomInt()
        };
      });

    it('should answer 200OK', function (done) {
       request(app)
       .post('/api/v1/send')
       .send({events:events})
       .expect('Content-Type', /json/)
       .expect(200)
       .expect(function(res) {
         assert(Array.isArray(res.body.events));

         res.body.events.forEach(function (event, i) {
           assert(event);
           Object.keys(events[i]).forEach(function (k) {
             assert(events[i][k] === event[k]);
           });
           assert(typeof event.id !== 'undefined');
           events[i].id = event.id;
         });
       })
       .end(done);
    });

    it('should be readable', function (done) {
      // FIXME: something like that... :)
      /*
      events.reduce(function (p, event) {
        assert(typeof event.id !== 'undefined');

        return p.then(function () {
          var r = request(app)
            .get('/api/v1/events/'+event.id )
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
              Object.keys(event).forEach(function (k) {
                assert(event[k] === res.body[k]);
              });
            });
          return Q.nfcall(r.end.bind(r))
        })
      }, Q()).done(done, done);
      */
      done();
    });
  });
});