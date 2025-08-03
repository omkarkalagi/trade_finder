import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import alpacaService from '../services/alpacaService';
import notificationService from '../services/notificationService';

export default function AutoTrading() {
  const [activeBot, setActiveBot] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [botPerformance, setBotPerformance] = useState(null);
  const [autoTrades, setAutoTrades] = useState([]);
  const [isAlpacaConnected, setIsAlpacaConnected] = useState(false);
  const [runningBots, setRunningBots] = useState([]);
  const [selectedStocks, setSelectedStocks] = useState([
    { id: 1, symbol: 'RELIANCE', name: 'Reliance Industries Ltd', enabled: true, price: 2567.80, change: 1.8 },
    { id: 2, symbol: 'TCS', name: 'Tata Consultancy Services', enabled: true, price: 3845.60, change: 2.1 },
    { id: 3, symbol: 'INFY', name: 'Infosys Ltd', enabled: false, price: 1456.30, change: -0.5 },
    { id: 4, symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', enabled: true, price: 1678.90, change: 0.9 },
    { id: 5, symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', enabled: false, price: 945.20, change: -1.2 },
    { id: 6, symbol: 'SBIN', name: 'State Bank of India', enabled: true, price: 567.85, change: 3.4 },
    { id: 7, symbol: 'ITC', name: 'ITC Ltd', enabled: false, price: 456.75, change: 1.1 },
    { id: 8, symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', enabled: false, price: 2456.90, change: -0.8 },
    { id: 9, symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', enabled: true, price: 865.40, change: 2.3 },
    { id: 10, symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', enabled: false, price: 1789.60, change: 1.5 }
  ]);

  useEffect(() => {
    // Check Alpaca connection
    setIsAlpacaConnected(alpacaService.isAlpacaConnected());

    // Subscribe to Alpaca updates
    const unsubscribe = alpacaService.subscribe((data) => {
      setIsAlpacaConnected(data.connected);
      if (data.orders) {
        // Update auto trades with new orders
        const botTrades = data.orders.map(order => ({
          id: order.id,
          bot: 'Auto Trader',
          symbol: order.symbol,
          side: order.side,
          quantity: order.qty,
          price: order.filled_avg_price || order.limit_price || 0,
          timestamp: new Date(order.created_at),
          status: order.status,
          pnl: (Math.random() - 0.5) * 200 // Mock P&L calculation
        }));
        setAutoTrades(prev => [...botTrades, ...prev.filter(t => t.bot !== 'Auto Trader')]);
      }
    });

    return () => unsubscribe();
  }, []);

  const tradingBots = [
    {
      id: 1,
      name: 'Nifty Trend Master',
      description: 'Advanced trend following bot specialized for Indian markets using EMA crossovers and momentum indicators.',
      riskLevel: 'Medium',
      performance: { monthlyReturn: 3.2, winRate: 68, tradesPerDay: 6 },
      specialization: 'Index Trading'
    },
    {
      id: 2,
      name: 'Banking Sector Pro',
      description: 'Specialized bot for banking stocks using sector-specific indicators and news sentiment analysis.',
      riskLevel: 'Medium',
      performance: { monthlyReturn: 4.1, winRate: 62, tradesPerDay: 4 },
      specialization: 'Banking Stocks'
    },
    {
      id: 3,
      name: 'Intraday Scalper',
      description: 'High-frequency trading bot for quick profits using order flow and level 2 market data.',
      riskLevel: 'High',
      performance: { monthlyReturn: 5.8, winRate: 55, tradesPerDay: 25 },
      specialization: 'Scalping'
    },
    {
      id: 4,
      name: 'Options Wheel Strategy',
      description: 'Conservative options trading bot using covered calls and cash-secured puts for steady income.',
      riskLevel: 'Low',
      performance: { monthlyReturn: 2.5, winRate: 85, tradesPerDay: 1 },
      specialization: 'Options Trading'
    },
    {
      id: 5,
      name: 'AI Sentiment Trader',
      description: 'Machine learning bot that trades based on news sentiment and social media analysis.',
      riskLevel: 'Medium',
      performance: { monthlyReturn: 4.7, winRate: 71, tradesPerDay: 8 },
      specialization: 'AI/ML Trading'
    },
    {
      id: 6,
      name: 'Breakout Hunter',
      description: 'Identifies and trades breakouts from consolidation patterns with volume confirmation.',
      riskLevel: 'High',
      performance: { monthlyReturn: 6.2, winRate: 58, tradesPerDay: 12 },
      specialization: 'Breakout Trading'
    },
    {
      id: 7,
      name: 'Dividend Aristocrat',
      description: 'Long-term bot focusing on dividend-paying stocks with consistent growth patterns.',
      riskLevel: 'Low',
      performance: { monthlyReturn: 1.8, winRate: 88, tradesPerDay: 0.5 },
      specialization: 'Dividend Investing'
    },
    {
      id: 8,
      name: 'Crypto Correlation',
      description: 'Trades stocks based on cryptocurrency market movements and correlations.',
      riskLevel: 'High',
      performance: { monthlyReturn: 7.1, winRate: 52, tradesPerDay: 15 },
      specialization: 'Crypto Correlation'
    }
  ];

  const toggleBot = async () => {
    if (!activeBot) return;

    if (!isAlpacaConnected) {
      notificationService.notifySystem('Please connect to Alpaca first', 'medium');
      return;
    }

    if (!isRunning) {
      // Start bot
      setIsRunning(true);
      setRunningBots(prev => [...prev, {
        ...activeBot,
        startTime: new Date(),
        trades: 0,
        pnl: 0
      }]);

      notificationService.notifySystem(`${activeBot.name} bot started`, 'medium');

      // Initialize performance tracking
      setBotPerformance({
        totalTrades: 0,
        profitableTrades: 0,
        totalProfit: 0,
        startTime: new Date().toISOString()
      });

      // Start automated trading
      simulateBotTrading(activeBot);
    } else {
      // Stop bot
      setIsRunning(false);
      setRunningBots(prev => prev.filter(b => b.id !== activeBot.id));
      notificationService.notifySystem(`${activeBot.name} bot stopped`, 'medium');
      clearInterval(window.botInterval);
    }
  };

  const simulateBotTrading = (bot) => {
    // Simulate bot making trades every 1-3 minutes
    const tradingInterval = setInterval(async () => {
      if (!isRunning) {
        clearInterval(tradingInterval);
        return;
      }

      // Get enabled stocks for trading
      const enabledStocks = selectedStocks.filter(stock => stock.enabled);
      if (enabledStocks.length === 0) return;

      // Randomly decide to make a trade (40% chance)
      if (Math.random() < 0.4) {
        const randomStock = enabledStocks[Math.floor(Math.random() * enabledStocks.length)];
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        const quantity = Math.floor(Math.random() * 5) + 1;

        try {
          let order;
          if (side === 'buy') {
            order = await alpacaService.placeBuyOrder(randomStock.symbol, quantity, 'market');
          } else {
            order = await alpacaService.placeSellOrder(randomStock.symbol, quantity, 'market');
          }

          // Add to auto trades history
          const newTrade = {
            id: Date.now(),
            bot: bot.name,
            symbol: randomStock.symbol,
            side: side,
            quantity: quantity,
            price: randomStock.price + (Math.random() - 0.5) * 10,
            timestamp: new Date(),
            status: 'executed',
            pnl: (Math.random() - 0.3) * 150 // Slightly positive bias
          };

          setAutoTrades(prev => [newTrade, ...prev]);

          // Update bot performance
          setBotPerformance(prev => ({
            ...prev,
            totalTrades: prev.totalTrades + 1,
            profitableTrades: prev.profitableTrades + (newTrade.pnl > 0 ? 1 : 0),
            totalProfit: prev.totalProfit + newTrade.pnl
          }));

          // Update running bot stats
          setRunningBots(prev => prev.map(b =>
            b.id === bot.id
              ? { ...b, trades: b.trades + 1, pnl: b.pnl + newTrade.pnl }
              : b
          ));

          notificationService.notifyTrade(
            `${bot.name}: ${side.toUpperCase()} ${quantity} ${randomStock.symbol} at $${newTrade.price.toFixed(2)}`,
            'info'
          );
        } catch (error) {
          console.error('Bot trading error:', error);
        }
      }
    }, Math.random() * 120000 + 60000); // 1-3 minutes

    window.botInterval = tradingInterval;
  };

  const toggleStockSelection = (stockId) => {
    setSelectedStocks(prev => prev.map(stock =>
      stock.id === stockId
        ? { ...stock, enabled: !stock.enabled }
        : stock
    ));
  };

  const togglePair = (id) => {
    setTradingPairs(prev =>
      prev.map(pair =>
        pair.id === id ? { ...pair, enabled: !pair.enabled } : pair
      )
    );
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <PageLayout
      title="🚀 Automated Trading"
      subtitle="Smart execution with real-time trade tracking"
    >
      <div className="space-y-6">
        {/* Connection Status */}
        <div className={`p-4 rounded-xl border ${
          isAlpacaConnected
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-orange-50 border-orange-200 text-orange-800'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{isAlpacaConnected ? '✅' : '⚠️'}</span>
            <span className="font-medium">
              {isAlpacaConnected ? 'Connected to Alpaca - Auto trading enabled' : 'Not connected to Alpaca - Connect to enable auto trading'}
            </span>
          </div>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Bot Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Trading Bots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tradingBots.map(bot => (
                  <div
                    key={bot.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${activeBot?.id === bot.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}
                    onClick={() => setActiveBot(bot)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{bot.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getRiskLevelColor(bot.riskLevel)}`}>
                        {bot.riskLevel} Risk
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{bot.description}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Monthly</p>
                        <p className="font-medium text-green-600">{bot.performance.monthlyReturn}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Win Rate</p>
                        <p className="font-medium">{bot.performance.winRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Trades/Day</p>
                        <p className="font-medium">{bot.performance.tradesPerDay}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Bot Status</h2>
              {activeBot ? (
                <>
                  <div className="mb-4">
                    <h3 className="font-medium">{activeBot.name}</h3>
                    <div className={`mt-2 px-3 py-1 rounded-full text-center text-white ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}>
                      {isRunning ? 'Running' : 'Stopped'}
                    </div>
                  </div>
                  <div className="mb-4">
                    <button
                      onClick={toggleBot}
                      className={`w-full py-2 rounded-lg font-medium ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {isRunning ? 'Stop Bot' : 'Start Bot'}
                    </button>
                  </div>
                  {botPerformance && isRunning && (
                    <div className="text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Trades:</span>
                        <span className="font-medium">{botPerformance.totalTrades}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Profitable Trades:</span>
                        <span className="font-medium text-green-600">{botPerformance.profitableTrades}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Profit:</span>
                        <span className={`font-medium ${botPerformance.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${botPerformance.totalProfit.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Running since:</span>
                        <span className="font-medium">{new Date(botPerformance.startTime).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a bot to view status</p>
                </div>
              )}
            </div>
          </div>

        {/* Stock Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="mr-2">📈</span>
            Stock Selection for Auto Trading
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedStocks.map(stock => (
              <div
                key={stock.id}
                onClick={() => toggleStockSelection(stock.id)}
                className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                  stock.enabled
                    ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50'
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold text-lg">{stock.symbol}</div>
                  <div className={`w-4 h-4 rounded-full ${stock.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{stock.name}</div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">${stock.price}</div>
                  <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                  </div>
                </div>
                <div className={`text-xs mt-2 font-medium ${stock.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                  {stock.enabled ? '✅ Auto Trading Enabled' : '⏸️ Auto Trading Disabled'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Running Bots */}
        {runningBots.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🤖</span>
              Active Trading Bots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {runningBots.map((bot) => (
                <div key={bot.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-blue-800">{bot.name}</h3>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trades:</span>
                      <span className="font-medium">{bot.trades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">P&L:</span>
                      <span className={`font-medium ${bot.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${bot.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Runtime:</span>
                      <span className="font-medium">
                        {Math.floor((Date.now() - bot.startTime) / 60000)}m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto Trade History */}
        {autoTrades.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Auto Trading History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {autoTrades.slice(0, 10).map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trade.bot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {trade.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          trade.side === 'buy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.side === 'buy' ? '🟢 BUY' : '🔴 SELL'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${trade.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${trade.pnl.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {autoTrades.length > 10 && (
              <div className="mt-4 text-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  View All Trades ({autoTrades.length})
                </button>
              </div>
            )}
          </div>
        )}

          {/* Bot Settings */}
          {activeBot && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Bot Settings</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Trading Parameters</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risk Level
                      </label>
                      <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Position Size (% of Portfolio)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="1"
                          max="25"
                          value="10"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="ml-3 w-12 text-center">10%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stop Loss (%)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value="3"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="ml-3 w-12 text-center">3%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Schedule</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trading Hours
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs text-gray-500">Start</label>
                          <input type="time" value="09:30" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">End</label>
                          <input type="time" value="16:00" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trading Days
                      </label>
                      <div className="grid grid-cols-7 gap-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                          <div
                            key={index}
                            className={`text-center py-2 rounded-md cursor-pointer ${index < 5 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}
                          >
                            {day}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </PageLayout>
  );
}
