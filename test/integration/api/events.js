'use strict';

var assert = require('better-assert');

// bootstrapping the tests (env var, ,..)
require('../../bootstrap.js');
// requesting app
var app = rootRequire('/app');

// third party
var request = require('supertest');

var faker = require('faker');
faker.locale = "fr";

// events
describe('/api/v1/events', function () {
  var user_id = faker.random.number()
    , fqdn = faker.internet.domainName()
    , relative_url = faker.internet.url();

  describe('POST event bandwidthIncrease', function () {
    var video_bitrate = faker.random.number()
      , audio_bitrate = faker.random.number();

    var eventId;

    it('should answer 200OK', function (done) {
      request(app)
      .post('/api/v1/events')
      .send({
         user_id : user_id,
         type : 'bandwidthIncrease',
         fqdn : fqdn,
         relative_url: relative_url,
         video_bitrate : video_bitrate,
         audio_bitrate : audio_bitrate
       })
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function(res) {
        assert(typeof res.body.id !== "undefined");
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