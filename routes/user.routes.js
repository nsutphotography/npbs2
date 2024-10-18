const express = require('express');
const { requestOtp, verifyOtp, completeSignup } = require('../controllers/user.controller');

const router = express.Router();

router.post('/signup/request-otp', requestOtp);     // Step 1: Request OTP
router.post('/signup/verify-otp', verifyOtp);       // Step 2: Verify OTP
router.post('/signup/complete', completeSignup);    // Step 3: Complete Signup

module.exports = router;
