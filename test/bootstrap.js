'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// pre-loading app, rootRequire, etc..
require('../app/index.js');

// utilzzz
Array.prototype.randomPick = function () { return this[Math.floor(Math.random() * this.length)]; };