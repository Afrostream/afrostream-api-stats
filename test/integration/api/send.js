'use strict';

var assert = require('better-assert');

// bootstrapping the tests (env var, ,..)
require('../../bootstrap.js');

//
var Q = require('q');

// requesting app
var app = rootRequire('app/index.js');

// third party
var request = require('supertest');

//
var faker = require('faker');
faker.locale = "fr";

// directly check in the database
var models = rootRequire('models.js');
var Event = models.Event;
var EventBandwidth = models.EventBandwidth;
var EventError = models.EventError;
var EventStart = models.EventStart;
var EventStop = models.EventStop;


describe('/api/v1/send', function () {
  var user_id = faker.random.number()
    , fqdn = faker.internet.domainName()
    , relative_url = faker.internet.url()
    , ip = faker.internet.ip();

  describe('POST multiple events (bulk)', function () {
    var eventIds;

    var video_bitrate = faker.random.number()
      , audio_bitrate = faker.random.number();

    var message = faker.lorem.sentence();
    var number = Math.round(Math.random() * 200); // smallint

    var os = 'linux';
    var os_version = String(faker.random.number());
    var web_browser = 'chrome';
    var web_browser_version = String(faker.random.number());
    var resolution_size = faker.random.number()+"x"+faker.random.number();
    var flash_version = String(faker.random.number());
    var html5_video = true;
    var relative_url = faker.lorem.sentence();

    var timeout = true;
    var frames_dropped = faker.random.number();

    it('should answer 200OK', function (done) {
      request(app)
        .post('/api/v1/send')
        .send({
          events: [{
            user_id : user_id,
            type : 'bandwidthIncrease',
            fqdn : fqdn,
            ip: ip,
            video_bitrate : video_bitrate,
            audio_bitrate : audio_bitrate
          }, {
            user_id : user_id,
            type : 'bandwidthDecrease',
            fqdn : fqdn,
            ip: ip,
            video_bitrate : video_bitrate,
            audio_bitrate : audio_bitrate
          }, {
            user_id : user_id,
            type : 'buffering',
            fqdn : fqdn,
            ip: ip
          }, {
            user_id : user_id,
            type : 'error',
            fqdn : fqdn,
            ip: ip,
            number : number,
            message : message
          }, {
            user_id : user_id,
            type : 'start',
            fqdn : fqdn,
            ip: ip,
            os : os,
            os_version : os_version,
            web_browser : web_browser,
            web_browser_version : web_browser_version,
            resolution_size : resolution_size,
            flash_version : flash_version,
            html5_video : html5_video,
            relative_url : relative_url
          }, {
            user_id : user_id,
            type : 'stop',
            fqdn : fqdn,
            ip: ip,
            timeout : timeout,
            frames_dropped : frames_dropped
          }
        ]
      })
        .expect('Content-Type', /json/)
        .expect(200)
        .expect(function(res) {
          assert(Array.isArray(res.body.events));
          assert(res.body.events.length === 6);

          eventIds = res.body.events;
        })
        .end(done);
    });
    it('should be readable', function (done) {
      Q.all([
        new Event({id: eventIds[0].id}).fetch().then(function (e) {
          assert(e.get('id') === eventIds[0].id);
          assert(e.get('user_id') === user_id);
          assert(e.get('ip').indexOf(ip) !== -1); // ip could be transformed
          assert(e.get('type') === 'bandwidthIncrease');
          assert(e.get('fqdn') === fqdn);
          return new EventBandwidth({event_id: eventIds[0].id}).fetch().then(function (e) {
            assert(e.get('video_bitrate') === video_bitrate);
            assert(e.get('audio_bitrate') === audio_bitrate);
          });
        }),
        new Event({id: eventIds[1].id}).fetch().then(function (e) {
          assert(e.get('id') === eventIds[1].id);
          assert(e.get('user_id') === user_id);
          assert(e.get('ip').indexOf(ip) !== -1); // ip could be transformed
          assert(e.get('type') === 'bandwidthDecrease');
          assert(e.get('fqdn') === fqdn);
          return new EventBandwidth({event_id: eventIds[1].id}).fetch().then(function (e) {
            assert(e.get('video_bitrate') === video_bitrate);
            assert(e.get('audio_bitrate') === audio_bitrate);
          });
        }),
        new Event({id: eventIds[2].id}).fetch().then(function (e) {
          assert(e.get('id') === eventIds[2].id);
          assert(e.get('user_id') === user_id);
          assert(e.get('ip').indexOf(ip) !== -1); // ip could be transformed
          assert(e.get('type') === 'buffering');
          assert(e.get('fqdn') === fqdn);
        }),
        new Event({id: eventIds[3].id}).fetch().then(function (e) {
          assert(e.get('id') === eventIds[3].id);
          assert(e.get('user_id') === user_id);
          assert(e.get('ip').indexOf(ip) !== -1); // ip could be transformed
          assert(e.get('type') === 'error');
          assert(e.get('fqdn') === fqdn);
          return new EventError({event_id: eventIds[3].id}).fetch().then(function (e) {
            assert(e.get('number') === number);
            assert(e.get('message') === message);
          });
        }),
        new Event({id: eventIds[4].id}).fetch().then(function (e) {
          assert(e.get('id') === eventIds[4].id);
          assert(e.get('user_id') === user_id);
          assert(e.get('ip').indexOf(ip) !== -1); // ip could be transformed
          assert(e.get('type') === 'start');
          assert(e.get('fqdn') === fqdn);
          return new EventStart({event_id: eventIds[4].id}).fetch().then(function (e) {
            assert(e.get('os') === os);
            assert(e.get('os_version') === os_version);
            assert(e.get('web_browser') === web_browser);
            assert(e.get('web_browser_version') === web_browser_version);
            assert(e.get('resolution_size') === resolution_size);
            assert(e.get('flash_version') === flash_version);
            assert(e.get('html5_video') === html5_video);
            assert(e.get('relative_url') === relative_url);
          });
        }),
        new Event({id: eventIds[5].id}).fetch().then(function (e) {
          assert(e.get('id') === eventIds[5].id);
          assert(e.get('user_id') === user_id);
          assert(e.get('ip').indexOf(ip) !== -1); // ip could be transformed
          assert(e.get('type') === 'stop');
          assert(e.get('fqdn') === fqdn);
          return new EventStop({event_id: eventIds[5].id}).fetch().then(function (e) {
            assert(e.get('timeout') === timeout);
            assert(e.get('frames_dropped') === frames_dropped);
          });
        })
      ]).done(function () {
        done();
      }, done);
    });
  });
});