const UserModel = require('../models/user.module');
const bcrypt = require('bcryptjs');
const { generateOtp } = require('../utils/otpGenerator');
const { sendOtpEmail } = require('../services/emailService');


// Request OTP during signup
const requestOtp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                // status: "error",
                message: "A user with this email already exists. Please log in or use a different email."
            });
        }

        // Generate OTP
        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Hash the password but don't save the user yet
        const hashedPassword = await bcrypt.hash(password, 10);

        // Temporarily save user details and OTP in the database
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpires
        });

        await newUser.save();

        // Send OTP email
        await sendOtpEmail(email, otp);

        // Store email in session
        req.session.email = email;
        console.log(req.session.email);

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ error: 'Error requesting OTP', details: error.message });
    }
};


// Verify OTP
const verifyOtp = async (req, res) => {
    // res.status(500).json({ error: 'Error verifying OTP', message: "akeka"});
    // return res.status(200).json({ message: 'OTP verified successfully' });

    // console.log("Session data:", req.session); // Check entire session object

    const { otp } = req.body;
     // Retrieve email from session
     const email = req.session.email;
     console.log(req.session.email);
     if (!email) {
        return res.status(400).json({ error: 'Session expired. Please request OTP again. no email in session from backend ' });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        // Mark email as verified
        user.emailVerified = true;
        user.otp = undefined; // Clear the OTP
        user.otpExpires = undefined;

        // Assign blue tick if the email is from nsut.ac.in
        if (email.endsWith('@nsut.ac.in')) {
            user.blueTick = true;
        }

        await user.save();

        // Clear the session
        req.session.email = null;

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error verifying OTP', details: error.message });
    }
};



module.exports = { requestOtp, verifyOtp };
