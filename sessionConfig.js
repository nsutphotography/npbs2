const session = require('express-session');
const connectRedis = require('connect-redis'); // Remove .default
const Redis = require('redis');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL // Ensure this is set in your environment variables
});

redisClient.connect().catch(err => console.error('Failed to connect to Redis:', err));

const RedisStore = connectRedis(session); // This should work now

const store = new RedisStore({ client: redisClient });

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
