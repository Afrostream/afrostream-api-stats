'use strict';

// helper global.
global.rootRequire = function (name) { return require(__dirname + '/../' + (name[0] === '/' ? name.substr(1) : name)); };
// default env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// load conf
var config = rootRequire('config');

// express
// third party
var app = require('express')();
rootRequire('/config/express.js')(app);

// routes
require('./routes.js')(app);

console.log('trying to bind to '+config.port);

// opening port
app.listen(config.port, function() {
  console.log('Node app is running on port', config.port);
});

module.exports = app;