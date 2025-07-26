import express from 'express';
const router = express.Router();
const twilio = require('twilio'); // Make sure to install: npm install twilio
const jwt = require('jsonwebtoken'); // Add at top

// In-memory storage for OTPs (replace with database in production)
const otpStore = {};

// Generate and send OTP
router.post('/send-otp', (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ success: false, message: 'Phone number required' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (5 minutes)
    otpStore[phone] = {
      otp,
      expires: Date.now() + 300000
    };

    console.log(`OTP for ${phone}: ${otp}`); // For development only

    // In production, uncomment this Twilio code:
    /*
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

    client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    })
    .then(() => res.json({ success: true }))
    .catch(err => {
      console.error('Twilio error:', err);
      res.status(500).json({ success: false, message: 'Failed to send OTP' });
    });
    */

    // For development, return success immediately
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  // OTP verification logic
  // Should return JWT token on success
});

module.exports = router;
