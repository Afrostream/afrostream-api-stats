'use strict';

var router = require('express').Router();

var registry = rootRequire('fake-registry.js');

router.post('/', function (req, res) {
  var event = registry.createEvent(req.body);
  res.json(event);
});
router.get('/:id', function (req, res) {
  var event = registry.getEvent(req.params.id);
  res.json(event ? event : {error:'unknown event'});
});

module.exports = router;
