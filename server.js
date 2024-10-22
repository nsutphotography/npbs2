// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
require('./db/index')();  // Connect to MongoDB

// Import custom modules
const signupRoutes = require('./routes/signup.routes');  // Signup route
const loginRoutes = require('./routes/login.routes');    // Login route
// const userRoutes = require('./routes/user.routes');   // Additional user-related routes

// Initialize Express app
const app = express();
const port = process.env.PORT || 4000;


// Enable CORS for specific origin and allow credentials (cookies)
const allowedOrigins = [
  process.env.FRONTEND_URL, // Local development
  process.env.PROD_FRONTEND_URL, // Deployed frontend
  process.env.PROD_FRONTEND_URL1, // Deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));


// Parse incoming request bodies
app.use(express.json());                          // Parse JSON
app.use(bodyParser.json());                       // Body-parser for JSON
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded data
app.use(cookieParser());                          // Parse cookies

// Routes
app.use('/api/users/signup', signupRoutes);  // Signup route
app.use('/api/users/login', loginRoutes);    // Login route

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'client/build')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});








// API routes
app.get('/', (req, res) => {
  res.cookie('test_cookie', "for_test");
  res.json({ message: "Welcome to the NSUT Photography Blog API!" });
});