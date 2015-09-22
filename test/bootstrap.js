'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

// pre-loading app, rootRequire, etc..
require('../app');

// utilzzz
Array.prototype.randomPick = function () { return this[Math.floor(Math.random() * this.length)]; };
Math.randomInt = function () { return Math.round(Math.random()*100000); };

