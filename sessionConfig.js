const session = require('express-session');
const connectRedis = require('connect-redis'); // Import connect-redis
const Redis = require('redis'); // Import Redis

// Create a Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL // Use an environment variable for the Redis URL
});

redisClient.connect().catch(err => console.error('Failed to connect to Redis:', err));

// Create the RedisStore
const RedisStore = connectRedis(session); // Correct usage for version 7.x

const store = new RedisStore({
  client: redisClient
});

// Session configuration
const sessionConfig = session({
  store: store,
  secret: process.env.SESSION_SECRET, // Ensure this is set in your environment variables
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 15 // Session expiration time (15 minutes)
  }
});

module.exports = sessionConfig;
