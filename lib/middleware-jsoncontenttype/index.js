'use strict';

module.exports = function (options) {
  return function (req, res, next) {
    res.type('application/json; charset=utf-8');
    next();
  };
};