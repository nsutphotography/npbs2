const express = require('express');
const { requestOtp, verifyOtp, completeSignup } = require('../controllers/signup.controller');

const router = express.Router();


router.post('/', requestOtp);     // Step 1: Request OTP
router.post('/verify-otp', verifyOtp);       // Step 2: Verify OTP
// router.post('/signup/complete', completeSignup);    // Step 3: Complete Signup



module.exports = router;
