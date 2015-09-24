'use strict';

var conf = require('./config');
module.exports = require('knex')(conf.knex);