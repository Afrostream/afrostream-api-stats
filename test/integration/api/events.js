'use strict';

var assert = require('better-assert');

// bootstrapping the tests (env var, ,..)
require('../../bootstrap.js');

// requesting app
var app = rootRequire('app/index.js');

// third party
var request = require('supertest');

var faker = require('faker');
faker.locale = "fr";

// events
describe('/api/v1/events', function () {
  var user_id = faker.random.number()
    , fqdn = faker.internet.domainName()
    , relative_url = faker.internet.url()
    , ip = faker.internet.ip();

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
         ip: ip,
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
      // directly check in the database
      var models = rootRequire('models.js');
      var Event = models.Event;
      var EventBandwidth = models.EventBandwidth;

      new Event({id: eventId}).fetch().then(function (e) {
        assert(e.get('id') === eventId);
        assert(e.get('user_id') === user_id);
        assert(e.get('ip').indexOf(ip) !== -1); // ip could be transformed
        assert(e.get('type') === 'bandwidthIncrease');
        assert(e.get('fqdn') === fqdn);
        return new EventBandwidth({event_id: eventId}).fetch().then(function (e) {
          assert(e.get('video_bitrate') === video_bitrate);
          assert(e.get('audio_bitrate') === audio_bitrate);
        });
      }).then(done);
    });
  });
});