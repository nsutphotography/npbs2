// redisClient.js
const redis = require('redis');

// Create the Redis client
const redisClient = redis.createClient({
  // Specify connection details if using a remote Redis instance
  // url: 'redis://default:password@hostname:port'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redisClient.connect().then(() => {
  console.log('Connected to Redis successfully');
}).catch((err) => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);  // Exit if Redis cannot connect
});

module.exports = redisClient; // Export the client for use in other parts of the app
