const axios = require('axios');
const { KiteConnect } = require('kiteconnect');

const API_KEY = process.env.ZERODHA_API_KEY;
const API_SECRET = process.env.ZERODHA_API_SECRET;

const kc = new KiteConnect({
  api_key: API_KEY
});

// Get market data
exports.getMarketData = async (accessToken) => {
  try {
    kc.setAccessToken(accessToken);
    
    // Get Nifty 50 data
    const nifty50 = await kc.getQuote(['NSE:NIFTY 50']);
    
    // Get top gainers
    const gainers = await kc.getGTTs();
    
    // Get user portfolio
    const portfolio = await kc.getHoldings();
    
    return {
      nifty50,
      gainers,
      portfolio
    };
  } catch (error) {
    console.error('Market data error:', error);
    throw new Error('Failed to fetch market data');
  }
}; 