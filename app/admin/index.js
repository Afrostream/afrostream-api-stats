'use strict';

var router = require('express').Router();

router.get('/events/:id', function (req, res) {
  res.json({id: req.params.id, type: 'lala'});
});

module.exports = router;