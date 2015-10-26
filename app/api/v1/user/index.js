'use strict';

var router = require('express').Router();

var sessions = rootRequire('sessions.js');

router.get('/', function (req, res, next) {
  sessions.getActives().then(
    function success(sessions) {
      res.json(sessions.map(function (session) {
        return JSON.parse(session);
      }));
    },
    function error(err) { next(err); }
  );
});

module.exports = router;
