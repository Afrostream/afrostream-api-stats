'use strict';

var assert = require('better-assert');

// bootstrapping the tests (env var, ,..)
require('../../bootstrap.js');
// requesting app
var app = rootRequire('/app');

// third party
var request = require('supertest');

// events
var eventsType = ['bandwidthIncrease', 'bandwidthDecrease', 'error', 'buffering', 'start', 'stop'];

describe('/api/v1/events', function () {
  describe('POST event', function () {
    var clientId = Math.randomInt()
      , videoBitrate = Math.randomInt()
      , audioBitrate = Math.randomInt();

    var eventType = eventsType.randomPick();

    var eventId;

    it('should answer 200OK', function (done) {
      request(app)
      .post('/api/v1/events')
      .send({
         clientId : clientId,
         type : eventType,
         videoBitrate : videoBitrate,
         audioBitrate : audioBitrate
       })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function(res) {
        assert(typeof res.body.id !== "undefined");
        assert(res.body.clientId === clientId);
        assert(res.body.type === eventType);
        assert(res.body.videoBitrate === videoBitrate);
        assert(res.body.audioBitrate === audioBitrate);

        eventId = res.body.id;
      })
      .end(done);
    });

    it('should be readable', function (done) {
      request(app)
        .get('/api/v1/events/'+eventId)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          assert(res.body.id === eventId);
          assert(res.body.clientId === clientId);
          assert(res.body.type === eventType);
          assert(res.body.videoBitrate === videoBitrate);
          assert(res.body.audioBitrate === audioBitrate);
        })
        .end(done);
    });
  });
});