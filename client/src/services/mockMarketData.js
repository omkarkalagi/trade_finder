// Mock market data service
const generateRandomPrice = (base) => {
  const change = (Math.random() - 0.5) * 5;
  return base + change;
};

const stockBasePrices = {
  AAPL: 180.25,
  MSFT: 410.75,
  GOOGL: 175.50,
  AMZN: 185.30,
  TSLA: 245.60,
  NVDA: 950.20,
  META: 485.75,
  NFLX: 630.40,
  PYPL: 65.30,
  INTC: 35.45,
};

export const getMockMarketData = () => {
  const mockData = {};

  Object.entries(stockBasePrices).forEach(([symbol, basePrice]) => {
    mockData[symbol] = {
      price: generateRandomPrice(basePrice),
      size: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString(),
      change: (Math.random() - 0.5) * 5,
      percentChange: (Math.random() - 0.5) * 3,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    };
  });

  return mockData;
};

export const getHistoricalData = (symbol, days = 30) => {
  const basePrice = stockBasePrices[symbol] || 100;
  const data = [];

  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Generate a somewhat realistic price movement
    const volatility = 0.02; // 2% daily volatility
    const change = basePrice * volatility * (Math.random() - 0.5);
    const previousPrice = i < days ? data[days - i - 1].price : basePrice;
    const price = previousPrice + change;

    data.push({
      date: date.toISOString().split('T')[0],
      price: price,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }

  return data;
};

export const getTopGainers = () => {
  return [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 950.20, change: 25.30, percentChange: 2.73 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 165.75, change: 4.25, percentChange: 2.63 },
    { symbol: 'ORCL', name: 'Oracle Corporation', price: 125.40, change: 2.80, percentChange: 2.28 },
    { symbol: 'CRM', name: 'Salesforce Inc', price: 285.60, change: 5.40, percentChange: 1.93 },
    { symbol: 'ADBE', name: 'Adobe Inc', price: 510.30, change: 8.75, percentChange: 1.74 }
  ];
};

export const getTopLosers = () => {
  return [
    { symbol: 'INTC', name: 'Intel Corporation', price: 35.45, change: -1.20, percentChange: -3.27 },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc', price: 65.30, change: -1.85, percentChange: -2.75 },
    { symbol: 'CSCO', name: 'Cisco Systems Inc', price: 48.75, change: -1.25, percentChange: -2.50 },
    { symbol: 'IBM', name: 'IBM Corporation', price: 175.40, change: -3.60, percentChange: -2.01 },
    { symbol: 'NFLX', name: 'Netflix Inc', price: 630.40, change: -10.50, percentChange: -1.64 }
  ];
};
