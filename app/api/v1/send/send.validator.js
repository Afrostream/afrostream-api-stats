'use strict';

var Joi = require('joi')
  , Q = require('q');

var eventValidator = require('../event/event.validator.js');

var schemas = {
  bandwidthIncrease : Joi.object().keys(eventValidator.EventBandwidthIncrease),
  bandwidthDecrease : Joi.object().keys(eventValidator.EventBandwidthDecrease),
  error : Joi.object().keys(eventValidator.EventError),
  buffering : Joi.object().keys(eventValidator.EventBuffering),
  start : Joi.object().keys(eventValidator.EventStart),
  stop : Joi.object().keys(eventValidator.EventStop)
};

var validateEvent = function (event) {
  var schema = schemas[event.type];

  if (schema) {
    return Q.ninvoke(Joi, 'validate', event, schema)
  } else {
    return Q.fcall(function () { throw new Error('unknown type');})
  }
};

var validateEvents = function (body) {
  if (!body || !Array.isArray(body.events)) {
    return Q.fcall(function () { throw new Error('missing events');})
  }
  return Q.all(body.events.map(validateEvent));
};

module.exports.middleware = function (options) {
  return function (req, res, next) {
    validateEvents(req.body)
      .done(function success() { next(); },
            function error(err){ res.error(err) });
  };
};