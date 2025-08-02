// Mock market data service
const generateRandomPrice = (base) => {
  const change = (Math.random() - 0.5) * 5;
  return base + change;
};

// US Market Stocks
const usStockBasePrices = {
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

// Indian Market Stocks (NSE)
const indianStockBasePrices = {
  RELIANCE: 2950.75,
  TCS: 3840.60,
  HDFCBANK: 1680.25,
  INFY: 1520.40,
  ICICIBANK: 1050.30,
  HINDUNILVR: 2580.45,
  SBIN: 745.20,
  BHARTIARTL: 1180.35,
  BAJFINANCE: 7240.50,
  ADANIENT: 2860.75,
  TATAMOTORS: 920.40,
  WIPRO: 450.25,
  ASIANPAINT: 3120.60,
  AXISBANK: 1040.30,
  MARUTI: 10450.75,
};

export const getMockMarketData = (market = 'us') => {
  const mockData = {};
  const stockPrices = market === 'indian' ? indianStockBasePrices : usStockBasePrices;

  Object.entries(stockPrices).forEach(([symbol, basePrice]) => {
    // Generate more realistic changes
    const change = (Math.random() - 0.5) * (basePrice * 0.03); // 3% max change
    const newPrice = basePrice + change;
    const percentChange = (change / basePrice) * 100;

    mockData[symbol] = {
      price: newPrice,
      size: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString(),
      change: change,
      percentChange: percentChange,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      dayHigh: newPrice + (Math.random() * basePrice * 0.01),
      dayLow: newPrice - (Math.random() * basePrice * 0.01),
      open: basePrice - (Math.random() * basePrice * 0.01),
      prevClose: basePrice,
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

export const getTopGainers = (market = 'us') => {
  if (market === 'indian') {
    return [
      { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 920.40, change: 32.15, percentChange: 3.62 },
      { symbol: 'SBIN', name: 'State Bank of India', price: 745.20, change: 22.80, percentChange: 3.16 },
      { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', price: 2950.75, change: 85.30, percentChange: 2.98 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1680.25, change: 42.60, percentChange: 2.60 },
      { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', price: 1180.35, change: 28.75, percentChange: 2.49 }
    ];
  } else {
    return [
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 950.20, change: 25.30, percentChange: 2.73 },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 165.75, change: 4.25, percentChange: 2.63 },
      { symbol: 'ORCL', name: 'Oracle Corporation', price: 125.40, change: 2.80, percentChange: 2.28 },
      { symbol: 'CRM', name: 'Salesforce Inc', price: 285.60, change: 5.40, percentChange: 1.93 },
      { symbol: 'ADBE', name: 'Adobe Inc', price: 510.30, change: 8.75, percentChange: 1.74 }
    ];
  }
};

export const getTopLosers = (market = 'us') => {
  if (market === 'indian') {
    return [
      { symbol: 'WIPRO', name: 'Wipro Ltd', price: 450.25, change: -18.75, percentChange: -4.00 },
      { symbol: 'INFY', name: 'Infosys Ltd', price: 1520.40, change: -45.60, percentChange: -2.91 },
      { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', price: 3840.60, change: -95.20, percentChange: -2.42 },
      { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', price: 3120.60, change: -68.40, percentChange: -2.15 },
      { symbol: 'AXISBANK', name: 'Axis Bank Ltd', price: 1040.30, change: -18.75, percentChange: -1.77 }
    ];
  } else {
    return [
      { symbol: 'INTC', name: 'Intel Corporation', price: 35.45, change: -1.20, percentChange: -3.27 },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc', price: 65.30, change: -1.85, percentChange: -2.75 },
      { symbol: 'CSCO', name: 'Cisco Systems Inc', price: 48.75, change: -1.25, percentChange: -2.50 },
      { symbol: 'IBM', name: 'IBM Corporation', price: 175.40, change: -3.60, percentChange: -2.01 },
      { symbol: 'NFLX', name: 'Netflix Inc', price: 630.40, change: -10.50, percentChange: -1.64 }
    ];
  }
};
