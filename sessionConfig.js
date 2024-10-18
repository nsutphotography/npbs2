const session = require('express-session');
const connectRedis = require('connect-redis'); // No need for .default
const Redis = require('redis'); // Import Redis
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL // Use an environment variable for the Redis URL
});

redisClient.connect().catch(err => console.error('Failed to connect to Redis:', err));

const RedisStore = connectRedis(session);

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
