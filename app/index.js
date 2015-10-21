'use strict';

// helper global.
global.rootRequire = function (name) { return require(__dirname + '/../' + (name[0] === '/' ? name.substr(1) : name)); };
// default env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// load conf
var config = rootRequire('config');

// load geoip
var maxmind = require('maxmind');
maxmind.init(__dirname + '/../data/geoip/GeoIP.dat');
maxmind.init(__dirname + '/../data/geoip/GeoIPv6.dat');
maxmind.init(__dirname + '/../data/geoip/GeoIPASNum.dat');
maxmind.init(__dirname + '/../data/geoip/GeoIPASNumv6.dat');

// express
// third party
var app = require('express')();
var ev = require('express-validation');

// setup express middlewares
require('./middlewares.js')(app);

// routes
require('./routes.js')(app);

// connecting to mq
if (config.mq) {
  rootRequire('mq.js').connect(config.mq.endpoint);
}

// default error handler
app.use(function (err, req, res, next) {
  if (err instanceof ev.ValidationError) {
    return res.error(err.errors[0].messages.join(','));
  }
  next();
});

// opening port
app.listen(config.port, function() {
  console.log('Node app is running on port', config.port);
});

module.exports = app;