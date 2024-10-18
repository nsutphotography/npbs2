// sessionConfig.js
const session = require('express-session');
const connectRedis = require('connect-redis').default;
const redisClient = require('./redisClient'); // Import the Redis client

// Log the Redis client
console.log('Redis Client:', redisClient);

if (!redisClient) {
  console.error('Redis client is not initialized!');
}

const RedisStore = connectRedis(session); // Get the RedisStore function

const store = new RedisStore({ client: redisClient }); // Create an instance of RedisStore

const sessionConfig = session({
  store: store, // Use the Redis client as the session store
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 15 // Session expiration time (15 minutes)
  }
});

module.exports = sessionConfig; // Export the session configuration
