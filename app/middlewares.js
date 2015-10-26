'use strict';

var compression = require('compression')
  , bodyParser = require('body-parser')
  , domain = require('connect-domain');

var ev = require('express-validation');

var config = rootRequire('/config');

/**
 * setting up express app middlewares
 * @param app
 */
module.exports = function (app) {
  // first middleware : are we overloaded ?
  if (process.env.NODE_ENV !== 'test') {
    app.use(rootRequire('/lib/middleware-toobusy')());
  }

  // req.error error handler
  //app.use(domain()); // inactive, messing with setTimeout...
  app.use(rootRequire('/lib/middleware-error')());
  app.use(rootRequire('/lib/middleware-herokuclientip')());

  // parsing POST data
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  //
  app.use(rootRequire('/lib/middleware-allowcrossdomain')({allowOrigin: config.allowOrigin}));
  app.use(rootRequire('/lib/middleware-jsoncontenttype')());

  // default error handlers
  app.use(function (err, req, res, next) {
    if (err instanceof ev.ValidationError) {
      return res.error(err.errors[0].messages.join(','));
    }
    console.error('domain error', err);
    res.error(err);
  });
};