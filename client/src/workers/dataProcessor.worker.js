self.addEventListener('message', (event) => {
  const { data, type } = event.data;
  
  if (type === 'processMarketData') {
    const processed = processMarketData(data);
    self.postMessage({ type: 'marketDataProcessed', data: processed });
  }
});

function processMarketData(rawData) {
  const startTime = performance.now();
  
  // Efficient data processing
  const processed = {};
  const symbols = Object.keys(rawData);
  
  for (let i = 0; i < symbols.length; i++) {
    const symbol = symbols[i];
    const stock = rawData[symbol];
    
    processed[symbol] = {
      price: stock.price,
      change: stock.change,
      changePercent: stock.changePercent,
      volume: stock.volume,
      status: stock.change >= 0 ? 'up' : 'down',
      volatility: calculateVolatility(stock)
    };
  }
  
  const endTime = performance.now();
  console.log(`Data processed in ${(endTime - startTime).toFixed(2)}ms`);
  
  return processed;
}

function calculateVolatility(stock) {
  // Simplified volatility calculation
  return Math.abs(stock.change) / stock.price * 100;
} 