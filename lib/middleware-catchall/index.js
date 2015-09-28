'use strict';

var domain = require('domain');

/**
 * using nodejs domain to implement a clean catchAll (error handler)
 * @see https://nodejs.org/api/domain.html
 *
 * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
 * FIXME: depends on res.error
 * FIXME: ensure domains are working before using it.
 * /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
 */
module.exports = function (options) {
  return function (req, res, next) {
    var reqd = domain.create();

    reqd.add(req);
    reqd.add(res);
    reqd.on('error', res.error);
    reqd.run(next);
  };
};