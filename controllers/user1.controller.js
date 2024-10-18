const debugging_log=false;
// backend/controllers/userController.js
const UserModel = require('../models/user.module');

const OtpModel = require('../models/otp.module');

const { sendOtpEmail } = require('../services/emailService');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();
// Signup function
// const signup = async (req, res) => {

//     try {
//         const { name, email, password } = req.body;
        
//         // Conditional logging based on environment
//         if (process.env.NODE_ENV === 'development' && debugging_log) {
//             console.log("Request body:", req.body);
//             console.log(name, email, password);
//         }
    
//         // Check for existing user
//         if (process.env.NODE_ENV === 'development' && debugging_log) console.log("new user saved 1");
//         const existingUser = await UserModel.findOne({ email });
//         if (process.env.NODE_ENV === 'development' && debugging_log) console.log("new user saved 2");
    
//         if (existingUser) {
//             return res.status(400).json({ error: 'User already exists' });
//         }
    
//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
    
//         if (process.env.NODE_ENV === 'development' && debugging_log) console.log("new user saved 3");
    
//         // Create new user
//         const user = await UserModel.create({ name, email, password: hashedPassword });
        
//         if (process.env.NODE_ENV === 'development' && debugging_log) console.log("New user saved:", user); // Log the created user object
        
//         if (process.env.NODE_ENV === 'development' && debugging_log) console.log("new user saved 4");
//         if (process.env.NODE_ENV === 'development' && debugging_log) console.log(name, email, password, hashedPassword);
    
//         await user.save();
        
//         console.log("new user saved");
//         res.status(201).json({ message: 'User created successfully' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error new user not saved', details: error.message });
//     }
    




// //     try {
// //     const { name, email, password } = req.body;
// //     console.log("Request body:", req.body);
// // console.log(name , email , password);
// //         // Check for existing user
// //         console.log("new user saved 1");
// //         const existingUser = await UserModel.findOne({ email });
// //         console.log("new user saved 2");
// //         if (existingUser) {
// //             return res.status(400).json({ error: 'User already exists' });
// //         }
// //         // Hash password
// //         const hashedPassword = await bcrypt.hash(password, 10);
        
// //         console.log("new user saved 3");
// //         // Create new user
// //         const user = await UserModel.create({ name, email, password: hashedPassword });
// //         console.log("New user saved:", user); // Log the created user object
    
// //         // const user = await UserModel.create({name, email, password: hashedPassword });
// //         console.log("new user saved 4");
// //         console.log(name , email , password,hashedPassword);

// //         await user.save();
        
// //         console.log("new user saved");
// //         res.status(201).json({ message: 'User created successfully' });
// //     } catch (error) {
// //         res.status(500).json({ error: 'Internal server error new user not saved', details: error.message });
// //     }
// };


const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Save OTP to database
        await OtpModel.create({ email, otp, expiresAt: otpExpiresAt });

        // Send OTP email
        await sendOtpEmail(email, otp);

        // Save user temporarily without verification
        const blueTick = email.endsWith('@nsut.ac.in');
        const user = new UserModel({ name, email, password: hashedPassword, blueTick });
        
        res.status(200).json({ message: 'OTP sent to email. Please verify to complete signup.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error during signup', details: error.message });
    }
};

// Step 2: OTP Verification
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const otpRecord = await OtpModel.findOne({ email, otp });
        if (!otpRecord || otpRecord.expiresAt < Date.now()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Set emailVerified to true
        const user = await UserModel.findOneAndUpdate(
            { email },
            { emailVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Email verified successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error during OTP verification', details: error.message });
    }
};

module.exports = { signup, verifyOtp };

