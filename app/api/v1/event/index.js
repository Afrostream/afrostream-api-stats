'use strict';

var router = require('express').Router();
var controller = require('./event.controller.js');
var validator = require('./event.validator.js');
var env = rootRequire('lib/middleware-env');

router.post('/', validator(), controller.create);
router.get('/:id', env({allowed:['development', 'test']}), controller.show);

module.exports = router;
