'use strict';

var router = require('express').Router();

var random = require('./random.js');

var readFile = require('fs').readFile;

/*
 router.get('/insert', random.insertRandomData);
 router.get('/stats.html', function (req, res) {
 readFile(__dirname + '/stats.html', function (err, text) {
 res.set('Content-Type', 'text/html');
 res.send(text);
 });
 });
 router.get('/stats', random.getStats);
*/

router.get('/headers', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(JSON.stringify(req.headers));
});

router.get('/request-infos', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(
    'headers : ' + "\n" +
    JSON.stringify(req.headers) + "\n" +
    'req.ip : ' + req.ip + "\n" +
    'req.ips : ' + JSON.stringify(req.ips) + "\n" +
    'req.userIp : ' + req.userIp + "\n"
  );
});

module.exports = router;
