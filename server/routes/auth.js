import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const otpStore = {}; // Temporary storage for OTPs

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate and send OTP
router.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number
    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number required'
      });
    }

    // Validate phone format (+91xxxxxxxxxx)
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number format. Use +91xxxxxxxxxx'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (5 minutes)
    otpStore[phone] = {
      otp,
      expires: Date.now() + 300000, // 5 minutes
      attempts: 0
    };

    console.log(`🔐 OTP for ${phone}: ${otp}`); // For development - remove in production

    try {
      // Send SMS via Twilio
      const message = await twilioClient.messages.create({
        body: `🔐 Your Trade Finder verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
      });

      console.log(`✅ SMS sent successfully. SID: ${message.sid}`);

      res.json({
        success: true,
        message: 'OTP sent successfully',
        messageSid: message.sid
      });

    } catch (twilioError) {
      console.error('❌ Twilio error:', twilioError);

      // For development, still allow login even if SMS fails
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 Development mode: Allowing login without SMS');
        res.json({
          success: true,
          message: 'OTP sent successfully (dev mode)',
          devMode: true
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again.'
        });
      }
    }

  } catch (err) {
    console.error('❌ Send OTP error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.'
    });
  }
});

// Verify OTP - Enhanced Implementation
router.post('/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Input validation
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be 6 digits'
      });
    }

    // Check if OTP exists
    const storedOtp = otpStore[phone];
    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found. Please request a new OTP.'
      });
    }

    // Check expiration
    if (Date.now() > storedOtp.expires) {
      delete otpStore[phone];
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.'
      });
    }

    // Check attempt limit (prevent brute force)
    if (storedOtp.attempts >= 3) {
      delete otpStore[phone];
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.'
      });
    }

    // Verify OTP
    if (storedOtp.otp === otp) {
      // Clean up OTP store
      delete otpStore[phone];

      // Create user object with additional info
      const user = {
        phone,
        loginTime: new Date().toISOString(),
        verified: true
      };

      // Generate JWT token with extended expiry
      const token = jwt.sign(
        {
          phone,
          verified: true,
          loginTime: user.loginTime
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Extended to 24 hours
      );

      console.log(`✅ User ${phone} logged in successfully`);

      return res.json({
        success: true,
        message: 'Login successful! Welcome to Trade Finder.',
        token,
        user
      });
    } else {
      // Increment failed attempts
      storedOtp.attempts = (storedOtp.attempts || 0) + 1;

      const remainingAttempts = 3 - storedOtp.attempts;

      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining.`
      });
    }

  } catch (err) {
    console.error('❌ OTP verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during verification. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
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

// Add temporary open route
router.get('/status', (req, res) => {
  res.json({ status: 'Auth disabled' });
});

export default router;
