const express = require('express');
const router = express.Router();
const { startAutoTrading, stopAutoTrading } = require('@services/autoTradingService');

// POST /auto-trading/start - Start auto trading
router.post('/start', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const result = await startAutoTrading(userId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error starting auto trading', error: error.message });
  }
});

// POST /auto-trading/stop - Stop auto trading
router.post('/stop', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await stopAutoTrading(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error stopping auto trading', error: error.message });
  }
});

module.exports = router; 