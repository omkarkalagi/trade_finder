const express = require('express');
const router = express.Router();
const { getMarketNews } = require('@services/newsService');

// GET /news - Fetch market news
router.get('/', async (req, res) => {
  try {
    const news = await getMarketNews();
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error: error.message });
  }
});

module.exports = router; 