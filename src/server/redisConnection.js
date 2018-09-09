var redis = require('redis');
// var logger = require('../config/winston');

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';

var redisClient = redis.createClient(REDIS_PORT, REDIS_HOST);
redisClient.on('connect', function() {
  console.log('info', 'connected to Redis');
});

module.exports = redisClient;
