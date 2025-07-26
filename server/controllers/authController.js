const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const twilio = require('twilio');
const cors = require('cors');
const User = require('../models/User');

// Generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

// Store OTPs with expiration
const otpStore = {};

// Check for required Twilio environment variables
if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error('Twilio credentials are missing! Using mock mode.');
}

// Initialize Twilio client if credentials are available, otherwise use a mock
let twilioClient;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} else {
  console.warn('Twilio credentials missing. Using mock SMS service');
  twilioClient = {
    messages: {
      create: async (message) => {
        console.log('Mock SMS sent:', message);
        return { sid: 'SM_mock' };
      }
    }
  };
}

// Register with email/password
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verified: true
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login with email/password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Return user data and token
    res.json({ 
      success: true, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email 
      }, 
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Send OTP (add expiration)
exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    console.log('Received OTP request for:', phoneNumber);
    
    // Validate phone number format
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      console.error('Invalid phone format:', phoneNumber);
      return res.status(400).json({ error: 'Phone number must include country code (e.g., +91...)' });
    }

    const otp = generateOTP();
    // Store OTP with expiration (5 minutes)
    otpStore[phoneNumber] = {
      otp: otp.toString(),
      expiresAt: Date.now() + 300000 // 5 minutes
    };
    
    console.log(`Sending OTP ${otp} to ${phoneNumber} via Twilio`);
    
    const message = await twilioClient.messages.create({
      body: `Your Trade Finder OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    
    console.log('Twilio message SID:', message.sid);
    console.log('Message details:', {
      status: message.status,
      price: message.price,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Full Twilio error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      moreInfo: error.moreInfo
    });
    res.status(500).json({ 
      error: 'Failed to send OTP',
      details: error.message 
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    // Check if OTP exists for this phone
    if (!otpStore[phone] || !otpStore[phone].otp) {
      return res.status(400).json({ error: 'OTP expired or not sent' });
    }
    
    // Check expiration
    if (otpStore[phone].expiresAt < Date.now()) {
      delete otpStore[phone];
      return res.status(400).json({ error: 'OTP expired' });
    }
    
    // Compare OTPs
    if (otpStore[phone].otp.toString() !== otp.toString()) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
    
    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({ 
        phone, 
        verified: true,
        name: "User", // Default name
        email: `${phone}@trade-finder.com` // Default email
      });
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Clear OTP
    delete otpStore[phone];
    
    res.json({ 
      success: true, 
      user: { 
        id: user._id, 
        phone: user.phone,
        name: user.name,
        email: user.email
      }, 
      token 
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
}; 

// Add this new method
exports.verifyToken = async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user without password field
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Token verification error:', error);
    
    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
}; 