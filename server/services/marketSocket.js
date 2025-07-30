const Alpaca = require('@alpacahq/alpaca-trade-api');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const config = require('../config/db');

// Create WebSocket connection
const ws = new WebSocket(config.ALPACA_WS_URL);

// Authentication message
ws.on('open', () => {
  ws.send(JSON.stringify({
    action: 'authenticate',
    data: {
      key_id: config.ALPACA_API_KEY,
      secret_key: config.ALPACA_API_SECRET
    }
  }));

  // Subscribe to market data after authentication
  ws.send(JSON.stringify({
    action: 'listen',
    data: {
      streams: ['trade_updates', 'account_updates', 'T.*', 'Q.*', 'AM.*']
    }
  }));
});

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
