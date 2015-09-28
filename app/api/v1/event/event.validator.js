'use strict';

var validate = require('express-validation')
  , Joi = require('joi');

var validateBodyEventBandwidthIncrease = validate({
  body: {
    type: Joi.string().equal('bandwidthIncrease').required(),
    user_id: Joi.number().integer().positive().required(),
    ip: Joi.string().ip().optional(),
    fqdn: Joi.string().max(255).required(),
    video_bitrate: Joi.number().integer().positive().required(),
    audio_bitrate: Joi.number().integer().positive().required()
  }
});

var validateBodyEventBandwidthDecrease = validate({
  body: {
    type: Joi.string().equal('bandwidthDecrease').required(),
    user_id: Joi.number().integer().positive().required(),
    fqdn: Joi.string().max(255).required(),
    video_bitrate: Joi.number().integer().positive().required(),
    audio_bitrate: Joi.number().integer().positive().required()
  }
});

var validateBodyEventError = validate({
  body: {
    type: Joi.string().equal('bandwidthDecrease').required(),
    user_id: Joi.number().integer().positive().required(),
    fqdn: Joi.string().max(255).required(),
    number: Joi.number().integer().positive().required(),
    message: Joi.string().max(255).required()
  }
});

var validateBodyEventBuffering = validate({
  body: {
    type: Joi.string().equal('buffering').required(),
    user_id: Joi.number().integer().positive().required(),
    fqdn: Joi.string().max(255).required()
  }
});

var validateBodyEventStart = validate({
  body: {
    type: Joi.string().equal('start').required(),
    user_id: Joi.number().integer().positive().required(),
    fqdn: Joi.string().max(255).required(),
    os: Joi.string().max(255).required(),
    os_version: Joi.string().max(64).required(),
    web_browser: Joi.string().max(255).required(),
    web_browser_version: Joi.string().max(64).required(),
    resolution_size: Joi.string().max(32).required(),
    flash_version: Joi.string().max(32).required(),
    html5_video: Joi.boolean().required(),
    relative_url: Joi.string().max(255).required()
  }
});

var validateBodyEventStop = validate({
  body: {
    type: Joi.string().equal('stop').required(),
    user_id: Joi.number().integer().positive().required(),
    fqdn: Joi.string().max(255).required(),
    timeout: Joi.boolean().required(),
    frames_dropped: Joi.number().integer().positive().required()
  }
});


module.exports = function (options) {
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
      case 'event_start':
        validateBodyEventStart(req, res, next);
        break;
      case 'event_stop':
        validateBodyEventStop(req, res, next);
        break;
      default:
        return res.error('unknown type');
    }
  };
};