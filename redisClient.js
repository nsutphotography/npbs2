// redisClient.js
const Redis = require('redis');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL // Use an environment variable for the Redis URL
});

redisClient.connect().catch(err => console.error('Failed to connect to Redis:', err));

module.exports = redisClient; // Export the redisClient
