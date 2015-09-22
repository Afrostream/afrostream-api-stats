'use strict';

// bootstrapping the tests (env var, ,..)
require('../../bootstrap.js');
// requesting app
var app = rootRequire('/app');

// third party
var request = require('supertest');

describe('/alive', function () {
  it('should answer 200OK {"alive":true}', function (done) {
    request(app)
      .get('/alive')
      .expect('Content-Type', /json/)
      .expect(200, '{"alive":true}')
      .end(done);
  });
});