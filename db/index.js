// db/index.js
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const connectDB = async () => {
  try {
    // Determine the MongoDB URI based on the environment
    const mongoURI = process.env.NODE_ENV === 'production' 
      ? process.env.MONGODB_URI_PRODUCTION  // Cloud URI for production
      : process.env.MONGODB_URI_LOCAL;      // Local URI for development

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    // Connect to MongoDB (no deprecated options)
    await mongoose.connect(mongoURI);

    console.log(`MongoDB connected successfully in ${process.env.NODE_ENV || 'development'} mode`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    // If there's a connection error, fail fast in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1); // Exit process with failure in production
    }
  }
};

// Export the connection function
module.exports = connectDB;



















// // color added to easily understand the development and production
// // db/index.js
// const mongoose = require('mongoose');
// require('dotenv').config(); // Load environment variables from .env file

// // ANSI escape codes for colors
// const colors = {
//   reset: '\x1b[0m',
//   bright: '\x1b[1m',
//   fgGreen: '\x1b[32m',
//   fgRed: '\x1b[31m',
//   fgYellow: '\x1b[33m'
// };

// const connectDB = async () => {
//   try {
//     // Determine the MongoDB URI based on the environment
//     const mongoURI = process.env.NODE_ENV === 'production' 
//       ? process.env.MONGODB_URI_PRODUCTION  // Cloud URI for production
//       : process.env.MONGODB_URI_LOCAL;      // Local URI for development

//     if (!mongoURI) {
//       throw new Error('MongoDB URI is not defined in environment variables');
//     }

//     // Connect to MongoDB
//     await mongoose.connect(mongoURI);

//     // Highlight the environment in the console log
//     const environment = process.env.NODE_ENV || 'development local host';
//     const envColor = environment === 'production' ? colors.fgRed : colors.fgGreen;

//     console.log(`${colors.bright}MongoDB connected successfully in ${envColor}${environment.toUpperCase()} mode${colors.reset}`);
//   } catch (error) {
//     console.error('MongoDB connection error:', error.message);

//     // If there's a connection error, fail fast in production
//     if (process.env.NODE_ENV === 'production') {
//       process.exit(1); // Exit process with failure in production
//     }
//   }
// };

// // Export the connection function
// module.exports = connectDB;
