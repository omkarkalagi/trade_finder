const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// Mock market data generator
function generateMarketData() {
  const symbols = ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TATASTEEL', 'HDFCBANK', 'INFY'];
  return symbols.map(symbol => ({
    symbol,
    price: (Math.random() * 1000 + 1000).toFixed(2),
    change: (Math.random() * 10 - 5).toFixed(2),
    changePercent: (Math.random() * 2 - 1).toFixed(2)
  }));
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  // Send market data every second
  const interval = setInterval(() => {
    const marketData = generateMarketData();
    ws.send(JSON.stringify(marketData));
  }, 1000);
  
  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

console.log('WebSocket server running on port 8080'); 