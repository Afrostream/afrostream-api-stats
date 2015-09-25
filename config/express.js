'use strict';

var domain = require('domain');

var compression = require('compression')
  , bodyParser = require('body-parser');

var toobusy = require('toobusy-js');

var config = rootRequire('/config');

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', config.allowOrigin.url);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  next();
};

var defaultContentType = function (req, res, next) {
  res.type('application/json; charset=utf-8');
  next();
};

/**
 * using nodejs domain to implement a clean catchAll (error handler)
 * @see https://nodejs.org/api/domain.html
 *
 * FIXME: ensure domains are working before using it.
 */
var catchAll = function (req, res, next) {
  var reqd = domain.create();
  reqd.add(req);
  reqd.add(res);
  reqd.on('error', function (err) {
    console.error('Error', err, req.url);
    try {
      res.type('application/json; charset=utf-8');
      res.error(err);
    } catch (er) {
      console.error('Error sending 500', err, req.url);
    }
  });
  reqd.run(next);
};

/**
 * default error func
 */
var error = function (req, res, next) {
  res.error = function (msg) {
    res.status(500).json({error: String(msg) || 'unknown error'});
  };
  next();
};

/**
 * setting up express app middlewares
 * @param app
 */
module.exports = function (app) {
  // first middleware : are we overloaded ?
  app.use(function(req, res, next) {
    if (toobusy()) {
      res.status(503).json({error:'toobusy'});
    } else {
      next();
    }
  });

  // req.error error handler
  app.use(error);
  app.use(catchAll);

  // parsing POST data
  app.use(compression());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  //
  app.use(allowCrossDomain);
  //app.use(defaultContentType);
};