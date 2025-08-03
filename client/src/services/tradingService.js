class TradingService {
  constructor() {
    this.orders = [];
    this.positions = [];
    this.watchlist = [];
    this.listeners = [];
    this.isConnected = false;

    // Initialize with some sample data
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample positions
    this.positions = [
      {
        id: 1,
        symbol: 'RELIANCE.NS',
        quantity: 50,
        avgPrice: 2450.00,
        currentPrice: 2485.50,
        side: 'long',
        unrealizedPL: 1775.00,
        unrealizedPLPercent: 1.45,
        marketValue: 124275.00,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 2,
        symbol: 'TCS.NS',
        quantity: 25,
        avgPrice: 3650.00,
        currentPrice: 3598.75,
        side: 'long',
        unrealizedPL: -1281.25,
        unrealizedPLPercent: -1.40,
        marketValue: 89968.75,
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ];

    // Sample orders
    this.orders = [
      {
        id: 'ORD001',
        symbol: 'HDFCBANK.NS',
        side: 'buy',
        quantity: 30,
        orderType: 'limit',
        limitPrice: 1580.00,
        status: 'pending',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        filledQuantity: 0
      },
      {
        id: 'ORD002',
        symbol: 'INFY.NS',
        side: 'sell',
        quantity: 40,
        orderType: 'market',
        status: 'filled',
        fillPrice: 1425.50,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        filledQuantity: 40
      }
    ];

    // Sample watchlist
    this.watchlist = [
      'RELIANCE.NS',
      'TCS.NS',
      'HDFCBANK.NS',
      'INFY.NS',
      'ICICIBANK.NS'
    ];
  }

  // Place a new order
  async placeOrder(orderData) {
    try {
      const order = {
        id: `ORD${Date.now()}`,
        symbol: orderData.symbol,
        side: orderData.side, // 'buy' or 'sell'
        quantity: orderData.quantity,
        orderType: orderData.orderType || 'market', // 'market', 'limit', 'stop'
        limitPrice: orderData.limitPrice,
        stopPrice: orderData.stopPrice,
        status: 'pending',
        timestamp: new Date(),
        filledQuantity: 0,
        avgFillPrice: 0
      };

      // Simulate order processing
      this.orders.unshift(order);

      // Simulate order execution after a delay
      setTimeout(() => {
        this.simulateOrderExecution(order.id);
      }, Math.random() * 3000 + 1000); // 1-4 seconds

      this.notifyListeners();

      return {
        success: true,
        orderId: order.id,
        message: 'Order placed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Simulate order execution
  simulateOrderExecution(orderId) {
    const orderIndex = this.orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) return;

    const order = this.orders[orderIndex];

    // Simulate execution probability (90% success rate)
    if (Math.random() > 0.1) {
      // Order filled
      order.status = 'filled';
      order.filledQuantity = order.quantity;
      order.avgFillPrice = order.limitPrice || this.getSimulatedPrice(order.symbol);
      order.fillTimestamp = new Date();

      // Update positions
      this.updatePosition(order);
    } else {
      // Order rejected
      order.status = 'rejected';
      order.rejectReason = 'Insufficient funds or market conditions';
    }

    this.notifyListeners();
  }

  // Update position after order execution
  updatePosition(order) {
    const existingPositionIndex = this.positions.findIndex(pos => pos.symbol === order.symbol);

    if (existingPositionIndex !== -1) {
      // Update existing position
      const position = this.positions[existingPositionIndex];

      if (order.side === 'buy') {
        const totalCost = (position.quantity * position.avgPrice) + (order.filledQuantity * order.avgFillPrice);
        const totalQuantity = position.quantity + order.filledQuantity;
        position.avgPrice = totalCost / totalQuantity;
        position.quantity = totalQuantity;
      } else {
        // Sell order
        position.quantity -= order.filledQuantity;
        if (position.quantity <= 0) {
          this.positions.splice(existingPositionIndex, 1);
        }
      }
    } else if (order.side === 'buy') {
      // Create new position
      const newPosition = {
        id: Date.now(),
        symbol: order.symbol,
        quantity: order.filledQuantity,
        avgPrice: order.avgFillPrice,
        currentPrice: order.avgFillPrice,
        side: 'long',
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
        marketValue: order.filledQuantity * order.avgFillPrice,
        timestamp: new Date()
      };
      this.positions.push(newPosition);
    }
  }

  // Get simulated current price for a symbol
  getSimulatedPrice(symbol) {
    // This would normally come from market data service
    const basePrices = {
      'RELIANCE.NS': 2485.50,
      'TCS.NS': 3598.75,
      'HDFCBANK.NS': 1585.25,
      'INFY.NS': 1425.50,
      'ICICIBANK.NS': 985.75
    };

    const basePrice = basePrices[symbol] || 1000;
    // Add some random variation (±2%)
    return basePrice * (1 + (Math.random() - 0.5) * 0.04);
  }

  // Cancel an order
  async cancelOrder(orderId) {
    try {
      const orderIndex = this.orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }

      const order = this.orders[orderIndex];
      if (order.status !== 'pending') {
        throw new Error('Cannot cancel order with status: ' + order.status);
      }

      order.status = 'cancelled';
      order.cancelTimestamp = new Date();

      this.notifyListeners();

      return {
        success: true,
        message: 'Order cancelled successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add to watchlist
  addToWatchlist(symbol) {
    if (!this.watchlist.includes(symbol)) {
      this.watchlist.push(symbol);
      this.notifyListeners();
    }
  }

  // Remove from watchlist
  removeFromWatchlist(symbol) {
    const index = this.watchlist.indexOf(symbol);
    if (index !== -1) {
      this.watchlist.splice(index, 1);
      this.notifyListeners();
    }
  }

  // Get all orders
  getOrders() {
    return [...this.orders].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Get all positions
  getPositions() {
    return [...this.positions];
  }

  // Get watchlist
  getWatchlist() {
    return [...this.watchlist];
  }

  // Get order by ID
  getOrder(orderId) {
    return this.orders.find(order => order.id === orderId);
  }

  // Get position by symbol
  getPosition(symbol) {
    return this.positions.find(position => position.symbol === symbol);
  }

  // Update position prices (called by market data service)
  updatePositionPrices(marketData) {
    this.positions.forEach(position => {
      const marketPrice = marketData.find(data => data.symbol === position.symbol);
      if (marketPrice) {
        position.currentPrice = marketPrice.price;
        position.marketValue = position.quantity * marketPrice.price;
        position.unrealizedPL = (marketPrice.price - position.avgPrice) * position.quantity;
        position.unrealizedPLPercent = ((marketPrice.price - position.avgPrice) / position.avgPrice) * 100;
      }
    });
    this.notifyListeners();
  }

  // Get portfolio summary
  getPortfolioSummary() {
    const totalValue = this.positions.reduce((sum, pos) => sum + pos.marketValue, 0);
    const totalPL = this.positions.reduce((sum, pos) => sum + pos.unrealizedPL, 0);
    const totalPLPercent = totalValue > 0 ? (totalPL / (totalValue - totalPL)) * 100 : 0;

    return {
      totalValue,
      totalPL,
      totalPLPercent,
      positionCount: this.positions.length,
      pendingOrders: this.orders.filter(order => order.status === 'pending').length
    };
  }

  // Subscribe to updates
  subscribe(callback) {
    this.listeners.push(callback);

    // Send initial data
    callback({
      orders: this.getOrders(),
      positions: this.getPositions(),
      watchlist: this.getWatchlist(),
      portfolio: this.getPortfolioSummary()
    });

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  notifyListeners() {
    const data = {
      orders: this.getOrders(),
      positions: this.getPositions(),
      watchlist: this.getWatchlist(),
      portfolio: this.getPortfolioSummary()
    };

    this.listeners.forEach(callback => callback(data));
  }

  // Get order history
  getOrderHistory(limit = 50) {
    return this.orders
      .filter(order => order.status === 'filled' || order.status === 'rejected' || order.status === 'cancelled')
      .slice(0, limit);
  }

  // Get trading statistics
  getTradingStats() {
    const filledOrders = this.orders.filter(order => order.status === 'filled');
    const totalTrades = filledOrders.length;
    const buyOrders = filledOrders.filter(order => order.side === 'buy').length;
    const sellOrders = filledOrders.filter(order => order.side === 'sell').length;

    return {
      totalTrades,
      buyOrders,
      sellOrders,
      successRate: this.orders.length > 0 ? (filledOrders.length / this.orders.length) * 100 : 0,
      pendingOrders: this.orders.filter(order => order.status === 'pending').length,
      rejectedOrders: this.orders.filter(order => order.status === 'rejected').length
    };
  }
}

// Create singleton instance
const tradingService = new TradingService();

export default tradingService;
