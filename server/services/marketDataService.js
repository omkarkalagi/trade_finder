const WebSocket = require('ws');
const Alpaca = require('@alpacahq/alpaca-trade-api');
const { createClient } = require('redis');

// Initialize services
const redisClient = createClient();
const ALPACA_API_KEY = process.env.ALPACA_API_KEY || 'PKXPAVGS6AX2HLSJNICR';
const ALPACA_API_SECRET = process.env.ALPACA_API_SECRET || 'HhaZ17k2hRKT7lmacu07QboTzzULp0WKZECeNSDa';

const alpaca = new Alpaca({
  keyId: ALPACA_API_KEY,
  secretKey: ALPACA_API_SECRET,
  paper: true,
  usePolygon: false,
  baseUrl: process.env.ALPACA_BASE_URL
});

// Connect to Redis
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.connect();

// WebSocket server for dashboard clients
const wss = new WebSocket.Server({ port: 8080 });

// Market data processing
const processMarketData = (data) => {
  // Add technical indicators
  data.rsi = calculateRSI(data.historical);
  data.macd = calculateMACD(data.historical);
  return data;
};

// Main market data handler
alpaca.data_ws.onConnect(() => {
  console.log('Alpaca market data connected');
  alpaca.data_ws.subscribeForQuotes(['AAPL', 'MSFT', 'TSLA', 'GOOG', 'AMZN']);
  alpaca.data_ws.subscribeForTrades(['*']);
});

alpaca.data_ws.onStockTrade((trade) => {
  const processed = processMarketData(trade);

  // Store in Redis
  redisClient.hSet('market:latest', trade.S, JSON.stringify(processed));

  // Broadcast to dashboard clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'trade',
        symbol: trade.S,
        price: trade.p,
        size: trade.s,
        timestamp: trade.t
      }));
    }
  });
});

// Trading bot integration
wss.on('connection', (ws) => {
  console.log('New dashboard client connected');

  ws.on('message', (message) => {
    const { type, symbol, action } = JSON.parse(message);

    if (type === 'execute-trade') {
      executeTrade(symbol, action);
    }
  });

  // Send initial market state
  redisClient.hGetAll('market:latest', (err, data) => {
    if (!err) {
      ws.send(JSON.stringify({
        type: 'snapshot',
        data: Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, JSON.parse(v)])
        )
      }));
    }
  });
});

module.exports = wss;
