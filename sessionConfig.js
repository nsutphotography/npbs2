// sessionConfig.js
const session = require('express-session');
const connectRedis = require('connect-redis').default; // Use .default to access the default export
const redisClient = require('./redisClient'); // Import the Redis client

// Log when the Redis client connects
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

// Log any errors from the Redis client
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

const RedisStore = new connectRedis(session); // Create RedisStore by passing session to connect-redis using 'new'

const sessionConfig = session({
  store: new RedisStore({ client: redisClient }), // Use the Redis client as the session store
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production (HTTPS)
    httpOnly: true, // Prevents JavaScript from accessing cookies
    sameSite: 'none', // For cross-origin requests
    maxAge: 1000 * 60 * 15 // Session expiration time (15 minutes)
  }
});

module.exports = sessionConfig; // Export the session configuration
