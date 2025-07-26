const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const NodeCache = require('node-cache');
const marketCache = new NodeCache({ stdTTL: 60 }); // Cache for 60 seconds

// Optimized market data endpoint
router.get('/data', async (req, res) => {
  try {
    const cacheKey = 'market-data';
    const cachedData = marketCache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }
    
    // Efficient query with projection
    const stocks = await Stock.find({}, 'symbol price change changePercent volume -_id')
      .sort({ volume: -1 })
      .limit(100)
      .lean();
    
    // Transform data for efficient client-side processing
    const marketData = {};
    stocks.forEach(stock => {
      marketData[stock.symbol] = {
        price: stock.price,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume
      };
    });
    
    marketCache.set(cacheKey, marketData);
    res.json(marketData);
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

module.exports = router; 