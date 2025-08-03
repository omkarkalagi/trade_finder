import { ALPACA_CONFIG, MARKET_SYMBOLS, isMarketOpen } from '../config/alpaca';
import notificationService from './notificationService';

class RealTimeMarketService {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscribers = [];
    this.marketData = new Map();
    this.lastUpdate = null;
    
    // Bind methods
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  // Connect to Alpaca WebSocket
  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      console.log('🔌 Connecting to Alpaca WebSocket...');
      this.ws = new WebSocket(ALPACA_CONFIG.wsEndpoint);
      
      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      
    } catch (error) {
      console.error('❌ WebSocket connection error:', error);
      this.handleReconnect();
    }
  }

  handleOpen() {
    console.log('✅ WebSocket connected to Alpaca');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Authenticate
    this.authenticate();
  }

  authenticate() {
    const authMessage = {
      action: 'auth',
      key: ALPACA_CONFIG.key,
      secret: ALPACA_CONFIG.secret
    };
    
    this.ws.send(JSON.stringify(authMessage));
    console.log('🔐 Authenticating with Alpaca...');
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      
      // Handle different message types
      if (Array.isArray(data)) {
        data.forEach(message => this.processMessage(message));
      } else {
        this.processMessage(data);
      }
    } catch (error) {
      console.error('❌ Error processing WebSocket message:', error);
    }
  }

  processMessage(message) {
    switch (message.T) {
      case 'success':
        if (message.msg === 'authenticated') {
          console.log('✅ Authenticated with Alpaca');
          this.subscribeToMarketData();
        }
        break;
        
      case 'q': // Quote data
        this.handleQuoteUpdate(message);
        break;
        
      case 't': // Trade data
        this.handleTradeUpdate(message);
        break;
        
      case 'subscription':
        console.log('📊 Subscribed to:', message);
        break;
        
      default:
        // Handle other message types
        if (message.msg) {
          console.log('📨 Alpaca message:', message.msg);
        }
    }
  }

  subscribeToMarketData() {
    const subscribeMessage = {
      action: 'subscribe',
      quotes: MARKET_SYMBOLS,
      trades: MARKET_SYMBOLS
    };
    
    this.ws.send(JSON.stringify(subscribeMessage));
    console.log('📈 Subscribed to market data for:', MARKET_SYMBOLS.length, 'symbols');
    
    notificationService.notifySystem('Connected to real-time market data', 'low');
  }

  handleQuoteUpdate(quote) {
    const symbol = quote.S;
    const existingData = this.marketData.get(symbol) || {};
    
    const updatedData = {
      ...existingData,
      symbol,
      bid: quote.bp,
      ask: quote.ap,
      bidSize: quote.bs,
      askSize: quote.as,
      timestamp: new Date(quote.t),
      spread: quote.ap - quote.bp,
      type: 'quote'
    };
    
    this.marketData.set(symbol, updatedData);
    this.notifySubscribers(symbol, updatedData);
  }

  handleTradeUpdate(trade) {
    const symbol = trade.S;
    const existingData = this.marketData.get(symbol) || {};
    
    // Calculate price change
    const previousPrice = existingData.price || trade.p;
    const priceChange = trade.p - previousPrice;
    const priceChangePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0;
    
    const updatedData = {
      ...existingData,
      symbol,
      price: trade.p,
      size: trade.s,
      timestamp: new Date(trade.t),
      priceChange,
      priceChangePercent,
      volume: (existingData.volume || 0) + trade.s,
      type: 'trade'
    };
    
    this.marketData.set(symbol, updatedData);
    this.notifySubscribers(symbol, updatedData);
    this.lastUpdate = new Date();
  }

  handleClose(event) {
    console.log('🔌 WebSocket disconnected:', event.code, event.reason);
    this.isConnected = false;
    
    if (event.code !== 1000) { // Not a normal closure
      this.handleReconnect();
    }
  }

  handleError(error) {
    console.error('❌ WebSocket error:', error);
    this.isConnected = false;
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      notificationService.notifySystem('Market data connection failed', 'high');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Subscribe to market data updates
  subscribe(callback) {
    this.subscribers.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.unsubscribe(callback);
    };
  }

  unsubscribe(callback) {
    const index = this.subscribers.indexOf(callback);
    if (index > -1) {
      this.subscribers.splice(index, 1);
    }
  }

  notifySubscribers(symbol, data) {
    this.subscribers.forEach(callback => {
      try {
        callback(symbol, data);
      } catch (error) {
        console.error('❌ Error in subscriber callback:', error);
      }
    });
  }

  // Get current market data
  getMarketData(symbol) {
    if (symbol) {
      return this.marketData.get(symbol);
    }
    return Object.fromEntries(this.marketData);
  }

  // Get market summary
  getMarketSummary() {
    const data = Array.from(this.marketData.values());
    
    if (data.length === 0) {
      return null;
    }

    const gainers = data.filter(item => item.priceChangePercent > 0).length;
    const losers = data.filter(item => item.priceChangePercent < 0).length;
    const unchanged = data.filter(item => item.priceChangePercent === 0).length;
    
    const avgChange = data.reduce((sum, item) => sum + (item.priceChangePercent || 0), 0) / data.length;
    
    return {
      totalSymbols: data.length,
      gainers,
      losers,
      unchanged,
      averageChange: avgChange,
      lastUpdate: this.lastUpdate,
      isMarketOpen: isMarketOpen()
    };
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnected = false;
    this.subscribers = [];
    this.marketData.clear();
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      lastUpdate: this.lastUpdate,
      subscriberCount: this.subscribers.length,
      symbolCount: this.marketData.size
    };
  }
}

// Create singleton instance
const realTimeMarketService = new RealTimeMarketService();

// Auto-connect when market is open
if (isMarketOpen()) {
  realTimeMarketService.connect();
}

export default realTimeMarketService;
