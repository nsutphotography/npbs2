// sessionConfig.js
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./redisClient'); // Import the Redis client

// Session configuration using Redis as the store
const sessionConfig = session({
  store: new RedisStore({ client: redisClient }), // Use the Redis client as the session store
  secret: process.env.SESSION_SECRET,  // Ensure SESSION_SECRET is set in environment variables
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production (HTTPS)
    httpOnly: true,  // Prevents JavaScript from accessing cookies
    sameSite: 'none', // For cross-origin requests
    maxAge: 1000 * 60 * 15 // Session expiration time (15 minutes)
  }
});

module.exports = sessionConfig; // Export the session configuration
