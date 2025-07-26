const express = require('express');
const router = express.Router();
const { generateTradingStrategies } = require('../services/algoService');

router.post('/strategies', async (req, res) => {
  try {
    const { budget } = req.body;
    const strategies = await generateTradingStrategies(budget);
    res.json(strategies);
  } catch (error) {
    console.error('Error generating trading strategies:', error);
    res.status(500).json({ error: 'Failed to generate trading strategies' });
  }
});

module.exports = router; 