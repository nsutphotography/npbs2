// redisClient.js
const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL, // Use the URL provided by your Redis service
});

// Log when the Redis client connects successfully
redisClient.on('connect', () => {
  console.log('Redis client connected');
});

// Log any errors from the Redis client
redisClient.on('error', (err) => {
  console.error('Redis client error', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis client successfully connected');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

module.exports = redisClient; // Ensure this line is after the connection logic
