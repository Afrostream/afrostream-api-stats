'use strict';

var compression = require('compression')
  , bodyParser = require('body-parser');

var config = rootRequire('/config');

/**
 * setting up express app middlewares
 * @param app
 */
module.exports = function (app) {
  // first middleware : are we overloaded ?
  app.use(rootRequire('/lib/middleware-toobusy')());

  // req.error error handler
  app.use(rootRequire('/lib/middleware-error')());
  app.use(rootRequire('/lib/middleware-catchall')());
  app.use(rootRequire('/lib/middleware-herokuclientip')());

  // parsing POST data
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  //
  app.use(rootRequire('/lib/middleware-allowcrossdomain')({allowOrigin: config.allowOrigin}));
  app.use(rootRequire('/lib/middleware-jsoncontenttype')());
};