const KiteConnect = require('kiteconnect').KiteConnect;
const WebSocket = require('ws');
const Stock = require('../models/Stock');

const apiKey = process.env.ZERODHA_API_KEY;
const apiSecret = process.env.ZERODHA_API_SECRET;

let kite = null;
let ws = null;

// Initialize WebSocket connection
exports.initMarketDataStream = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.zerodhaAccess) {
      throw new Error('User or Kite connection not found');
    }
    
    kite = new KiteConnect({
      api_key: apiKey,
      access_token: user.zerodhaAccess.accessToken
    });
    
    // Get WebSocket URL
    const wsUrl = kite.getWSURL();
    
    // Connect to WebSocket
    ws = new WebSocket(wsUrl);
    
    ws.on('open', () => {
      console.log('Market data WebSocket connected');
      
      // Subscribe to Nifty 50 and top 20 stocks
      const instruments = [
        256265, // NIFTY 50
        738561, // RELIANCE
        779521, // HDFCBANK
        408065, // INFY
        2953217, // TCS
        3465729, // HINDUNILVR
        897537, // ICICIBANK
        2714625, // KOTAKBANK
        1346049, // AXISBANK
        177665, // SBIN
        140033, // BAJFINANCE
        4267265, // BHARTIARTL
        424961, // LT
        2939649, // MARUTI
        2815745, // ASIANPAINT
        633601, // HCLTECH
        1850625, // WIPRO
        3431425, // ONGC
        2977281, // NTPC
        225537, // ITC
        108033, // SUNPHARMA
      ];
      
      ws.send(JSON.stringify({
        "a": "subscribe",
        "v": instruments
      }));
    });
    
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      
      // Process ticks
      if (message.t) {
        message.t.forEach(tick => {
          // Update stock prices in database
          Stock.updateOne(
            { instrument_token: tick.i },
            { 
              last_price: tick.lp,
              volume: tick.v,
              ohlc: {
                open: tick.oi,
                high: tick.h,
                low: tick.l,
                close: tick.c
              }
            },
            { upsert: true }
          ).exec();
        });
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    ws.on('close', () => {
      console.log('Market data WebSocket disconnected');
    });
    
  } catch (error) {
    console.error('Market data initialization error:', error);
  }
};

// Get real-time data for dashboard
exports.getRealtimeData = async () => {
  const stocks = await Stock.find().limit(20);
  return stocks.map(stock => ({
    symbol: stock.symbol,
    price: stock.last_price,
    change: stock.last_price - stock.ohlc.open,
    changePercent: ((stock.last_price - stock.ohlc.open) / stock.ohlc.open) * 100
  }));
}; 