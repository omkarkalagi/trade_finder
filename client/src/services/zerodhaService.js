import notificationService from './notificationService';

class ZerodhaService {
  constructor() {
    this.isConnected = false;
    this.accessToken = null;
    this.userProfile = null;
    this.portfolio = null;
    this.positions = null;
    this.orders = null;
    this.listeners = [];
  }

  // Check if connected to Zerodha
  isZerodhaConnected() {
    return this.isConnected;
  }

  // Get connection status
  getConnectionStatus() {
    return {
      connected: this.isConnected,
      profile: this.userProfile,
      lastSync: this.lastSync
    };
  }

  // Connect to Zerodha
  async connectToZerodha() {
    try {
      notificationService.notifyZerodha('Initiating connection to Zerodha...', 'info');

      // In a real implementation, this would redirect to Zerodha login
      // For demo purposes, we'll simulate the connection
      await this.simulateZerodhaConnection();

      return { success: true, message: 'Connected to Zerodha successfully!' };
    } catch (error) {
      console.error('Zerodha connection error:', error);
      notificationService.notifyZerodha('Failed to connect to Zerodha', 'error');
      return { success: false, message: error.message };
    }
  }

  // Simulate Zerodha connection (for demo)
  async simulateZerodhaConnection() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.accessToken = 'demo_access_token_' + Date.now();
        this.userProfile = {
          user_id: 'OK1234',
          user_name: 'Omkar D',
          email: 'omkar@example.com',
          broker: 'ZERODHA',
          exchanges: ['NSE', 'BSE', 'MCX'],
          products: ['CNC', 'MIS', 'NRML'],
          order_types: ['MARKET', 'LIMIT', 'SL', 'SL-M']
        };

        this.portfolio = [
          {
            tradingsymbol: 'RELIANCE',
            exchange: 'NSE',
            quantity: 50,
            average_price: 2450.75,
            last_price: 2485.30,
            pnl: 1727.5,
            product: 'CNC'
          },
          {
            tradingsymbol: 'TCS',
            exchange: 'NSE',
            quantity: 25,
            average_price: 3650.20,
            last_price: 3698.45,
            pnl: 1206.25,
            product: 'CNC'
          },
          {
            tradingsymbol: 'INFY',
            exchange: 'NSE',
            quantity: 30,
            average_price: 1456.80,
            last_price: 1478.90,
            pnl: 663.0,
            product: 'CNC'
          }
        ];

        this.positions = [
          {
            tradingsymbol: 'HDFCBANK',
            exchange: 'NSE',
            quantity: 10,
            average_price: 1650.25,
            last_price: 1665.80,
            pnl: 155.5,
            product: 'MIS'
          }
        ];

        this.orders = [
          {
            order_id: 'ORD001',
            tradingsymbol: 'WIPRO',
            exchange: 'NSE',
            transaction_type: 'BUY',
            quantity: 100,
            price: 445.50,
            status: 'COMPLETE',
            order_timestamp: new Date().toISOString()
          }
        ];

        this.lastSync = new Date();

        notificationService.notifyZerodha('Successfully connected to Zerodha!', 'success');
        notificationService.notifyPortfolio('Portfolio synced with Zerodha account');

        this.notifyListeners();
        resolve();
      }, 2000);
    });
  }

  // Disconnect from Zerodha
  disconnect() {
    this.isConnected = false;
    this.accessToken = null;
    this.userProfile = null;
    this.portfolio = null;
    this.positions = null;
    this.orders = null;
    this.lastSync = null;

    notificationService.notifyZerodha('Disconnected from Zerodha', 'info');
    this.notifyListeners();
  }

  // Get user profile
  getUserProfile() {
    return this.userProfile;
  }

  // Get portfolio
  getPortfolio() {
    return this.portfolio || [];
  }

  // Get positions
  getPositions() {
    return this.positions || [];
  }

  // Get orders
  getOrders() {
    return this.orders || [];
  }

  // Calculate portfolio summary
  getPortfolioSummary() {
    if (!this.portfolio) return null;

    const totalInvestment = this.portfolio.reduce((sum, stock) =>
      sum + (stock.quantity * stock.average_price), 0
    );

    const currentValue = this.portfolio.reduce((sum, stock) =>
      sum + (stock.quantity * stock.last_price), 0
    );

    const totalPnL = this.portfolio.reduce((sum, stock) => sum + stock.pnl, 0);

    return {
      totalInvestment: totalInvestment.toFixed(2),
      currentValue: currentValue.toFixed(2),
      totalPnL: totalPnL.toFixed(2),
      totalPnLPercentage: ((totalPnL / totalInvestment) * 100).toFixed(2),
      stockCount: this.portfolio.length
    };
  }

  // Place order (demo)
  async placeOrder(orderData) {
    if (!this.isConnected) {
      throw new Error('Not connected to Zerodha');
    }

    // Simulate order placement
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = {
          order_id: 'ORD' + Date.now(),
          ...orderData,
          status: 'COMPLETE',
          order_timestamp: new Date().toISOString()
        };

        this.orders = this.orders || [];
        this.orders.unshift(order);

        notificationService.notifyTrade(
          `${orderData.transaction_type} order for ${orderData.quantity} ${orderData.tradingsymbol} executed at ₹${orderData.price}`,
          'success'
        );

        this.notifyListeners();
        resolve(order);
      }, 1000);
    });
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
      profile: this.userProfile,
      portfolio: this.portfolio,
      positions: this.positions,
      orders: this.orders
    }));
  }

  // Sync data from Zerodha
  async syncData() {
    if (!this.isConnected) return;

    try {
      notificationService.notifyZerodha('Syncing data from Zerodha...', 'info');

      // Simulate data sync
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.lastSync = new Date();
      notificationService.notifyZerodha('Data synced successfully!', 'success');

      this.notifyListeners();
    } catch (error) {
      notificationService.notifyZerodha('Failed to sync data', 'error');
    }
  }
}

// Create singleton instance
const zerodhaService = new ZerodhaService();

export default zerodhaService;
