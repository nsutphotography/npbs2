// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        // required: true, 
        // unique: true 
    },
 
  
    email: { 
        type: String, 
        // required: true, 
        // unique: true 
    },
    password: { 
        type: String, 
        // required: true 
    },
    otp: { 
        type: String 
    },
    otpExpires: { 
        type: Date 
    },
    emailVerified: { 
        type: Boolean, 
        default: false 
    },
    blueTick: { 
        type: Boolean, 
        default: false 
    }
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
