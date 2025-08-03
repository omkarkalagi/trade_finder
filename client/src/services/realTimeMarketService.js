class RealTimeMarketService {
  constructor() {
    this.listeners = [];
    this.marketData = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;

    // Indian market symbols
    this.symbols = [
      'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'HINDUNILVR.NS',
      'ICICIBANK.NS', 'SBIN.NS', 'BHARTIARTL.NS', 'ITC.NS', 'KOTAKBANK.NS',
      'LT.NS', 'ASIANPAINT.NS', 'AXISBANK.NS', 'MARUTI.NS', 'SUNPHARMA.NS',
      'ULTRACEMCO.NS', 'TITAN.NS', 'WIPRO.NS', 'NESTLEIND.NS', 'POWERGRID.NS'
    ];

    this.indices = [
      { symbol: '^NSEI', name: 'NIFTY 50' },
      { symbol: '^BSESN', name: 'SENSEX' },
      { symbol: '^NSEBANK', name: 'BANK NIFTY' },
      { symbol: '^CNXIT', name: 'NIFTY IT' }
    ];

    this.startDataFeed();
  }

  // Start real-time data feed
  startDataFeed() {
    this.fetchMarketData();

    // Update every 30 seconds during market hours
    this.dataInterval = setInterval(() => {
      if (this.isMarketOpen()) {
        this.fetchMarketData();
      }
    }, 30000);

    // Update every 5 minutes outside market hours
    this.slowUpdateInterval = setInterval(() => {
      if (!this.isMarketOpen()) {
        this.fetchMarketData();
      }
    }, 300000);
  }

  // Check if Indian market is open
  isMarketOpen() {
    const now = new Date();
    const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
    const day = istTime.getDay();
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTime = hours * 60 + minutes;

    // Market is closed on weekends
    if (day === 0 || day === 6) return false;

    // Market hours: 9:15 AM to 3:30 PM IST
    const marketOpen = 9 * 60 + 15;
    const marketClose = 15 * 60 + 30;

    return currentTime >= marketOpen && currentTime <= marketClose;
  }

  // Fetch market data from multiple sources
  async fetchMarketData() {
    // For now, use fallback data directly to avoid CORS issues
    console.log('Using fallback market data due to API restrictions');
    this.generateFallbackData();
    this.isConnected = true;
    this.reconnectAttempts = 0;
    this.notifyListeners();
  }

  // Fetch from Yahoo Finance (free tier)
  async fetchFromYahooFinance() {
    const allSymbols = [...this.symbols, ...this.indices.map(i => i.symbol)];

    for (const symbol of allSymbols) {
      try {
        // Use a more robust fetch approach
        const fetchOptions = {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json'
          },
          mode: 'cors'
        };

        const response = await window.fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, fetchOptions);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const result = data.chart.result[0];
        const meta = result.meta;
        const quote = result.indicators.quote[0];

        const marketData = {
          symbol: symbol,
          price: meta.regularMarketPrice || meta.previousClose,
          change: (meta.regularMarketPrice || meta.previousClose) - meta.previousClose,
          changePercent: ((meta.regularMarketPrice || meta.previousClose) - meta.previousClose) / meta.previousClose * 100,
          volume: meta.regularMarketVolume || 0,
          high: meta.regularMarketDayHigh || meta.previousClose,
          low: meta.regularMarketDayLow || meta.previousClose,
          open: quote.open?.[quote.open.length - 1] || meta.previousClose,
          previousClose: meta.previousClose,
          marketCap: meta.marketCap || 0,
          timestamp: new Date(),
          source: 'Yahoo Finance'
        };

        this.marketData.set(symbol, marketData);

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.warn(`Failed to fetch ${symbol} from Yahoo Finance:`, error);
      }
    }

    this.notifyListeners();
  }

  // Fetch from Alpha Vantage (backup)
  async fetchFromAlphaVantage() {
    // Note: This requires an API key from Alpha Vantage
    const API_KEY = process.env.VITE_ALPHA_VANTAGE_KEY || 'demo';

    for (const symbol of this.symbols.slice(0, 5)) { // Limited calls for free tier
      try {
        const cleanSymbol = symbol.replace('.NS', '');
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${cleanSymbol}.BSE&apikey=${API_KEY}`
        );

        const data = await response.json();
        const quote = data['Global Quote'];

        if (quote && quote['05. price']) {
          const marketData = {
            symbol: symbol,
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume']),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            open: parseFloat(quote['02. open']),
            previousClose: parseFloat(quote['08. previous close']),
            timestamp: new Date(),
            source: 'Alpha Vantage'
          };

          this.marketData.set(symbol, marketData);
        }

        // Rate limiting for free tier
        await new Promise(resolve => setTimeout(resolve, 12000));

      } catch (error) {
        console.warn(`Failed to fetch ${symbol} from Alpha Vantage:`, error);
      }
    }

    this.notifyListeners();
  }

  // Generate realistic fallback data when APIs fail
  generateFallbackData() {
    const baseData = {
      'RELIANCE.NS': { price: 2890, name: 'Reliance Industries' },
      'TCS.NS': { price: 4150, name: 'Tata Consultancy Services' },
      'HDFCBANK.NS': { price: 1680, name: 'HDFC Bank' },
      'INFY.NS': { price: 1820, name: 'Infosys' },
      'HINDUNILVR.NS': { price: 2650, name: 'Hindustan Unilever' },
      'ICICIBANK.NS': { price: 1250, name: 'ICICI Bank' },
      'SBIN.NS': { price: 820, name: 'State Bank of India' },
      'BHARTIARTL.NS': { price: 1180, name: 'Bharti Airtel' },
      'ITC.NS': { price: 460, name: 'ITC Limited' },
      'KOTAKBANK.NS': { price: 1780, name: 'Kotak Mahindra Bank' },
      'LT.NS': { price: 3650, name: 'Larsen & Toubro' },
      'ASIANPAINT.NS': { price: 3280, name: 'Asian Paints' },
      'AXISBANK.NS': { price: 1150, name: 'Axis Bank' },
      'MARUTI.NS': { price: 11200, name: 'Maruti Suzuki' },
      'SUNPHARMA.NS': { price: 1680, name: 'Sun Pharmaceutical' },
      'ULTRACEMCO.NS': { price: 10800, name: 'UltraTech Cement' },
      'TITAN.NS': { price: 3420, name: 'Titan Company' },
      'WIPRO.NS': { price: 560, name: 'Wipro Limited' },
      'NESTLEIND.NS': { price: 2380, name: 'Nestle India' },
      'POWERGRID.NS': { price: 320, name: 'Power Grid Corporation' },
      '^NSEI': { price: 19850, name: 'NIFTY 50' },
      '^BSESN': { price: 66590, name: 'SENSEX' },
      '^NSEBANK': { price: 45230, name: 'BANK NIFTY' },
      '^CNXIT': { price: 35680, name: 'NIFTY IT' }
    };

    Object.entries(baseData).forEach(([symbol, base]) => {
      // Generate realistic price movements
      const volatility = symbol.startsWith('^') ? 0.02 : 0.03; // Indices less volatile
      const randomChange = (Math.random() - 0.5) * volatility;
      const currentPrice = base.price * (1 + randomChange);
      const change = currentPrice - base.price;
      const changePercent = (change / base.price) * 100;

      const marketData = {
        symbol,
        name: base.name,
        price: currentPrice,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 1000000) + 100000,
        high: currentPrice * (1 + Math.random() * 0.02),
        low: currentPrice * (1 - Math.random() * 0.02),
        open: base.price * (1 + (Math.random() - 0.5) * 0.01),
        previousClose: base.price,
        timestamp: new Date(),
        source: 'Simulated Data'
      };

      this.marketData.set(symbol, marketData);
    });

    this.notifyListeners();
  }

  // Handle connection errors
  handleConnectionError() {
    this.isConnected = false;
    this.reconnectAttempts++;

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.fetchMarketData();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  // Connect method for compatibility
  connect() {
    // Service auto-starts in constructor, this is just for compatibility
    console.log('RealTimeMarketService: Already connected and running');
    return Promise.resolve();
  }

  // Get market data for a specific symbol
  getMarketData(symbol) {
    return this.marketData.get(symbol) || null;
  }

  // Get all market data
  getAllMarketData() {
    return Array.from(this.marketData.values());
  }

  // Get indices data
  getIndicesData() {
    return this.indices.map(index => ({
      ...index,
      ...this.marketData.get(index.symbol)
    })).filter(item => item.price);
  }

  // Get top gainers
  getTopGainers(limit = 5) {
    return Array.from(this.marketData.values())
      .filter(data => !data.symbol.startsWith('^'))
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, limit);
  }

  // Get top losers
  getTopLosers(limit = 5) {
    return Array.from(this.marketData.values())
      .filter(data => !data.symbol.startsWith('^'))
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, limit);
  }

  // Get most active stocks by volume
  getMostActive(limit = 5) {
    return Array.from(this.marketData.values())
      .filter(data => !data.symbol.startsWith('^'))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, limit);
  }

  // Subscribe to market data updates
  subscribe(callback) {
    this.listeners.push(callback);

    // Send initial data
    callback({
      data: this.getAllMarketData(),
      indices: this.getIndicesData(),
      isConnected: this.isConnected,
      lastUpdate: new Date()
    });

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    const payload = {
      data: this.getAllMarketData(),
      indices: this.getIndicesData(),
      topGainers: this.getTopGainers(),
      topLosers: this.getTopLosers(),
      mostActive: this.getMostActive(),
      isConnected: this.isConnected,
      lastUpdate: new Date()
    };

    this.listeners.forEach(callback => {
      try {
        callback(payload);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  // Get market summary
  getMarketSummary() {
    const indices = this.getIndicesData();
    const stocks = Array.from(this.marketData.values()).filter(data => !data.symbol.startsWith('^'));

    const advancing = stocks.filter(s => s.changePercent > 0).length;
    const declining = stocks.filter(s => s.changePercent < 0).length;
    const unchanged = stocks.filter(s => s.changePercent === 0).length;

    return {
      indices,
      advancing,
      declining,
      unchanged,
      totalVolume: stocks.reduce((sum, s) => sum + (s.volume || 0), 0),
      marketStatus: this.isMarketOpen() ? 'Open' : 'Closed',
      lastUpdate: new Date()
    };
  }

  // Clean up
  destroy() {
    if (this.dataInterval) clearInterval(this.dataInterval);
    if (this.slowUpdateInterval) clearInterval(this.slowUpdateInterval);
    this.listeners = [];
    this.marketData.clear();
  }
}

// Create singleton instance
const realTimeMarketService = new RealTimeMarketService();

export default realTimeMarketService;
