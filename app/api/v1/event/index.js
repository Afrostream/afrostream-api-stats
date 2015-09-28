'use strict';

var router = require('express').Router();
var controller = require('./event.controller.js');
var validator = require('./event.validator.js');

router.post('/', validator(), controller.create);
router.get('/:id', controller.show);

module.exports = router;
