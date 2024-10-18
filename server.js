const express = require('express');
const bodyParser = require('body-parser');
const sessionConfig = require('./sessionConfig'); // Import session configuration





require('dotenv').config();

const connectDB = require('./db/index')
const path = require('path');
const cors = require('cors'); 
const app = express();
const port = process.env.PORT || 4000;

const signupRoutes = require('./routes/signup.routes');
const loginRoutes = require('./routes/login.routes');
// const userRoutes = require('./routes/user.routes');

// Connect to MongoDB
connectDB();

// Middleware to enable CORS
app.use(cors(
  {
  // origin: 'http://localhost:5173', // Allow requests from this origin
  origin: process.env.FRONTEND_URL,  // Use the frontend URL from environment variable
  credentials: true // Allow credentials (cookies) to be sent
}
));
// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('trust proxy', 1); // Trust proxy, required for secure cookies

app.use(sessionConfig);

app.use('/api/users/signup', signupRoutes);
app.use('/api/users/login', loginRoutes);
// app.use('/api/users', userRoutes);

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'client/build')));

// API routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the NSUT Photography Blog API!" });
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
