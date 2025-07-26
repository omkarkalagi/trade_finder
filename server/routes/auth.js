import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const router = express.Router();
const otpStore = {}; // Temporary storage for OTPs

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

// Verify OTP - FULL IMPLEMENTATION
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Input validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP required'
      });
    }

    // Check if OTP exists
    const storedOtp = otpStore[phone];
    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check expiration
    if (Date.now() > storedOtp.expires) {
      delete otpStore[phone];
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    // Verify OTP
    if (storedOtp.otp === otp) {
      delete otpStore[phone];

      // Generate JWT token
      const token = jwt.sign(
        { phone },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        success: true,
        message: 'OTP verified',
        token,
        user: { phone }
      });
    }

    res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Add this new route for email login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // In a real app, you would:
    // 1. Verify email/password against database
    // 2. Check password hash
    // 3. Generate JWT token

    // For now, we'll use a placeholder
    if (email && password) {
      const token = jwt.sign(
        { email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { email }
      });
    }

    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
