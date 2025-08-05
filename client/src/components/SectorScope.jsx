import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import alpacaService from '../services/alpacaService';
import notificationService from '../services/notificationService';

const SectorScope = () => {
  const [selectedSector, setSelectedSector] = useState(null);
  const [sectorData, setSectorData] = useState([]);
  const [sectorStocks, setSectorStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAlpacaConnected, setIsAlpacaConnected] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [watchlist, setWatchlist] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [realTimeData, setRealTimeData] = useState({});
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock sector data
  const mockSectorData = [
    {
      name: 'Banking & Financial',
      performance: 2.45,
      marketCap: '₹45.2L Cr',
      stocks: 45,
      color: '#3B82F6',
      icon: '🏦',
      topStocks: [
        { symbol: 'HDFCBANK', price: 1665.80, change: 1.2, volume: '2.5M' },
        { symbol: 'ICICIBANK', price: 945.30, change: 0.8, volume: '3.1M' },
        { symbol: 'SBIN', price: 542.75, change: -0.5, volume: '4.2M' },
        { symbol: 'AXISBANK', price: 1087.45, change: 1.5, volume: '1.8M' },
        { symbol: 'KOTAKBANK', price: 1756.20, change: 0.9, volume: '1.2M' }
      ]
    },
    {
      name: 'Information Technology',
      performance: 1.85,
      marketCap: '₹38.7L Cr',
      stocks: 32,
      color: '#10B981',
      icon: '💻',
      topStocks: [
        { symbol: 'TCS', price: 3698.45, change: 1.3, volume: '1.5M' },
        { symbol: 'INFY', price: 1478.90, change: 1.1, volume: '2.8M' },
        { symbol: 'WIPRO', price: 445.50, change: 0.7, volume: '3.5M' },
        { symbol: 'HCLTECH', price: 1245.80, change: 1.8, volume: '1.9M' },
        { symbol: 'TECHM', price: 1156.75, change: 0.4, volume: '2.1M' }
      ]
    },
    {
      name: 'Oil & Gas',
      performance: -0.75,
      marketCap: '₹28.3L Cr',
      stocks: 18,
      color: '#F59E0B',
      icon: '⛽',
      topStocks: [
        { symbol: 'RELIANCE', price: 2485.30, change: 1.4, volume: '5.2M' },
        { symbol: 'ONGC', price: 245.60, change: -1.2, volume: '8.5M' },
        { symbol: 'IOC', price: 134.75, change: -0.8, volume: '6.3M' },
        { symbol: 'BPCL', price: 287.90, change: 0.3, volume: '4.1M' },
        { symbol: 'HINDPETRO', price: 298.45, change: -0.5, volume: '3.7M' }
      ]
    },
    {
      name: 'Pharmaceuticals',
      performance: 3.20,
      marketCap: '₹22.1L Cr',
      stocks: 28,
      color: '#EF4444',
      icon: '💊',
      topStocks: [
        { symbol: 'SUNPHARMA', price: 1456.30, change: 2.1, volume: '2.3M' },
        { symbol: 'DRREDDY', price: 5234.75, change: 1.8, volume: '0.8M' },
        { symbol: 'CIPLA', price: 1087.45, change: 2.5, volume: '1.9M' },
        { symbol: 'DIVISLAB', price: 3456.80, change: 1.2, volume: '1.1M' },
        { symbol: 'BIOCON', price: 267.90, change: 3.1, volume: '4.2M' }
      ]
    },
    {
      name: 'Automobiles',
      performance: 1.15,
      marketCap: '₹18.9L Cr',
      stocks: 22,
      color: '#8B5CF6',
      icon: '🚗',
      topStocks: [
        { symbol: 'MARUTI', price: 10456.75, change: 0.8, volume: '0.9M' },
        { symbol: 'TATAMOTORS', price: 456.30, change: 1.5, volume: '7.2M' },
        { symbol: 'M&M', price: 1234.80, change: 1.2, volume: '2.8M' },
        { symbol: 'BAJAJ-AUTO', price: 6789.45, change: 0.5, volume: '0.7M' },
        { symbol: 'HEROMOTOCO', price: 3456.20, change: 1.8, volume: '1.3M' }
      ]
    },
    {
      name: 'FMCG',
      performance: 0.95,
      marketCap: '₹16.5L Cr',
      stocks: 25,
      color: '#EC4899',
      icon: '🛒',
      topStocks: [
        { symbol: 'HINDUNILVR', price: 2456.75, change: 0.6, volume: '1.8M' },
        { symbol: 'ITC', price: 456.30, change: 1.2, volume: '8.5M' },
        { symbol: 'NESTLEIND', price: 18456.80, change: 0.3, volume: '0.2M' },
        { symbol: 'BRITANNIA', price: 4567.45, change: 1.1, volume: '0.8M' },
        { symbol: 'DABUR', price: 567.90, change: 0.8, volume: '3.2M' }
      ]
    }
  ];

  useEffect(() => {
    const initializeSectorData = async () => {
      try {
        // Check Alpaca connection
        setIsAlpacaConnected(alpacaService.isAlpacaConnected());

        // Try to fetch real sector data from API
        const response = await fetch('/api/sectors/performance');
        if (response.ok) {
          const realSectorData = await response.json();
          setSectorData(realSectorData);
        } else {
          // Fallback to mock data with enhanced real-time simulation
          setSectorData(mockSectorData);
        }

        // Get real-time quotes for all stocks if Alpaca is connected
        if (alpacaService.isAlpacaConnected()) {
          const allStocks = mockSectorData.flatMap(sector =>
            sector.topStocks.map(stock => stock.symbol)
          );

          // Fetch real quotes
          const quotes = await Promise.all(
            allStocks.map(async (symbol) => {
              try {
                const quote = await alpacaService.getQuote(symbol);
                return { symbol, ...quote };
              } catch (error) {
                console.error(`Error fetching quote for ${symbol}:`, error);
                return null;
              }
            })
          );

          // Update real-time data
          const quotesMap = {};
          quotes.filter(q => q).forEach(quote => {
            quotesMap[quote.symbol] = quote;
          });
          setRealTimeData(quotesMap);

          // Update sector data with real prices
          setSectorData(prevData =>
            prevData.map(sector => ({
              ...sector,
              topStocks: sector.topStocks.map(stock => {
                const realQuote = quotesMap[stock.symbol];
                return realQuote ? {
                  ...stock,
                  price: realQuote.price,
                  change: realQuote.changePercent,
                  volume: realQuote.volume || stock.volume
                } : stock;
              })
            }))
          );
        }

      } catch (error) {
        console.error('Error initializing sector data:', error);
        setSectorData(mockSectorData);
      }

      setLoading(false);
    };

    initializeSectorData();

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);

    // Subscribe to Alpaca updates
    const unsubscribe = alpacaService.subscribe((data) => {
      setIsAlpacaConnected(data.connected);
      if (data.connected) {
        // Re-fetch data when connection is established
        initializeSectorData();
      }
    });

    // Real-time price updates every 30 seconds
    const priceUpdateInterval = setInterval(async () => {
      if (alpacaService.isAlpacaConnected()) {
        // Fetch fresh quotes
        const allStocks = sectorData.flatMap(sector =>
          sector.topStocks.map(stock => stock.symbol)
        );

        const quotes = await Promise.all(
          allStocks.map(async (symbol) => {
            try {
              const quote = await alpacaService.getQuote(symbol);
              return { symbol, ...quote };
            } catch (error) {
              return null;
            }
          })
        );

        const quotesMap = {};
        quotes.filter(q => q).forEach(quote => {
          quotesMap[quote.symbol] = quote;
        });
        setRealTimeData(quotesMap);

        // Update sector data
        setSectorData(prevData =>
          prevData.map(sector => ({
            ...sector,
            performance: sector.topStocks.reduce((avg, stock) => {
              const quote = quotesMap[stock.symbol];
              return avg + (quote ? quote.changePercent : stock.change);
            }, 0) / sector.topStocks.length,
            topStocks: sector.topStocks.map(stock => {
              const realQuote = quotesMap[stock.symbol];
              return realQuote ? {
                ...stock,
                price: realQuote.price,
                change: realQuote.changePercent,
                volume: realQuote.volume || stock.volume
              } : stock;
            })
          }))
        );
      } else {
        // Fallback to simulated updates
        setSectorData(prevData =>
          prevData.map(sector => ({
            ...sector,
            performance: sector.performance + (Math.random() - 0.5) * 0.1,
            topStocks: sector.topStocks.map(stock => ({
              ...stock,
              price: stock.price + (Math.random() - 0.5) * 10,
              change: stock.change + (Math.random() - 0.5) * 0.2
            }))
          }))
        );
      }
    }, 30000); // Update every 30 seconds

    return () => {
      unsubscribe();
      clearInterval(priceUpdateInterval);
    };
  }, []);

  const handleSectorClick = (sector) => {
    setSelectedSector(sector);
    setSectorStocks(sector.topStocks);
  };

  // Trading functions with enhanced error handling and real-time updates
  const handleBuyStock = async (stock) => {
    try {
      if (!isAlpacaConnected) {
        // Alpaca service auto-initializes, just wait a moment
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAlpacaConnected(alpacaService.isAlpacaConnected());
        if (!alpacaService.isAlpacaConnected()) {
          notificationService.notifySystem('Alpaca service is initializing...', 'info');
          return;
        }
      }

      // Get current quote before placing order
      let currentPrice = stock.price;
      try {
        const quote = await alpacaService.getQuote(stock.symbol);
        if (quote && quote.price) {
          currentPrice = quote.price;
        }
      } catch (quoteError) {
        console.warn('Could not fetch real-time quote, using cached price:', quoteError);
      }

      const orderValue = currentPrice * orderQuantity;

      // Confirm order with user
      const confirmed = window.confirm(
        `Place BUY order for ${orderQuantity} shares of ${stock.symbol} at $${currentPrice.toFixed(2)}?\nTotal: $${orderValue.toFixed(2)}`
      );

      if (!confirmed) return;

      // Place the order
      const order = await alpacaService.placeMarketOrder(stock.symbol, orderQuantity, 'buy');

      if (order) {
        notificationService.notifyTrade(
          `✅ Buy order placed: ${orderQuantity} shares of ${stock.symbol} at $${currentPrice.toFixed(2)}`,
          'success'
        );

        // Update local state to reflect the order
        setOrderHistory(prev => [...prev, {
          id: order.id || Date.now(),
          symbol: stock.symbol,
          type: 'buy',
          quantity: orderQuantity,
          price: currentPrice,
          timestamp: new Date(),
          status: order.status || 'pending'
        }]);

        // Refresh positions and orders
        setTimeout(() => {
          if (alpacaService.isAlpacaConnected()) {
            const positions = alpacaService.getPositions();
            const orders = alpacaService.getOrders();
            setOrderHistory(orders || []);
          }
        }, 2000);
      } else {
        throw new Error('Order placement failed - no response from broker');
      }

    } catch (error) {
      console.error('Buy order error:', error);
      notificationService.notifyTrade(
        `❌ Failed to place buy order for ${stock.symbol}: ${error.message || 'Unknown error'}`,
        'error'
      );
    }
  };

  const handleSellStock = async (stock) => {
    try {
      if (!isAlpacaConnected) {
        // Alpaca service auto-initializes, just wait a moment
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAlpacaConnected(alpacaService.isAlpacaConnected());
        if (!alpacaService.isAlpacaConnected()) {
          notificationService.notifySystem('Alpaca service is initializing...', 'info');
          return;
        }
      }

      // Check if user has positions in this stock
      const positions = await alpacaService.getPositions();
      const position = positions.find(p => p.symbol === stock.symbol);

      if (!position || position.qty < orderQuantity) {
        notificationService.notifySystem(
          `Insufficient shares: You have ${position ? position.qty : 0} shares of ${stock.symbol}`,
          'warning'
        );
        return;
      }

      // Get current quote before placing order
      const quote = await alpacaService.getQuote(stock.symbol);
      const currentPrice = quote ? quote.price : stock.price;

      const orderValue = currentPrice * orderQuantity;

      // Confirm order with user
      const confirmed = window.confirm(
        `Place SELL order for ${orderQuantity} shares of ${stock.symbol} at ₹${currentPrice}?\nTotal: ₹${orderValue.toLocaleString()}`
      );

      if (!confirmed) return;

      const order = await alpacaService.placeMarketOrder(stock.symbol, orderQuantity, 'sell');
      notificationService.notifyTrade(
        `✅ Sell order placed: ${orderQuantity} shares of ${stock.symbol} at ₹${currentPrice}`,
        'success'
      );

      // Update local state to reflect the order
      setOrderHistory(prev => [...prev, {
        id: order.id || Date.now(),
        symbol: stock.symbol,
        type: 'sell',
        quantity: orderQuantity,
        price: currentPrice,
        timestamp: new Date(),
        status: 'pending'
      }]);

    } catch (error) {
      console.error('Sell order error:', error);
      notificationService.notifyTrade(`❌ Failed to place sell order for ${stock.symbol}: ${error.message}`, 'error');
    }
  };

  const handleWatchStock = async (stock) => {
    try {
      if (watchlist.includes(stock.symbol)) {
        setWatchlist(prev => prev.filter(s => s !== stock.symbol));
        await alpacaService.removeFromWatchlist(stock.symbol);
        notificationService.notifySystem(`👁️ ${stock.symbol} removed from watchlist`, 'info');
      } else {
        setWatchlist(prev => [...prev, stock.symbol]);
        await alpacaService.addToWatchlist(stock.symbol);
        notificationService.notifySystem(`👁️ ${stock.symbol} added to watchlist`, 'success');
      }
    } catch (error) {
      console.error('Watchlist error:', error);
      notificationService.notifySystem(`Failed to update watchlist for ${stock.symbol}`, 'error');
    }
  };

  const getPerformanceColor = (performance) => {
    return performance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getPerformanceIcon = (performance) => {
    return performance >= 0 ? '📈' : '📉';
  };

  return (
    <PageLayout
      title="🎯 Sector Scope"
      subtitle="Analyze sector performance and explore stocks by sector"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Active Sectors</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-green-600">+2.3%</div>
            <div className="text-sm text-gray-600">Avg Performance</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">₹45.2L Cr</div>
            <div className="text-sm text-gray-600">Total Market Cap</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">{currentTime.toLocaleTimeString()}</div>
            <div className="text-sm text-gray-600">Last Updated</div>
          </div>
        </div>

      {/* Sector Performance Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Sector Performance Overview
        </h3>

        <div className="space-y-4">
          {sectorData.map((sector, index) => (
            <div
              key={sector.name}
              onClick={() => handleSectorClick(sector)}
              className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{sector.icon}</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{sector.name}</h4>
                    <p className="text-sm text-gray-600">
                      {sector.stocks} stocks • {sector.marketCap}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Performance Bar */}
                  <div className="w-32 bg-gray-200 rounded-full h-3 relative">
                    <div
                      className="h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(Math.abs(sector.performance) * 20, 100)}%`,
                        backgroundColor: sector.color,
                        opacity: 0.8
                      }}
                    ></div>
                  </div>

                  {/* Performance Value */}
                  <div className="text-right min-w-[80px]">
                    <div className={`font-bold ${getPerformanceColor(sector.performance)}`}>
                      {getPerformanceIcon(sector.performance)} {sector.performance > 0 ? '+' : ''}{sector.performance}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Sector Details */}
      {selectedSector && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <span className="mr-3 text-2xl">{selectedSector.icon}</span>
              {selectedSector.name} - Top Stocks
            </h3>
            <button
              onClick={() => setSelectedSector(null)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectorStocks.map((stock, index) => (
              <div
                key={stock.symbol}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{stock.symbol}</h4>
                  <span className={`text-sm font-medium ${getPerformanceColor(stock.change)}`}>
                    {stock.change > 0 ? '+' : ''}{stock.change}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium">₹{stock.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Volume:</span>
                    <span className="font-medium">{stock.volume}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quantity:</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={orderQuantity}
                      onChange={(e) => setOrderQuantity(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                    />
                  </div>

                  {/* Trading Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleBuyStock(stock)}
                      disabled={!isAlpacaConnected}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        isAlpacaConnected
                          ? 'bg-green-500 text-white hover:bg-green-600 hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      💰 Buy
                    </button>
                    <button
                      onClick={() => handleSellStock(stock)}
                      disabled={!isAlpacaConnected}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        isAlpacaConnected
                          ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      📉 Sell
                    </button>
                    <button
                      onClick={() => handleWatchStock(stock)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        watchlist.includes(stock.symbol)
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
                      }`}
                    >
                      {watchlist.includes(stock.symbol) ? '⭐ Watching' : '👁️ Watch'}
                    </button>
                  </div>

                  {!isAlpacaConnected && (
                    <div className="text-xs text-orange-600 text-center mt-1">
                      Connect to Alpaca to enable trading
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sector Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold" style={{ color: selectedSector.color }}>
                  {selectedSector.stocks}
                </div>
                <div className="text-sm text-gray-600">Total Stocks</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: selectedSector.color }}>
                  {selectedSector.marketCap}
                </div>
                <div className="text-sm text-gray-600">Market Cap</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${getPerformanceColor(selectedSector.performance)}`}>
                  {selectedSector.performance > 0 ? '+' : ''}{selectedSector.performance}%
                </div>
                <div className="text-sm text-gray-600">Performance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(Math.random() * 50 + 10)}
                </div>
                <div className="text-sm text-gray-600">Active Traders</div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </PageLayout>
  );
};

export default SectorScope;
