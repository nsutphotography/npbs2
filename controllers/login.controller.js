const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.module');
const { sendOtpEmail } = require('../services/emailService')
// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Login controller function
const login = async (req, res) => {
  const { email, password } = req.body;
console.log(email);
  try {
    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Compare the provided password with the stored hash
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
  
        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();
  
        // Store email in the session
        req.session.email = email;
  
        // Send OTP email
        await sendOtpEmail(user.email, otp);
  
        return res.status(403).json({
          error: 'Email not verified. OTP sent to your email. Redirecting to /signup/otp.',
          redirect: '/signup/otp'
        });
      }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token
    return res.status(200).json({ token,name:user.name,email:user.email ,message: 'Login successful. this is from backend' });
  } catch (error) {
    console.error('Error during login in catch:', error);
    return res.status(500).json({ error: 'Server error during login. form catch' });
  }
};


module.exports = { login };
