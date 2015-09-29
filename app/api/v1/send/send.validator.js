'use strict';

module.exports.middleware = function (options) {
  return function (req, res, next) { next(); };
};