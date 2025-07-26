const KiteConnect = require('kiteconnect').KiteConnect;
const User = require('../models/User');
const { sendOTP } = require('./authController');

const apiKey = process.env.ZERODHA_API_KEY;
const apiSecret = process.env.ZERODHA_API_SECRET;

const kc = new KiteConnect({
  api_key: apiKey
});

// Initiate Kite login
exports.initiateKiteLogin = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate login URL
    const loginUrl = kc.getLoginURL();
    
    // Save request token to user for later verification
    user.zerodhaLoginState = { status: 'pending', timestamp: new Date() };
    await user.save();
    
    res.json({ loginUrl });
  } catch (error) {
    console.error('Kite login initiation error:', error);
    res.status(500).json({ error: 'Failed to initiate Kite login' });
  }
};

// Handle Kite callback and request token
exports.handleKiteCallback = async (req, res) => {
  try {
    const { request_token, state: userId } = req.query;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate session with request token
    const session = await kc.generateSession(request_token, apiSecret);
    
    // Save access token to user
    user.zerodhaAccess = {
      accessToken: session.access_token,
      publicToken: session.public_token,
      refreshToken: session.refresh_token,
      userId: session.user_id,
      lastUpdated: new Date()
    };
    
    user.zerodhaLoginState = { status: 'completed' };
    await user.save();
    
    // Send OTP to user's registered mobile for verification
    await sendOTP(user.phone);
    
    res.redirect(`${process.env.CLIENT_URL}/verify-kite-otp?userId=${userId}`);
  } catch (error) {
    console.error('Kite callback error:', error);
    res.status(500).json({ error: 'Failed to process Kite login' });
  }
};

// Verify OTP and complete Kite login
exports.verifyKiteOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Verify OTP (using the same logic as authController)
    if (!user.otp || user.otp !== otp || Date.now() > user.otpExpiry) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Zerodha Kite connected successfully',
      kiteAccess: user.zerodhaAccess
    });
  } catch (error) {
    console.error('Kite OTP verification error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};

// Refresh Kite access token
exports.refreshKiteToken = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    
    if (!user || !user.zerodhaAccess || !user.zerodhaAccess.refreshToken) {
      return res.status(400).json({ error: 'Invalid Kite session' });
    }
    
    const newSession = await kc.renewAccessToken(
      user.zerodhaAccess.publicToken,
      user.zerodhaAccess.refreshToken
    );
    
    // Update access token
    user.zerodhaAccess.accessToken = newSession.access_token;
    user.zerodhaAccess.lastUpdated = new Date();
    await user.save();
    
    res.json({ success: true, accessToken: newSession.access_token });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ error: 'Failed to refresh access token' });
  }
}; 