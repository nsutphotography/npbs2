const redis = require('redis');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL // Use the full URL
});

redisClient.on('error', (err) => {
  console.error('Failed to connect to Redis:', err);
});

// Connect to Redis
redisClient.connect();
