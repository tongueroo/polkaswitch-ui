var redis = require('redis');

var redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

['ready', 'connect', 'reconnecting', 'error', 'end', 'warning'].forEach(
  function (v) {
    redisClient.on(v, function (err) {
      console.log(`REDIS: ${v}: ${err || 'done'}`);
    });
  },
);

module.exports = redisClient;
