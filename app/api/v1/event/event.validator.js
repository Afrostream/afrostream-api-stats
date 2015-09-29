'use strict';

var validate = require('express-validation')
  , Joi = require('joi');

var EventBandwidthIncrease = {
  type: Joi.string().equal('bandwidthIncrease').required(),
  user_id: Joi.number().integer().positive().required(),
  ip: Joi.string().ip().optional(),
  fqdn: Joi.string().max(255).required(),
  video_bitrate: Joi.number().integer().positive().required(),
  audio_bitrate: Joi.number().integer().positive().required()
};

var EventBandwidthDecrease = {
  type: Joi.string().equal('bandwidthDecrease').required(),
  user_id: Joi.number().integer().positive().required(),
  ip: Joi.string().ip().optional(),
  fqdn: Joi.string().max(255).required(),
  video_bitrate: Joi.number().integer().positive().required(),
  audio_bitrate: Joi.number().integer().positive().required()
};

var EventError = {
  type: Joi.string().equal('error').required(),
  user_id: Joi.number().integer().positive().required(),
  ip: Joi.string().ip().optional(),
  fqdn: Joi.string().max(255).required(),
  number: Joi.number().integer().positive().required(),
  message: Joi.string().max(255).required()
};

var EventBuffering = {
  type: Joi.string().equal('buffering').required(),
  user_id: Joi.number().integer().positive().required(),
  ip: Joi.string().ip().optional(),
  fqdn: Joi.string().max(255).required()
};

var EventStart = {
  type: Joi.string().equal('start').required(),
  user_id: Joi.number().integer().positive().required(),
  ip: Joi.string().ip().optional(),
  fqdn: Joi.string().max(255).required(),
  os: Joi.string().max(255).required(),
  os_version: Joi.string().max(64).required(),
  web_browser: Joi.string().max(255).required(),
  web_browser_version: Joi.string().max(64).required(),
  resolution_size: Joi.string().max(32).required(),
  flash_version: Joi.string().max(32).required(),
  html5_video: Joi.boolean().required(),
  relative_url: Joi.string().max(255).required()
};

var EventStop = {
  type: Joi.string().equal('stop').required(),
  user_id: Joi.number().integer().positive().required(),
  ip: Joi.string().ip().optional(),
  fqdn: Joi.string().max(255).required(),
  timeout: Joi.boolean().required(),
  frames_dropped: Joi.number().integer().positive().required()
};

var validateBodyEventBandwidthIncrease = validate({body: EventBandwidthIncrease});
var validateBodyEventBandwidthDecrease = validate({body: EventBandwidthDecrease});
var validateBodyEventError = validate({body:EventError});
var validateBodyEventBuffering = validate({body:EventBuffering});
var validateBodyEventStart = validate({body:EventStart});
var validateBodyEventStop = validate({body:EventStop});

module.exports.middleware = function (options) {
  return function (req, res, next) {
    switch (req.body.type) {
      case 'bandwidthIncrease':
        validateBodyEventBandwidthIncrease(req, res, next);
        break;
      case 'bandwidthDecrease':
        validateBodyEventBandwidthDecrease(req, res, next);
        break;
      case 'error':
        validateBodyEventError(req, res, next);
        break;
      case 'buffering':
        validateBodyEventBuffering(req, res, next);
        break;
      case 'start':
        validateBodyEventStart(req, res, next);
        break;
      case 'stop':
        validateBodyEventStop(req, res, next);
        break;
      default:
        return res.error('unknown type');
    }
  };
};

module.exports.EventBandwidthIncrease = EventBandwidthIncrease;
module.exports.EventBandwidthDecrease = EventBandwidthDecrease;
module.exports.EventError = EventError;
module.exports.EventBuffering = EventBuffering;
module.exports.EventStart = EventStart;
module.exports.EventStop = EventStop;
