'use strict';

var router = require('express').Router();

var models = rootRequire('models.js')
  , Event = models.Event;

router.post('/', function (req, res) {
  res.error('fixme');
});

router.get('/:id', function (req, res) {
  new Event({id: req.params.id}).fetch().then(
    function (m) {
      if (m) {
        res.json(m.toJSON());
      } else {
        res.json({});
      }
    },
    res.error
  );
});

module.exports = router;
