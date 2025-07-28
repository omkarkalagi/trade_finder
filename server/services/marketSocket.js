const Alpaca = require('@alpacahq/alpaca-trade-api');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const alpaca = new Alpaca({
  keyId: process.env.ALPACA_API_KEY,
  secretKey: process.env.ALPACA_API_SECRET,
  paper: true,
  baseUrl: process.env.ALPACA_BASE_URL
});

// Initialize WebSocket server
const wss = new WebSocket.Server({ port: 8081 });

// Connect to Alpaca streaming
const alpacaStream = alpaca.data_ws;

alpacaStream.onConnect(() => {
  console.log('Connected to Alpaca stream');
  alpacaStream.subscribe(['trade_updates', 'AM.*']); // Subscribe to all stocks
});

alpacaStream.onStockTrade((trade) => {
  // Broadcast to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        symbol: trade.S,
        price: trade.p,
        timestamp: trade.t
      }));
    }
  });
});

alpacaStream.connect();

const verifyToken = (token) => {
  if (!token) return false;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return !!decoded.userId;
  } catch (error) {
    return false;
  }
};

module.exports = {
  verifyToken,
};

wss.on('connection', (ws, req) => {
  // Get token from query parameters
  const token = new URL(req.url, 'http://localhost').searchParams.get('token');

  if (!verifyToken(token)) {
    console.log('WebSocket connection rejected: Invalid token');
    return ws.close(1008, 'Unauthorized');
  }

  // Successful connection
  ws.on('error', console.error);
});
