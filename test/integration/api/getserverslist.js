'use strict';

var assert = require('better-assert');

// bootstrapping the tests (env var, ,..)
require('../../bootstrap.js');
// requesting app
var app = rootRequire('app/index.js');

// third party
var request = require('supertest');

describe('/api/v1/getServersList', function () {
  it('return the list of servers', function (done) {
    request(app)
      .get('/api/v1/getServersList')
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(function (res) {
        assert(Array.isArray(res.body.servers));
      })
      .end(done);
  });
});