'use strict';

var router = require('express').Router();
var controller = require('./event.controller.js');
var validator = require('./event.validator.js');
var env = rootRequire('lib/middleware-env');
var config = rootRequire('config');
var middlewareFwdToMq = config.fwdToMq ? rootRequire('lib/middleware-fwdtomq')() : function (a, b, n) { return n(); };

router.post('/', validator.middleware(), middlewareFwdToMq, controller.create);
router.get('/:id', env({allowed:['development', 'test']}), controller.show);

module.exports = router;
