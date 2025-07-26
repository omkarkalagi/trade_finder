const express = require('express');
const router = express.Router();
const { getKiteLoginURL, getKiteAccessToken } = require('@services/kiteService');

// GET /kite/login - Get Zerodha Kite login URL
router.get('/login', (req, res) => {
  const loginUrl = getKiteLoginURL();
  res.json({ loginUrl });
});

// GET /kite/callback - Handle Kite OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { request_token } = req.query;
    const accessToken = await getKiteAccessToken(request_token);
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get access token', error: error.message });
  }
});

module.exports = router; 