import express from 'express';
import fetch from 'node-fetch';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for API calls
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many API requests, please try again later.'
});

router.use(apiLimiter);

// Mock data for development/fallback
const mockMarketData = {
  indices: [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 427.83, change: 5.32, changePercent: 1.26, volume: 45200000 },
    { symbol: 'QQQ', name: 'NASDAQ 100 ETF', price: 367.45, change: 8.12, changePercent: 2.26, volume: 32100000 },
    { symbol: 'DIA', name: 'Dow Jones ETF', price: 337.21, change: -1.45, changePercent: -0.43, volume: 28900000 }
  ],
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, change: 2.15, changePercent: 1.22, volume: 52400000 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 345.60, change: 4.80, changePercent: 1.41, volume: 28300000 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 145.20, change: 2.70, changePercent: 1.89, volume: 24100000 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 205.80, change: -4.60, changePercent: -2.19, volume: 89200000 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 545.30, change: 24.55, changePercent: 4.71, volume: 45800000 }
  ]
};

// Get market overview data
router.get('/overview', async (req, res) => {
  try {
    // In a real implementation, this would fetch from Alpaca or other market data providers
    const marketData = {
      ...mockMarketData,
      timestamp: new Date().toISOString(),
      marketStatus: getMarketStatus(),
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: marketData
    });
  } catch (error) {
    console.error('Error fetching market overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market overview'
    });
  }
});

// Get specific stock quote
router.get('/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    // Try to fetch real data first, fallback to mock
    let stockData = mockMarketData.stocks.find(s => s.symbol === symbol.toUpperCase());
    
    if (!stockData) {
      // Generate mock data for unknown symbols
      stockData = {
        symbol: symbol.toUpperCase(),
        name: `${symbol.toUpperCase()} Corporation`,
        price: Math.random() * 200 + 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: Math.floor(Math.random() * 50000000) + 1000000,
        timestamp: new Date().toISOString()
      };
    }

    res.json({
      success: true,
      data: stockData
    });
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stock quote'
    });
  }
});

// Get market status
router.get('/status', async (req, res) => {
  try {
    const status = getMarketStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error fetching market status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market status'
    });
  }
});

// Get market news
router.get('/news', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Mock news data - in production, integrate with news API
    const mockNews = [
      {
        id: 1,
        title: "Federal Reserve Announces Interest Rate Decision",
        summary: "Fed maintains current rates amid inflation concerns and economic uncertainty",
        source: "Reuters",
        publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        url: "#",
        sentiment: "neutral",
        relevantSymbols: ["SPY", "QQQ"]
      },
      {
        id: 2,
        title: "Tech Stocks Rally on Strong Earnings",
        summary: "Major tech companies report better-than-expected quarterly results",
        source: "Bloomberg",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        url: "#",
        sentiment: "positive",
        relevantSymbols: ["AAPL", "MSFT", "GOOGL"]
      },
      {
        id: 3,
        title: "Oil Prices Surge on Supply Concerns",
        summary: "Crude oil futures jump 3% following geopolitical tensions",
        source: "MarketWatch",
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        url: "#",
        sentiment: "neutral",
        relevantSymbols: ["XLE", "USO"]
      }
    ];

    res.json({
      success: true,
      data: mockNews.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching market news:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch market news'
    });
  }
});

// Get sector performance
router.get('/sectors', async (req, res) => {
  try {
    const sectors = [
      { name: 'Technology', symbol: 'XLK', change: 2.15, volume: '45.2M', marketCap: '2.8T' },
      { name: 'Healthcare', symbol: 'XLV', change: 1.85, volume: '32.1M', marketCap: '1.9T' },
      { name: 'Financials', symbol: 'XLF', change: 1.25, volume: '28.9M', marketCap: '1.2T' },
      { name: 'Consumer Discretionary', symbol: 'XLY', change: 0.95, volume: '21.4M', marketCap: '1.1T' },
      { name: 'Industrials', symbol: 'XLI', change: 0.75, volume: '19.8M', marketCap: '980B' },
      { name: 'Energy', symbol: 'XLE', change: -0.45, volume: '25.6M', marketCap: '890B' },
      { name: 'Utilities', symbol: 'XLU', change: -0.85, volume: '15.2M', marketCap: '750B' },
      { name: 'Real Estate', symbol: 'XLRE', change: -1.25, volume: '12.8M', marketCap: '620B' }
    ];

    res.json({
      success: true,
      data: sectors
    });
  } catch (error) {
    console.error('Error fetching sector data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sector data'
    });
  }
});

// Get trending stocks
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const trending = [
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 545.30, changePercent: 4.71, volume: 45800000, reason: 'AI Earnings Beat' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 205.80, changePercent: -2.19, volume: 89200000, reason: 'Production Update' },
      { symbol: 'AAPL', name: 'Apple Inc.', price: 178.25, changePercent: 1.22, volume: 52400000, reason: 'iPhone Sales' },
      { symbol: 'META', name: 'Meta Platforms', price: 325.80, changePercent: 3.45, volume: 28900000, reason: 'VR Investment' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 142.35, changePercent: 2.18, volume: 34500000, reason: 'AWS Growth' }
    ];

    res.json({
      success: true,
      data: trending.slice(0, parseInt(limit))
    });
  } catch (error) {
    console.error('Error fetching trending stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending stocks'
    });
  }
});

// Search stocks
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Mock search results - in production, use a proper search API
    const allStocks = [
      ...mockMarketData.stocks,
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 325.80, changePercent: 3.45 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 142.35, changePercent: 2.18 },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 485.70, changePercent: 1.85 },
      { symbol: 'GOOG', name: 'Alphabet Inc. Class C', price: 144.85, changePercent: 1.92 }
    ];

    const results = allStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search stocks'
    });
  }
});

// Get historical data for a stock
router.get('/history/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { period = '1M', interval = '1D' } = req.query;

    // Generate mock historical data
    const endDate = new Date();
    const dataPoints = period === '1D' ? 24 : period === '1W' ? 7 : period === '1M' ? 30 : 365;
    const intervalMs = period === '1D' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

    const basePrice = 150 + Math.random() * 100;
    const historicalData = [];

    for (let i = dataPoints; i >= 0; i--) {
      const timestamp = new Date(endDate.getTime() - (i * intervalMs));
      const price = basePrice + (Math.random() - 0.5) * 20;
      
      historicalData.push({
        timestamp: timestamp.toISOString(),
        open: price + (Math.random() - 0.5) * 2,
        high: price + Math.random() * 3,
        low: price - Math.random() * 3,
        close: price,
        volume: Math.floor(Math.random() * 10000000) + 1000000
      });
    }

    res.json({
      success: true,
      data: {
        symbol: symbol.toUpperCase(),
        period,
        interval,
        data: historicalData
      }
    });
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical data'
    });
  }
});

// Helper function to determine market status
function getMarketStatus() {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Market is closed on weekends
  if (currentDay === 0 || currentDay === 6) {
    return {
      isOpen: false,
      status: 'closed',
      message: 'Market is closed - Weekend',
      nextOpen: getNextMarketOpen(now),
      timezone: 'EST'
    };
  }
  
  // Market hours: 9:30 AM - 4:00 PM EST (14:30 - 21:00 UTC during standard time)
  if (currentHour >= 9.5 && currentHour < 16) {
    return {
      isOpen: true,
      status: 'open',
      message: 'Market is open',
      nextClose: getTodayMarketClose(),
      timezone: 'EST'
    };
  } else if (currentHour >= 4 && currentHour < 9.5) {
    return {
      isOpen: false,
      status: 'pre-market',
      message: 'Pre-market trading',
      nextOpen: getTodayMarketOpen(),
      timezone: 'EST'
    };
  } else {
    return {
      isOpen: false,
      status: 'after-hours',
      message: 'After-hours trading',
      nextOpen: getNextMarketOpen(now),
      timezone: 'EST'
    };
  }
}

function getTodayMarketOpen() {
  const today = new Date();
  today.setHours(9, 30, 0, 0);
  return today.toISOString();
}

function getTodayMarketClose() {
  const today = new Date();
  today.setHours(16, 0, 0, 0);
  return today.toISOString();
}

function getNextMarketOpen(currentDate) {
  const nextOpen = new Date(currentDate);
  nextOpen.setHours(9, 30, 0, 0);
  
  // If it's weekend or after market hours, move to next weekday
  if (nextOpen.getDay() === 0) { // Sunday
    nextOpen.setDate(nextOpen.getDate() + 1);
  } else if (nextOpen.getDay() === 6) { // Saturday
    nextOpen.setDate(nextOpen.getDate() + 2);
  } else if (nextOpen <= currentDate) {
    // Move to next day
    nextOpen.setDate(nextOpen.getDate() + 1);
    if (nextOpen.getDay() === 0) { // If next day is Sunday
      nextOpen.setDate(nextOpen.getDate() + 1);
    } else if (nextOpen.getDay() === 6) { // If next day is Saturday
      nextOpen.setDate(nextOpen.getDate() + 2);
    }
  }
  
  return nextOpen.toISOString();
}

export default router;
