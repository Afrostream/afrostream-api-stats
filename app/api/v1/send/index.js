'use strict';

var router = require('express').Router();
var controller = require('./send.controller.js');
var validator = require('./send.validator.js');

router.post('/', validator.middleware(), controller.create);

module.exports = router;