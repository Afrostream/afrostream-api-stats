'use strict';

var models = rootRequire('models.js')
  , Event = models.Event
  , EventBandwidth = models.EventBandwidth
  , EventError = models.EventError
  , EventStart = models.EventStart
  , EventStop = models.EventStop;

// ugly, but functionnal :)
var nbFakeUsers = 5;
Array.create = function (length, val) { return Array.apply(null, Array(length)).map(function () { return val; }); }
var randomInteger = function () { return Math.round(Math.random() * 1000000); };
var randomSmallInteger = function () { return Math.round(Math.random() * 255); };
var randomPick = function (a) { return a[Math.floor(Math.random() * a.length)]; };
var randomIp = function () { return randomSmallInteger()+'.'+randomSmallInteger()+'.'+randomSmallInteger()+'.'+randomSmallInteger()};
var randomRelativeUrl = function () { return '/video/'+randomInteger(); };
var chance = function (percent) { return Boolean(Math.random() < percent / 100); };
var fqdns = ['cdn1.afrostream.tv', 'cdn2.afrostream.tv', 'cdn3.afrostream.tv'];
var countries = ['FR', 'FR', 'FR', 'FR', 'FR', 'BE', 'US'];
var protocols = ['http', 'https'];
var u = Array.create(nbFakeUsers);
var user_ids = u.map(randomInteger);
var user_fqdn = u.map(randomPick.bind(null, fqdns));
var user_ips = u.map(randomIp);
var user_protocols = u.map(randomPick.bind(null, protocols));
var user_countries = u.map(randomPick.bind(null, countries));
var user_asns = u.map(randomSmallInteger);
var user_urls = u.map(randomRelativeUrl);

var browsers = ['chrome', 'ie', 'opera', 'safari', 'khtml'];
var os = ['freebsd', 'linux', 'windows', 'macosx', 'ios', 'android'];

var events = [];
var addEvent = function (name, nb) { for (var i = 0; i < nb; ++i) events.push(name) };
addEvent('start', 3);
addEvent('stop', 3);
addEvent('error', 1);
addEvent('buffering', 10);
addEvent('bandwidthIncrease', 30);
addEvent('bandwidthDecrease', 30);

// updated every seconds
var stats = {
  nbRequests: 0,
  nbRequestsLastSec: 0,                // auto (computed in the set Interval)
  avgRequestResponseTimeLastSecond: 0, // auto (computed in the set Interval)
  nbInserts: 0,
  nbInsertsLastSec: 0,                 // auto (computed in the set Interval)
  avgInsertResponseTimeLastSecond: 0,  // auto (computed in the set Interval)
  nbPendingInserts: 0,
  nbPendingClients: 0,
  last10RequestsResponseTime: Array.create(10, 0),
  last10InsertTime: Array.create(10, 0),
  cumulatedRequestResponseTime: 0,
  cumulatedInsertResponseTime: 0,
  nbRequestsBeforeLastSec: 0,
  nbInsertsBeforeLastSec: 0,
  cumulatedRequestResponseTimeBeforeLastSec: 0,
  cumulatedInsertResponseTimeBeforeLastSec: 0
};

setInterval(function () {
  stats.nbRequestsLastSec = stats.nbRequests - stats.nbRequestsBeforeLastSec;
  stats.nbInsertsLastSec = stats.nbInserts - stats.nbInsertsBeforeLastSec;
  stats.avgRequestResponseTimeLastSecond = (stats.cumulatedRequestResponseTime -stats.cumulatedRequestResponseTimeBeforeLastSec) / stats.nbRequestsLastSec;
  stats.avgInsertResponseTimeLastSecond = (stats.cumulatedInsertResponseTime - stats.cumulatedInsertResponseTimeBeforeLastSec) / stats.nbInsertsLastSec;
  stats.nbRequestsBeforeLastSec = stats.nbRequests;
  stats.nbInsertsBeforeLastSec = stats.nbInserts;
  stats.cumulatedRequestResponseTimeBeforeLastSec = stats.cumulatedRequestResponseTime;
  stats.cumulatedInsertResponseTimeBeforeLastSec = stats.cumulatedInsertResponseTime;
}, 1000);

module.exports.getStats = function getStats(req, res) { res.json(stats); };

module.exports.insertRandomData = function insertRandomData(req, res) {
  // stats funcs.
  var pendingInserts = 0;
  var startInsertTime;
  var beforeInsert = function () {
    addPendingInsert();
    startInsertTime = new Date();
  };
  var afterInsert = function () {
    removePendingInsert();
    stats.nbInserts++;
    var insertTime = new Date() - startInsertTime;
    stats.cumulatedInsertResponseTime += insertTime;
    stats.last10InsertTime.shift();
    stats.last10InsertTime.push(insertTime);
  };
  var addPendingInsert = function () {
    pendingInserts++;
    stats.nbPendingInserts++;
  };
  var removePendingInsert = function () {
    pendingInserts--;
    stats.nbPendingInserts--;
  };
  var removeAllPendingInsert = function () {
    while (pendingInserts > 0) {
      removePendingInsert();
    }
  };
  var startTime;
  var startRequest = function () {
    startTime = new Date();
    stats.nbPendingClients++;
  };
  var endRequest = function () {
    removeAllPendingInsert();
    stats.nbRequests++;
    var responseTime = new Date() - startTime;
    stats.cumulatedRequestResponseTime += responseTime;
    stats.last10RequestsResponseTime.shift();
    stats.last10RequestsResponseTime.push(responseTime);
    stats.nbPendingClients--;
  };


  // STARTING

  startRequest();

  var eventType = randomPick(events);
  var userId = randomPick(user_ids);
  var userIndex = user_ids.indexOf(userId);

  var p;
  var event;
  var additionnalEvent;
  var eventId;

  switch (eventType) {
    case 'bandwidthIncrease':
      // default event
      event = new Event({
        user_id: userId,
        ip: user_ips[userIndex],
        protocol: user_protocols[userIndex],
        fqdn: user_fqdn[userIndex],
        relative_url: user_urls[userIndex],
        type: 'bandwidthIncrease',
        country: user_countries[userIndex],
        asn: user_asns[userIndex]
      });
      beforeInsert();
      p = event.save().then(function (model) {
        afterInsert();
        eventId = model.id;
        var eventBandwidth = new EventBandwidth({
          event_id: model.id,
          video_bitrate: randomInteger(),
          audio_bitrate: randomInteger()
        });
        additionnalEvent = eventBandwidth;
        beforeInsert();
        return eventBandwidth.save().then(function (o) {
          afterInsert();
          return o;
        });
      });
      break;
    case 'bandwidthDecrease':
      // default event
      event = new Event({
        user_id: userId,
        ip: user_ips[userIndex],
        protocol: user_protocols[userIndex],
        fqdn: user_fqdn[userIndex],
        relative_url: user_urls[userIndex],
        type: 'bandwidthDecrease',
        country: user_countries[userIndex],
        asn: user_asns[userIndex]
      });
      //
      beforeInsert();
      p = event.save().then(function (model) {
        afterInsert();
        eventId = model.id;
        var eventBandwidth = new EventBandwidth({
          event_id: model.id,
          video_bitrate: randomInteger(),
          audio_bitrate: randomInteger()
        });
        additionnalEvent = eventBandwidth;
        beforeInsert();
        return eventBandwidth.save().then(function (o) {
          afterInsert();
          return o;
        });
      });
      break;
    case 'error':
      // default event
      event = new Event({
        user_id: userId,
        ip: user_ips[userIndex],
        protocol: user_protocols[userIndex],
        fqdn: user_fqdn[userIndex],
        relative_url: user_urls[userIndex],
        type: 'error',
        country: user_countries[userIndex],
        asn: user_asns[userIndex]
      });
      //
      beforeInsert();
      p = event.save().then(function (model) {
        afterInsert();
        eventId = model.id;
        var eventError = new EventError({
          event_id: model.id,
          number: randomSmallInteger(),
          message: "random error text (" + randomInteger() +")"
        });
        additionnalEvent = eventError;
        beforeInsert();
        return eventError.save().then(function (o) {
          afterInsert();
          return o;
        });
      });
      break;
    case 'buffering':
      // default event
      event = new Event({
        user_id: userId,
        ip: user_ips[userIndex],
        protocol: user_protocols[userIndex],
        fqdn: user_fqdn[userIndex],
        relative_url: user_urls[userIndex],
        type: 'buffering',
        country: user_countries[userIndex],
        asn: user_asns[userIndex]
      });
      //
      beforeInsert();
      p = event.save().then(function (o) {
        afterInsert();
        return o;
      });
      break;
    case 'start':
      // randomizing url
      user_urls[userIndex] = randomRelativeUrl();
      // randomly updating the user ip (10%)
      if (chance(10)) {
        user_ips[userIndex] = randomIp();
        user_countries[userIndex] = randomPick(countries);
        user_asns[userIndex] = randomSmallInteger();
      }
      // randomly updating the user protocol (5%)
      if (chance()) { user_protocols[userIndex] = randomPick(protocols); }
      //
      event = new Event({
        user_id: userId,
        ip: user_ips[userIndex],
        protocol: user_protocols[userIndex],
        fqdn: user_fqdn[userIndex],
        relative_url: user_urls[userIndex],
        type: 'start',
        country: user_countries[userIndex],
        asn: user_asns[userIndex]
      });
      beforeInsert();
      p = event.save().then(function (model) {
        afterInsert();
        eventId = model.id;
        var eventStart = new EventStart({
          event_id: model.id,
          os: randomPick(os),
          os_version: randomSmallInteger(),
          web_browser: randomPick(browsers),
          web_browser_version: randomSmallInteger(),
          user_agent: randomPick(browsers)+' user agent',
          resolution_size: randomSmallInteger()+'x'+randomSmallInteger(),
          flash_version: randomSmallInteger(),
          html5_video: chance(50)
        });
        additionnalEvent = eventStart;
        beforeInsert();
        return eventStart.save().then(function (o) {
          afterInsert();
          return o;
        });
      });
      break;
    case 'stop':
      // default event
      event = new Event({
        user_id: userId,
        ip: user_ips[userIndex],
        protocol: user_protocols[userIndex],
        fqdn: user_fqdn[userIndex],
        relative_url: user_urls[userIndex],
        type: 'stop',
        country: user_countries[userIndex],
        asn: user_asns[userIndex]
      });
      //
      beforeInsert();
      p = event.save().then(function (model) {
        afterInsert();
        eventId = model.id;
        var eventStop = new EventStop({
          event_id: model.id,
          timeout: chance(50),
          frames_dropped: randomSmallInteger()
        });
        additionnalEvent = eventStop;
        beforeInsert();
        return eventStop.save().then(function (o) {
          afterInsert();
          return o;
        });
      });
      break;
  }

  p.then(
    function success(id) {
      endRequest();
      var j = event.toJSON();
      console.log('event created: '+JSON.stringify(j));
      if (additionnalEvent) {
        console.log('additionnal event created: '+JSON.stringify(additionnalEvent.toJSON()));
      }
      res.json(j);
    },
    function (err) {
      endRequest();
      res.error(err);
    }
  );
};