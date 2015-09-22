'use strict';

var registry = rootRequire('fake-registry.js');

module.exports = function (req, res) {
  if (Array.isArray(req.body.events)) {
    res.json({events: req.body.events.map(registry.createEvent.bind(registry))});
  } else {
    res.error('events type');
  }
};