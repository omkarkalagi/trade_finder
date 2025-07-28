const Alpaca = require('@alpacahq/alpaca-trade-api');
const WebSocket = require('ws');

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

module.exports = wss;
