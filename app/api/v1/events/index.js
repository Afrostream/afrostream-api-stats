'use strict';

var router = require('express').Router();

var models = rootRequire('models.js')
  , Event = models.Event;

router.post('/', function (req, res) {
  res.error('fixme');
});

router.get('/random', require('./random.js'));

router.get('/:id', function (req, res) {
  new Event({id: req.params.id}).fetch().then(
    function (m) { res.json(m.toJSON()); },
    res.error
  );
});

module.exports = router;
