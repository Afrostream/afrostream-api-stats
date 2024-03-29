'use strict';

module.exports = function (app) {
  app.use('/test', require('./test'));
  // REST
  app.use('/api/v1/events', require('./api/v1/event/index.js'));
  app.use('/api/v1/users', require('./api/v1/user/index.js'));
  // NON-REST (bulk send)
  app.use('/api/v1/send', require('./api/v1/send/index.js'));
  //
  app.get('/api/v1/getServersList', require('./api/v1/getserverslist.js'));
  //
  app.get('/alive', require('./alive.js'));

  // All other routes should have a 404 (not found) message
  app.route('/*')
    .get(function (req, res) {
      res.status(404).send('Not found');
    });
};