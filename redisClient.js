// redisClient.js
const Redis = require('redis');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL // Use an environment variable for the Redis URL
});

// Connect to Redis and handle connection success or errors
redisClient.connect()
  .then(() => {
    console.log('Connected to Redis successfully');
  })
  .catch(err => {
    console.error('Failed to connect to Redis:', err);
  });

// Handle Redis client errors
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Function to set data in Redis with logging
async function setData(key, value) {
  try {
    console.log('Data to Redis:', value); // Log the data being sent
    await redisClient.set(key, JSON.stringify(value));
    console.log(`Data for key "${key}" saved successfully to Redis.`);
  } catch (error) {
    console.error(`Error saving data for key "${key}" to Redis:`, error);
  }
}

// Function to get data from Redis with logging
async function getData(key) {
  try {
    console.log('Getting data from Redis for key:', key); // Log the key being retrieved
    const result = await redisClient.get(key);
    console.log('Data retrieved from Redis:', result);
    return result ? JSON.parse(result) : null; // Return parsed result or null if not found
  } catch (error) {
    console.error(`Error getting data for key "${key}" from Redis:`, error);
    return null; // Return null in case of error
  }
}

// Export the redisClient and utility functions
module.exports = { redisClient, setData, getData };
