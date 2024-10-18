// backend/models/otp.module.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
});

const OtpModel = mongoose.model('Otp', otpSchema);
module.exports = OtpModel;
