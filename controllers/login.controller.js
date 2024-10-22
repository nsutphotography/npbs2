const debugging = true;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.module');
const { sendOtpEmail } = require('../services/emailService');
const { generateOtp } = require('../utils/otpGenerator');
// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Login controller function
const login = async (req, res) => {
  const { email, password } = req.body;
  if (debugging) {
    console.log(email);
    console.log(req.cookies);
  }
  try {
    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'No user with this email. Create one from the backend.' });
    }

    // Compare the provided password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      const otp = generateOtp();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();

      const token_email = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '10m' });

      // Send OTP email only in production
      if (process.env.NODE_ENV === 'production') {
        await sendOtpEmail(user.email, otp);
      }

      res.cookie('token_email', token_email, {
        maxAge: 10 * 60 * 1000,
      });
      return res.status(403).json({
        message: 'Email not verified. Please verify your email from backend',
        redirect: '/signup/otp',
      });
    }

    // Generate a JWT token
    const token_auth = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '30m' });

    res.cookie('token_auth', token_auth, {
      maxAge: 30 * 60 * 1000,
    });

    // Respond with the token
    return res.status(200).json({ name: user.name, email: user.email, message: 'Login successful. This is from backend' });
  } catch (error) {
    console.error('Error during login in catch:', error);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

module.exports = { login };
