'use strict';

/**
 * Adding req.error
 */
module.exports = function (options) {
  return function (req, res, next) {
    res.error = function (msg) {
      console.error('Error: ', msg, req.url);
      try {
        res.type('application/json; charset=utf-8');
        res.status(500).json({error: String(msg) || 'unknown error'});
      } catch (e) { console.error('Error sending 500', e, req.url); }
    };
    next();
  };
};