// Alpaca API Configuration
export const ALPACA_CONFIG = {
  endpoint: 'https://paper-api.alpaca.markets/v2',
  key: import.meta.env.VITE_ALPACA_API_KEY || 'PK2LGOIJ1F1V9RQ0UPU5',
  secret: import.meta.env.VITE_ALPACA_API_SECRET || 'lOdhyveIeUkBrO6OPRb38M7XwqxkG4WRLzQsEuIt',
  dataEndpoint: 'https://data.alpaca.markets/v2',
  wsEndpoint: 'wss://stream.data.alpaca.markets/v2/iex'
};

// Real-time market data symbols for Indian market equivalent US stocks
export const MARKET_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM', 'V', 'DIS',
  'NFLX', 'PYPL', 'ADBE', 'CRM', 'INTC', 'AMD', 'ORCL', 'IBM', 'CSCO', 'BA'
];

// Market status helper
export const isMarketOpen = () => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hours * 60 + minutes;

  // US Market hours: 9:30 AM to 4:00 PM EST (Monday to Friday)
  const marketOpen = 9 * 60 + 30; // 9:30 AM
  const marketClose = 16 * 60; // 4:00 PM

  return day >= 1 && day <= 5 && currentTime >= marketOpen && currentTime <= marketClose;
};
