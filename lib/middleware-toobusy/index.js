'use strict';

var toobusy = require('toobusy-js');

module.exports = function (options) {
  return function(req, res, next) {
    if (toobusy()) {
      console.error('toobusy');
      res.status(503).json({error:'toobusy'});
    } else {
      next();
    }
  };
};