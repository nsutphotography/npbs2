const UserModel = require('../models/user.module');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateOtp } = require('../utils/otpGenerator');
const { sendOtpEmail } = require('../services/emailService');

// Request OTP during signup
const requestOtp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "A user with this email already exists. Please log in or use a different email."
            });
        }

        // Generate OTP and its expiration time
        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires
        });

        await newUser.save();

        // Send OTP email only in production
        if (process.env.NODE_ENV === 'production') {
            await sendOtpEmail(email, otp);
            console.log("email send to ---", email,"--- only in production");
        }

        // Store email in JWT
        const token_email = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        res.cookie('token_email', token_email, {
            maxAge: 10 * 60 * 1000,
        });

        res.status(200).json({ 
            message: 'OTP sent to email', 
            redirect: '/signup/otp-verify'  // Specify where the frontend should navigate
        });
    } catch (error) {
        res.status(500).json({ error: 'Error requesting OTP from server catch', details: error.message });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    const token_email = req.cookies.token_email;

    if (!token_email) {
        return res.status(403).json({ message: 'No token_email provided ---- server' });
    }
    
    try {
        const decoded = jwt.verify(token_email, process.env.JWT_SECRET); // Verify the token with your JWT secret
        const email = decoded.email; // Extract email from the decoded token

        console.log('Email from token:', email);
        if (!email) {
            return res.status(400).json({ error: 'Session expired. Please request OTP again. no email in session from backend ' });
        }

        const { otp } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Update user verification status
        user.emailVerified = true;
        user.otp = undefined; // Clear the OTP
        user.otpExpires = undefined;

        if (email.endsWith('@nsut.ac.in')) {
            user.blueTick = true;
        }

        await user.save();
        res.status(200).json({ message: 'OTP verified successfully', redirect: '/login' });

    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token_email from server catch' });
    }
};

module.exports = { requestOtp, verifyOtp };
