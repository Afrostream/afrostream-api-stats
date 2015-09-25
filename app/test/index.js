'use strict';

var router = require('express').Router();

var random = require('./random.js');

var readFile = require('fs').readFile;

router.get('/insert', random.insertRandomData);
router.get('/stats.html', function (req, res) {
  readFile(__dirname + '/stats.html', function (err, text) {
    res.set('Content-Type', 'text/html');
    res.send(text);
  });
});
router.get('/stats', random.getStats);

module.exports = router;
