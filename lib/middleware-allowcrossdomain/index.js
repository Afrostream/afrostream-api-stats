'use strict';

/**
 * @param options
 * @returns {Function} middleware
 */
module.exports = function (options) {
  options = options || {};
  options.allowOrigin = options.allowOrigin || '*';

  return function (req, res, next) {
    res.header('Access-Control-Allow-Origin', options.allowOrigin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  };
};