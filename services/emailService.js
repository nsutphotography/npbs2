const nodemailer = require('nodemailer');


// Service to send OTP email
const sendOtpEmail = async (email, otp) => {
    if (!email) {
        throw new Error('No email recipient defined'); // Throw an error if email is not provided
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Email Verification',
        text: `Your OTP code is ${otp}`
    };

    try {
        // Try sending the email
        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Error while sending email:', error.message);
        throw new Error('Email not sent'); // Custom error message for the frontend
    }
};

module.exports = { sendOtpEmail };
