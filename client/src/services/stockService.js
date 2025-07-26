// Mock market data
const mockStocks = {
  'NIFTY': { symbol: 'NIFTY', name: 'Nifty 50', price: 19542.35, change: 125.50, changePercent: 0.65 },
  'RELIANCE': { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2568.90, change: 12.75, changePercent: 0.50 },
  'TCS': { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3456.25, change: -15.30, changePercent: -0.44 },
  'HDFCBANK': { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1645.60, change: 8.90, changePercent: 0.54 },
  'INFY': { symbol: 'INFY', name: 'Infosys', price: 1420.75, change: -5.25, changePercent: -0.37 },
  'ICICIBANK': { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 985.30, change: 6.45, changePercent: 0.66 }
};

// Mock portfolio data
const mockPortfolio = [
  { symbol: 'RELIANCE', quantity: 10, avgPrice: 2400, currentPrice: 2568.90 },
  { symbol: 'TCS', quantity: 5, avgPrice: 3200, currentPrice: 3456.25 },
  { symbol: 'HDFCBANK', quantity: 8, avgPrice: 1500, currentPrice: 1645.60 }
];

// Mock insights
const mockInsights = [
  { symbol: 'RELIANCE', recommendation: 'BUY', targetPrice: 2650, confidence: 0.85 },
  { symbol: 'TCS', recommendation: 'HOLD', targetPrice: 3500, confidence: 0.70 },
  { symbol: 'INFY', recommendation: 'SELL', targetPrice: 1350, confidence: 0.65 }
];

// Mock activities
const mockActivities = [
  { action: 'BUY', symbol: 'RELIANCE', quantity: 5, price: 2550, time: '10:30 AM' },
  { action: 'SELL', symbol: 'TCS', quantity: 2, price: 3440, time: '11:15 AM' },
  { action: 'BUY', symbol: 'HDFCBANK', quantity: 3, price: 1630, time: '01:45 PM' }
];

// Fetch market data
export const fetchMarketData = async (symbols = ['NIFTY', 'RELIANCE', 'TCS', 'HDFCBANK']) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = symbols.map(symbol => {
        const stock = mockStocks[symbol] || mockStocks['NIFTY'];
        // Add small random fluctuation
        const fluctuation = (Math.random() - 0.5) * 10;
        return {
          ...stock,
          price: parseFloat((stock.price + fluctuation).toFixed(2)),
          change: parseFloat((stock.change + fluctuation * 0.1).toFixed(2))
        };
      });
      resolve(data);
    }, 500);
  });
};

// Fetch portfolio
export const fetchPortfolio = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPortfolio);
    }, 500);
  });
};

// Get recommendations
export const getRecommendations = async (symbol) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockInsights);
    }, 500);
  });
};

// Fetch activities
export const fetchActivities = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivities);
    }, 500);
  });
}; 