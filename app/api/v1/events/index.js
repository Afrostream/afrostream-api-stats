'use strict';

var router = require('express').Router();

var registry = rootRequire('registry.js');

router.post('/', function (req, res) {
  registry.createEvent(req.body).then(
    function success(id) { res.json({id: id}); },
    res.error
  );
});
router.get('/:id', function (req, res) {
  registry.getEvent(req.params.id).then(
    function success(event) { res.json(event[0]); },
    res.error
  );
});

module.exports = router;
