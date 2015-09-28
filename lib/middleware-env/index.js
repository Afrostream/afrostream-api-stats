'use strict';

module.exports = function (options) {
  options = options || {};
  options.allowed = options.allowed || [];

  if (options.allowed.indexOf(process.env.NODE_ENV) !== -1) {
    return function (req, res, next) { next(); };
  } else {
    return function (req, res, next) { res.status(403).send(''); }
  }
};