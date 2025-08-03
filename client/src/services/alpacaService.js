import axios from 'axios';
import notificationService from './notificationService';

// Alpaca Configuration
const ALPACA_CONFIG = {
  key: process.env.VITE_ALPACA_API_KEY || 'PK2LGOIJ1F1V9RQ0UPU5',
  secret: process.env.VITE_ALPACA_API_SECRET || 'lOdhyveIeUkBrO6OPRb38M7XwqxkG4WRLzQsEuIt',
  endpoint: 'https://paper-api.alpaca.markets/v2',
  dataEndpoint: 'https://data.alpaca.markets/v2'
};

class AlpacaService {
  constructor() {
    this.isConnected = false;
    this.account = null;
    this.positions = [];
    this.orders = [];
    this.portfolio = null;
    this.listeners = [];

    // Create axios instances
    this.alpacaApi = axios.create({
      baseURL: ALPACA_CONFIG.endpoint,
      headers: {
        'APCA-API-KEY-ID': ALPACA_CONFIG.key,
        'APCA-API-SECRET-KEY': ALPACA_CONFIG.secret,
        'Content-Type': 'application/json'
      }
    });

    this.alpacaDataApi = axios.create({
      baseURL: ALPACA_CONFIG.dataEndpoint,
      headers: {
        'APCA-API-KEY-ID': ALPACA_CONFIG.key,
        'APCA-API-SECRET-KEY': ALPACA_CONFIG.secret,
        'Content-Type': 'application/json'
      }
    });
  }

  // Initialize connection to Alpaca
  async connect() {
    try {
      notificationService.notifySystem('Connecting to Alpaca...', 'medium');

      // Try to fetch account info to test connection
      const accountResponse = await this.alpacaApi.get('/account');
      this.account = accountResponse.data;

      // Fetch positions and orders
      await this.fetchPositions();
      await this.fetchOrders();

      this.isConnected = true;
      this.updatePortfolioSummary();

      notificationService.notifySystem('Successfully connected to Alpaca!', 'medium');
      this.notifyListeners();

      return { success: true, message: 'Connected to Alpaca successfully!' };
    } catch (error) {
      console.error('Alpaca connection error:', error);
      // Fall back to demo mode
      await this.simulateAlpacaConnection();
      notificationService.notifySystem('Using Alpaca demo mode', 'medium');
      return { success: true, message: 'Connected to Alpaca demo mode!' };
    }
  }

  // Fetch account information
  async fetchAccount() {
    try {
      const response = await this.alpacaApi.get('/account');
      this.account = response.data;
      return this.account;
    } catch (error) {
      console.error('Error fetching account:', error);
      throw error;
    }
  }

  // Fetch positions
  async fetchPositions() {
    try {
      const response = await this.alpacaApi.get('/positions');
      this.positions = response.data;
      return this.positions;
    } catch (error) {
      console.error('Error fetching positions:', error);
      this.positions = [];
    }
  }

  // Fetch orders
  async fetchOrders(status = 'all', limit = 100) {
    try {
      const response = await this.alpacaApi.get('/orders', {
        params: { status, limit }
      });
      this.orders = response.data;
      return this.orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      this.orders = [];
    }
  }

  // Place a buy order
  async placeBuyOrder(symbol, quantity, orderType = 'market', limitPrice = null) {
    if (!this.isConnected) {
      throw new Error('Not connected to Alpaca');
    }

    try {
      const orderParams = {
        symbol: symbol.toUpperCase(),
        qty: quantity,
        side: 'buy',
        type: orderType,
        time_in_force: 'day'
      };

      if (orderType === 'limit' && limitPrice) {
        orderParams.limit_price = limitPrice;
      }

      const response = await this.alpacaApi.post('/orders', orderParams);
      const order = response.data;

      this.orders.unshift(order);
      notificationService.notifyTrade(`BUY order placed for ${quantity} shares of ${symbol}`, 'info');

      this.notifyListeners();
      return order;
    } catch (error) {
      console.error('Error placing buy order:', error);
      notificationService.notifyTrade(`Failed to place BUY order for ${symbol}`, 'error');
      throw error;
    }
  }

  // Place a sell order
  async placeSellOrder(symbol, quantity, orderType = 'market', limitPrice = null) {
    if (!this.isConnected) {
      throw new Error('Not connected to Alpaca');
    }

    try {
      const orderParams = {
        symbol: symbol.toUpperCase(),
        qty: quantity,
        side: 'sell',
        type: orderType,
        time_in_force: 'day'
      };

      if (orderType === 'limit' && limitPrice) {
        orderParams.limit_price = limitPrice;
      }

      const response = await this.alpacaApi.post('/orders', orderParams);
      const order = response.data;

      this.orders.unshift(order);
      notificationService.notifyTrade(`SELL order placed for ${quantity} shares of ${symbol}`, 'info');

      this.notifyListeners();
      return order;
    } catch (error) {
      console.error('Error placing sell order:', error);
      notificationService.notifyTrade(`Failed to place SELL order for ${symbol}`, 'error');
      throw error;
    }
  }

  // Add to watchlist
  addToWatchlist(symbol) {
    notificationService.notifySystem(`${symbol} added to watchlist`, 'low');
    // Implementation for watchlist functionality
  }

  // Update portfolio summary
  updatePortfolioSummary() {
    if (!this.account) return;

    const totalPnL = this.positions.reduce((sum, pos) => sum + parseFloat(pos.unrealized_pl || 0), 0);

    this.portfolio = {
      totalValue: parseFloat(this.account.portfolio_value || 0),
      totalPnL: totalPnL,
      dayChange: parseFloat(this.account.portfolio_value || 0) - parseFloat(this.account.last_equity || 0),
      dayChangePercent: this.account.last_equity ?
        (((parseFloat(this.account.portfolio_value) - parseFloat(this.account.last_equity)) / parseFloat(this.account.last_equity)) * 100).toFixed(2) : 0,
      positions: this.positions.length,
      cash: parseFloat(this.account.cash || 0),
      buyingPower: parseFloat(this.account.buying_power || 0)
    };
  }

  // Simulate Alpaca connection with mock data (fallback)
  async simulateAlpacaConnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.account = {
          id: 'alpaca_demo_account',
          account_number: 'PA123456789',
          status: 'ACTIVE',
          currency: 'USD',
          buying_power: 100000.00,
          cash: 50000.00,
          portfolio_value: 125000.00,
          equity: 125000.00,
          last_equity: 123000.00,
          multiplier: 1,
          day_trade_count: 0,
          daytrade_buying_power: 100000.00
        };

        this.positions = [
          {
            asset_id: 'aapl_id',
            symbol: 'AAPL',
            qty: 50,
            side: 'long',
            market_value: 8750.00,
            cost_basis: 8500.00,
            unrealized_pl: 250.00,
            unrealized_plpc: 0.0294,
            avg_entry_price: 170.00,
            current_price: 175.00
          },
          {
            asset_id: 'tsla_id',
            symbol: 'TSLA',
            qty: 25,
            side: 'long',
            market_value: 5000.00,
            cost_basis: 5250.00,
            unrealized_pl: -250.00,
            unrealized_plpc: -0.0476,
            avg_entry_price: 210.00,
            current_price: 200.00
          }
        ];

        this.orders = [
          {
            id: 'order_1',
            symbol: 'GOOGL',
            qty: 10,
            side: 'buy',
            order_type: 'market',
            status: 'filled',
            filled_qty: 10,
            filled_avg_price: 2650.00,
            created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            filled_at: new Date(Date.now() - 1000 * 60 * 25).toISOString()
          }
        ];

        this.isConnected = true;
        this.updatePortfolioSummary();
        this.notifyListeners();
        resolve();
      }, 2000);
    });
  }

  // Get account info
  getAccount() {
    return this.account;
  }

  // Get positions
  getPositions() {
    return this.positions;
  }

  // Get orders
  getOrders() {
    return this.orders;
  }

  // Get portfolio summary
  getPortfolioSummary() {
    return this.portfolio;
  }

  // Check connection status
  isAlpacaConnected() {
    return this.isConnected;
  }

  // Get market data for charts
  async getMarketData(symbol, timeframe = '1D') {
    try {
      const now = new Date();
      const start = new Date();

      // Set start date based on timeframe
      switch (timeframe) {
        case '1D':
          start.setDate(now.getDate() - 1);
          break;
        case '1W':
          start.setDate(now.getDate() - 7);
          break;
        case '1M':
          start.setMonth(now.getMonth() - 1);
          break;
        case '3M':
          start.setMonth(now.getMonth() - 3);
          break;
        case '1Y':
          start.setFullYear(now.getFullYear() - 1);
          break;
        default:
          start.setDate(now.getDate() - 1);
      }

      const timeframeParam = timeframe === '1D' ? '1Hour' : timeframe === '1W' ? '1Day' : '1Day';

      const response = await this.alpacaDataApi.get('/stocks/bars', {
        params: {
          symbols: symbol,
          timeframe: timeframeParam,
          start: start.toISOString().split('T')[0],
          end: now.toISOString().split('T')[0],
          limit: 1000
        }
      });

      if (response.data && response.data.bars && response.data.bars[symbol]) {
        return response.data.bars[symbol].map(bar => ({
          time: timeframe === '1D' ?
            new Date(bar.t).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) :
            new Date(bar.t).toLocaleDateString('en-IN'),
          price: parseFloat(bar.c),
          volume: parseInt(bar.v),
          high: parseFloat(bar.h),
          low: parseFloat(bar.l),
          open: parseFloat(bar.o)
        }));
      }

      return null;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return null;
    }
  }

  // Subscribe to updates
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback({
      connected: this.isConnected,
      account: this.account,
      positions: this.positions,
      orders: this.orders,
      portfolio: this.portfolio
    }));
  }

  // Get portfolio history
  async getPortfolioHistory(period = '1M', timeframe = '1D') {
    try {
      const response = await this.alpacaApi.get('/account/portfolio/history', {
        params: { period, timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio history:', error);
      // Return mock data for demo
      return this.getMockPortfolioHistory(period);
    }
  }

  // Get market clock
  async getMarketClock() {
    try {
      const response = await this.alpacaApi.get('/clock');
      return response.data;
    } catch (error) {
      console.error('Error fetching market clock:', error);
      // Return mock market clock
      return {
        timestamp: new Date().toISOString(),
        is_open: true,
        next_open: new Date().toISOString(),
        next_close: new Date().toISOString()
      };
    }
  }

  // Place order (generic method)
  async placeOrder(orderParams) {
    const { symbol, side, quantity, orderType, limitPrice } = orderParams;

    if (side === 'buy') {
      return await this.placeBuyOrder(symbol, quantity, orderType, limitPrice);
    } else {
      return await this.placeSellOrder(symbol, quantity, orderType, limitPrice);
    }
  }

  // Cancel order
  async cancelOrder(orderId) {
    try {
      const response = await this.alpacaApi.delete(`/orders/${orderId}`);

      // Remove from local orders array
      this.orders = this.orders.filter(order => order.id !== orderId);
      this.notifyListeners();

      notificationService.notifyTrade(`Order ${orderId} cancelled`, 'info');
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      notificationService.notifyTrade(`Failed to cancel order ${orderId}`, 'error');
      throw error;
    }
  }

  // Calculate portfolio metrics
  calculatePortfolioMetrics(account, positions) {
    if (!account || !positions) return null;

    const totalValue = parseFloat(account.portfolio_value || 0);
    const totalPnL = positions.reduce((sum, pos) => sum + parseFloat(pos.unrealized_pl || 0), 0);
    const totalPnLPercent = account.last_equity ?
      (totalPnL / parseFloat(account.last_equity)) * 100 : 0;

    return {
      totalValue,
      totalPnL,
      totalPnLPercent,
      dayChange: parseFloat(account.portfolio_value || 0) - parseFloat(account.last_equity || 0),
      dayChangePercent: account.last_equity ?
        (((parseFloat(account.portfolio_value) - parseFloat(account.last_equity)) / parseFloat(account.last_equity)) * 100) : 0,
      positionCount: positions.length,
      cash: parseFloat(account.cash || 0),
      buyingPower: parseFloat(account.buying_power || 0)
    };
  }

  // Mock portfolio history for demo
  getMockPortfolioHistory(period) {
    const now = new Date();
    const data = [];
    const days = period === '1D' ? 1 : period === '1W' ? 7 : period === '1M' ? 30 : 90;

    let baseValue = 100000;
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      // Add some random variation
      const variation = (Math.random() - 0.5) * 2000;
      baseValue += variation;

      data.push({
        timestamp: date.toISOString(),
        equity: baseValue,
        profit_loss: baseValue - 100000,
        profit_loss_pct: ((baseValue - 100000) / 100000) * 100
      });
    }

    return {
      timestamp: data.map(d => d.timestamp),
      equity: data.map(d => d.equity),
      profit_loss: data.map(d => d.profit_loss),
      profit_loss_pct: data.map(d => d.profit_loss_pct),
      base_value: 100000
    };
  }

  // Disconnect
  disconnect() {
    this.isConnected = false;
    this.account = null;
    this.positions = [];
    this.orders = [];
    this.portfolio = null;

    notificationService.notifySystem('Disconnected from Alpaca', 'medium');
    this.notifyListeners();
  }
}

// Create singleton instance
const alpacaService = new AlpacaService();

export default alpacaService;

// Get market calendar
export const getMarketCalendar = async (start, end) => {
  try {
    const response = await alpacaApi.get('/calendar', {
      params: { start, end }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market calendar:', error);
    throw error;
  }
};

// Get asset information
export const getAsset = async (symbol) => {
  try {
    const response = await alpacaApi.get(`/assets/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset information for ${symbol}:`, error);
    throw error;
  }
};

// Get all assets
export const getAssets = async (status = 'active', assetClass = 'us_equity') => {
  try {
    const response = await alpacaApi.get('/assets', {
      params: { status, asset_class: assetClass }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Get bars (OHLC) data
export const getBars = async (symbols, timeframe = '1D', start, end, limit = 1000) => {
  try {
    // Convert symbols array to comma-separated string if it's an array
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;

    const response = await alpacaDataApi.get('/stocks/bars', {
      params: {
        symbols: symbolsParam,
        timeframe,
        start,
        end,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bars data:', error);
    throw error;
  }
};

// Get latest quotes
export const getQuotes = async (symbols) => {
  try {
    // Convert symbols array to comma-separated string if it's an array
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;

    const response = await alpacaDataApi.get('/stocks/quotes/latest', {
      params: { symbols: symbolsParam }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

// Get latest trades
export const getTrades = async (symbols) => {
  try {
    // Convert symbols array to comma-separated string if it's an array
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;

    const response = await alpacaDataApi.get('/stocks/trades/latest', {
      params: { symbols: symbolsParam }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

// Calculate portfolio metrics
export const calculatePortfolioMetrics = (account, positions) => {
  // Extract relevant account information
  const { equity, buying_power, cash, portfolio_value, initial_margin } = account;

  // Calculate basic metrics
  const totalEquity = parseFloat(equity);
  const totalCash = parseFloat(cash);
  const totalPositionsValue = parseFloat(portfolio_value) - totalCash;
  const marginUsed = parseFloat(initial_margin);
  const availableBuyingPower = parseFloat(buying_power);

  // Calculate allocation percentages
  const cashAllocation = (totalCash / totalEquity) * 100;
  const positionsAllocation = (totalPositionsValue / totalEquity) * 100;

  // Calculate position-specific metrics
  const positionMetrics = positions.map(position => {
    const marketValue = parseFloat(position.market_value);
    const costBasis = parseFloat(position.cost_basis);
    const unrealizedPL = parseFloat(position.unrealized_pl);
    const unrealizedPLPercent = parseFloat(position.unrealized_plpc) * 100;
    const allocationPercent = (marketValue / totalEquity) * 100;

    return {
      ...position,
      marketValue,
      costBasis,
      unrealizedPL,
      unrealizedPLPercent,
      allocationPercent
    };
  });

  // Sort positions by allocation percentage (descending)
  const sortedPositions = [...positionMetrics].sort((a, b) => b.allocationPercent - a.allocationPercent);

  // Calculate sector and asset class allocations
  // Note: This would require additional data about each position's sector and asset class
  // which is not directly provided by Alpaca's position data

  // Calculate risk metrics
  // This is a simplified calculation and would need to be expanded for a real application
  const totalUnrealizedPL = positions.reduce((sum, position) => sum + parseFloat(position.unrealized_pl), 0);
  const totalUnrealizedPLPercent = totalPositionsValue > 0 ? (totalUnrealizedPL / totalPositionsValue) * 100 : 0;

  return {
    totalEquity,
    totalCash,
    totalPositionsValue,
    marginUsed,
    availableBuyingPower,
    cashAllocation,
    positionsAllocation,
    positions: sortedPositions,
    totalUnrealizedPL,
    totalUnrealizedPLPercent
  };
};

// Additional functions are already exported as part of alpacaService above
