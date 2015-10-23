// key value store abstraction
var config = require('./config');

var redis = require("redis")
  , client = redis.createClient(config.redisUrl);

client.on("connect", function () {
  console.log('connected to redis');
});

client.on("reconnecting", function (o) {
  console.log('reconnecting to redis in ' + o.delay + 'ms ' + o.attempt + ' times.');
});

client.on("error", function (err) {
  console.error("redis: " + err);
});

return client;