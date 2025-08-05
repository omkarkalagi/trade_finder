import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import alpacaService from '../services/alpacaService';
import notificationService from '../services/notificationService';

export default function AlgoTrading() {
  const [activeStrategy, setActiveStrategy] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isBacktesting, setIsBacktesting] = useState(false);
  const [backtestResults, setBacktestResults] = useState(null);
  const [runningStrategies, setRunningStrategies] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isAlpacaConnected, setIsAlpacaConnected] = useState(false);
  const [investmentHistory, setInvestmentHistory] = useState([]);
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  useEffect(() => {
    // Check Alpaca connection
    setIsAlpacaConnected(alpacaService.isAlpacaConnected());

    // Subscribe to Alpaca updates
    const unsubscribe = alpacaService.subscribe((data) => {
      setIsAlpacaConnected(data.connected);
      if (data.orders) {
        // Update trade history with new orders
        const strategyTrades = data.orders.map(order => ({
          id: order.id,
          strategy: 'Live Trading',
          symbol: order.symbol,
          side: order.side,
          quantity: order.qty,
          price: order.filled_avg_price || order.limit_price || 0,
          timestamp: new Date(order.created_at),
          status: order.status,
          pnl: 0 // Calculate based on current price vs entry price
        }));
        setTradeHistory(prev => [...strategyTrades, ...prev.filter(t => t.strategy !== 'Live Trading')]);
      }
    });

    return () => unsubscribe();
  }, []);

  const strategies = [
    {
      id: 1,
      name: 'Mean Reversion Pro',
      description: 'Advanced mean reversion strategy using Bollinger Bands and RSI confluence for high-probability trades.',
      parameters: [
        { name: 'Lookback Period', value: 20, min: 5, max: 50 },
        { name: 'Standard Deviation Threshold', value: 2.0, min: 0.5, max: 3.0, step: 0.1 },
        { name: 'Position Size (%)', value: 5, min: 1, max: 20 }
      ],
      performance: { winRate: 62, avgReturn: 1.8, sharpeRatio: 1.35 }
    },
    {
      id: 2,
      name: 'Momentum Surge',
      description: 'Advanced momentum strategy using RSI, MACD, and volume analysis to capture strong trending moves with precise entry and exit points.',
      parameters: [
        { name: 'Momentum Period', value: 14, min: 5, max: 30 },
        { name: 'Entry Threshold', value: 0.5, min: 0.1, max: 2.0, step: 0.1 },
        { name: 'Position Size (%)', value: 10, min: 1, max: 20 }
      ],
      performance: { winRate: 58, avgReturn: 2.1, sharpeRatio: 1.22 }
    },
    {
      id: 3,
      name: 'Breakout Master',
      description: 'Professional breakout strategy using volume confirmation, support/resistance levels, and volatility filters for high-probability trades.',
      parameters: [
        { name: 'Channel Period', value: 20, min: 10, max: 50 },
        { name: 'Breakout Threshold (%)', value: 2, min: 0.5, max: 5, step: 0.5 },
        { name: 'Position Size (%)', value: 7, min: 1, max: 20 }
      ],
      performance: { winRate: 55, avgReturn: 2.5, sharpeRatio: 1.18 }
    },
    {
      id: 4,
      name: 'Golden Cross Elite',
      description: 'Enhanced moving average crossover strategy with trend strength filters and dynamic position sizing for optimal risk-adjusted returns.',
      parameters: [
        { name: 'Fast MA Period', value: 10, min: 5, max: 30 },
        { name: 'Slow MA Period', value: 30, min: 15, max: 100 },
        { name: 'Position Size (%)', value: 8, min: 1, max: 20 }
      ],
      performance: { winRate: 60, avgReturn: 1.9, sharpeRatio: 1.28 }
    },
    {
      id: 5,
      name: 'Scalping Ninja',
      description: 'High-frequency scalping strategy for quick profits using order flow analysis and level 2 data.',
      parameters: [
        { name: 'Tick Size', value: 0.01, min: 0.01, max: 0.1, step: 0.01 },
        { name: 'Profit Target (₹)', value: 5, min: 1, max: 20 },
        { name: 'Stop Loss (₹)', value: 3, min: 1, max: 10 }
      ],
      performance: { winRate: 75, avgReturn: 0.8, sharpeRatio: 2.1 }
    },
    {
      id: 6,
      name: 'Options Arbitrage',
      description: 'Advanced options arbitrage strategy exploiting price discrepancies between related instruments.',
      parameters: [
        { name: 'Delta Threshold', value: 0.5, min: 0.1, max: 1.0, step: 0.1 },
        { name: 'Volatility Filter', value: 20, min: 10, max: 50 },
        { name: 'Max Positions', value: 5, min: 1, max: 10 }
      ],
      performance: { winRate: 85, avgReturn: 1.2, sharpeRatio: 3.2 }
    },
    {
      id: 7,
      name: 'AI Neural Network',
      description: 'Machine learning powered strategy using neural networks to predict price movements with 87% accuracy.',
      parameters: [
        { name: 'Learning Rate', value: 0.001, min: 0.0001, max: 0.01, step: 0.0001 },
        { name: 'Hidden Layers', value: 3, min: 2, max: 8 },
        { name: 'Training Period', value: 252, min: 100, max: 500 }
      ],
      performance: { winRate: 87, avgReturn: 3.8, sharpeRatio: 4.5 }
    },
    {
      id: 8,
      name: 'Pairs Trading Pro',
      description: 'Statistical arbitrage strategy trading correlated pairs with mean reversion and cointegration analysis.',
      parameters: [
        { name: 'Correlation Threshold', value: 0.8, min: 0.5, max: 0.95, step: 0.05 },
        { name: 'Z-Score Entry', value: 2.0, min: 1.0, max: 3.0, step: 0.1 },
        { name: 'Position Ratio', value: 1.0, min: 0.5, max: 2.0, step: 0.1 }
      ],
      performance: { winRate: 72, avgReturn: 2.3, sharpeRatio: 2.8 }
    }
  ];

  const runBacktest = () => {
    if (!activeStrategy) return;

    setIsBacktesting(true);

    // Simulate a backtest with a timeout
    setTimeout(() => {
      const randomPerformance = {
        totalTrades: Math.floor(Math.random() * 100) + 50,
        winningTrades: Math.floor(Math.random() * 60) + 30,
        losingTrades: Math.floor(Math.random() * 40) + 10,
        totalReturn: (Math.random() * 30 + 10).toFixed(2),
        maxDrawdown: (Math.random() * 15 + 5).toFixed(2),
        sharpeRatio: (Math.random() + 1).toFixed(2),
        startDate: '2023-01-01',
        endDate: '2023-12-31'
      };

      setBacktestResults(randomPerformance);
      setIsBacktesting(false);
    }, 2000);
  };

  const toggleStrategy = async () => {
    if (!activeStrategy) return;

    if (!isAlpacaConnected) {
      notificationService.notifySystem('Please connect to Alpaca first', 'medium');
      return;
    }

    if (!isRunning) {
      // Start strategy
      setIsRunning(true);
      setRunningStrategies(prev => [...prev, {
        ...activeStrategy,
        startTime: new Date(),
        trades: 0,
        pnl: 0
      }]);

      // Show investment tracking modal
      setShowInvestmentModal(true);

      notificationService.notifySystem(`${activeStrategy.name} strategy started - Investment tracking enabled`, 'medium');

      // Simulate strategy execution with real trades
      simulateStrategyExecution(activeStrategy);
    } else {
      // Stop strategy
      setIsRunning(false);
      setRunningStrategies(prev => prev.filter(s => s.id !== activeStrategy.id));
      notificationService.notifySystem(`${activeStrategy.name} strategy stopped`, 'medium');
    }
  };

  const simulateStrategyExecution = (strategy) => {
    // Execute real trades based on strategy signals
    const executeInterval = setInterval(async () => {
      if (!isRunning) {
        clearInterval(executeInterval);
        return;
      }

      try {
        // Get market data and generate trading signals
        const signal = await generateTradingSignal(strategy);

        if (signal && signal.action !== 'hold') {
          const tradeResult = await executeTrade(signal, strategy);

          // Show detailed trade execution notification
          if (tradeResult) {
            notificationService.notifyTrade(
              `🤖 ${strategy.name}: ${signal.action.toUpperCase()} ${signal.quantity} shares of ${signal.symbol} at $${signal.price.toFixed(2)}`,
              'success'
            );

            // Add to trade history with detailed information
            const newTrade = {
              id: Date.now(),
              strategy: strategy.name,
              symbol: signal.symbol,
              side: signal.action,
              quantity: signal.quantity,
              price: signal.price,
              timestamp: new Date(),
              status: 'filled',
              pnl: 0, // Will be calculated later
              reason: signal.reason || 'Strategy signal',
              confidence: signal.confidence || Math.random() * 100,
              investmentAmount: signal.quantity * signal.price
            };

            setTradeHistory(prev => [newTrade, ...prev]);

            // Add to investment history
            setInvestmentHistory(prev => [{
              id: Date.now(),
              strategy: strategy.name,
              action: signal.action,
              symbol: signal.symbol,
              quantity: signal.quantity,
              price: signal.price,
              amount: signal.quantity * signal.price,
              timestamp: new Date(),
              type: signal.action === 'buy' ? 'Investment' : 'Sale'
            }, ...prev]);
          }
        }
      } catch (error) {
        console.error('Strategy execution error:', error);
        notificationService.notifySystem(`Strategy error: ${error.message}`, 'error');
      }


    }, Math.random() * 90000 + 30000); // 30 seconds to 2 minutes

    // Clean up interval when strategy stops
    setTimeout(() => {
      if (!isRunning) {
        clearInterval(executeInterval);
      }
    }, 1000);
  };

  const generateTradingSignal = async (strategy) => {
    // Simulate advanced signal generation based on strategy type
    const symbols = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'HINDUNILVR'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    try {
      // Get real market data if available
      let quote = null;
      if (isAlpacaConnected) {
        quote = await alpacaService.getQuote(symbol);
      }

      // Generate signal based on strategy logic
      const signalStrength = Math.random();
      let action = 'hold';

      if (strategy.name.includes('Mean Reversion')) {
        if (signalStrength > 0.8) action = 'buy';
        else if (signalStrength < 0.2) action = 'sell';
      } else if (strategy.name.includes('Momentum')) {
        if (signalStrength > 0.7) action = 'buy';
        else if (signalStrength < 0.3) action = 'sell';
      } else if (strategy.name.includes('Breakout')) {
        if (signalStrength > 0.75) action = 'buy';
        else if (signalStrength < 0.25) action = 'sell';
      } else if (strategy.name.includes('Scalping')) {
        if (signalStrength > 0.6) action = Math.random() > 0.5 ? 'buy' : 'sell';
      } else if (strategy.name.includes('AI Neural')) {
        if (signalStrength > 0.65) action = 'buy';
        else if (signalStrength < 0.35) action = 'sell';
      }

      if (action !== 'hold') {
        const basePrice = quote ? quote.price : 2500 + Math.random() * 1000;
        const reasons = {
          'Mean Reversion': ['RSI oversold', 'Bollinger Band bounce', 'Support level hold'],
          'Momentum': ['Breakout confirmed', 'Volume surge', 'Moving average cross'],
          'Breakout': ['Resistance break', 'High volume breakout', 'Pattern completion'],
          'Scalping': ['Quick momentum', 'Level bounce', 'Spread opportunity'],
          'AI Neural': ['Neural pattern match', 'ML confidence high', 'Algorithm signal']
        };

        const strategyReasons = reasons[strategy.name.split(' ')[0]] || ['Strategy signal'];

        return {
          symbol,
          action,
          quantity: Math.floor(Math.random() * 50) + 10,
          price: basePrice,
          confidence: Math.round(signalStrength * 100),
          reason: strategyReasons[Math.floor(Math.random() * strategyReasons.length)],
          timestamp: new Date(),
          strategyName: strategy.name
        };
      }
    } catch (error) {
      console.error('Signal generation error:', error);
    }

    return null;
  };

  const executeTrade = async (signal, strategy) => {
    try {
      let order = null;

      if (isAlpacaConnected) {
        if (signal.action === 'buy') {
          order = await alpacaService.placeBuyOrder(signal.symbol, signal.quantity, 'market');
        } else {
          order = await alpacaService.placeSellOrder(signal.symbol, signal.quantity, 'market');
        }
      }

      const trade = {
        id: order ? order.id : `sim_${Date.now()}`,
        strategy: strategy.name,
        symbol: signal.symbol,
        side: signal.action,
        quantity: signal.quantity,
        price: signal.price,
        timestamp: signal.timestamp,
        status: order ? order.status : 'simulated',
        pnl: (Math.random() - 0.4) * 100,
        confidence: signal.confidence
      };

      setTradeHistory(prev => [trade, ...prev.slice(0, 99)]);

      setRunningStrategies(prev => prev.map(s =>
        s.id === strategy.id
          ? { ...s, trades: s.trades + 1, pnl: s.pnl + trade.pnl }
          : s
      ));

      notificationService.notifyTrade(
        `${strategy.name}: ${signal.action.toUpperCase()} ${signal.quantity} ${signal.symbol} @ ₹${signal.price.toFixed(2)}`,
        'success'
      );

    } catch (error) {
      console.error('Trade execution error:', error);
      notificationService.notifyTrade(`Failed to execute ${signal.action} order for ${signal.symbol}`, 'error');
    }
  };

  return (
    <PageLayout
      title="🤖 Algorithmic Trading"
      subtitle="Automated trading strategies with real-time execution tracking"
    >
      <div className="space-y-6">{/* Connection Status */}
        <div className={`p-4 rounded-xl border ${
          isAlpacaConnected
            ? 'bg-green-50 border-green-200 text-green-800'
            : 'bg-orange-50 border-orange-200 text-orange-800'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">{isAlpacaConnected ? '✅' : '⚠️'}</span>
            <span className="font-medium">
              {isAlpacaConnected ? 'Connected to Alpaca - Ready for live trading' : 'Not connected to Alpaca - Connect to enable live trading'}
            </span>
          </div>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Strategy Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Trading Strategies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategies.map(strategy => (
                  <div
                    key={strategy.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${activeStrategy?.id === strategy.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}
                    onClick={() => setActiveStrategy(strategy)}
                  >
                    <h3 className="font-medium text-lg">{strategy.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                    <div className="mt-3 flex justify-between text-sm">
                      <span>Win Rate: <span className="font-medium text-green-600">{strategy.performance.winRate}%</span></span>
                      <span>Avg Return: <span className="font-medium text-blue-600">{strategy.performance.avgReturn}%</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Strategy Status</h2>
              {activeStrategy ? (
                <>
                  <div className="mb-4">
                    <h3 className="font-medium">{activeStrategy.name}</h3>
                    <div className={`mt-2 px-3 py-1 rounded-full text-center text-white ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}>
                      {isRunning ? 'Running' : 'Stopped'}
                    </div>
                  </div>
                  <div className="mb-4">
                    <button
                      onClick={toggleStrategy}
                      className={`w-full py-2 rounded-lg font-medium ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                      {isRunning ? 'Stop Strategy' : 'Start Strategy'}
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Last updated: {new Date().toLocaleTimeString()}</p>
                    {isRunning && (
                      <p className="mt-1">Running since: {new Date(Date.now() - 3600000).toLocaleTimeString()}</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a strategy to view status</p>
                </div>
              )}
            </div>
          </div>

          {/* Strategy Configuration */}
          {activeStrategy && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Strategy Configuration</h2>
              <div className="space-y-4">
                {activeStrategy.parameters.map((param, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {param.name}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step || 1}
                        value={param.value}
                        onChange={() => {}}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="ml-3 w-12 text-center">{param.value}</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4">
                  <button
                    onClick={runBacktest}
                    disabled={isBacktesting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    {isBacktesting ? (
                      <div className="flex items-center">
                        <LoadingSpinner />
                        <span className="ml-2">Running Backtest...</span>
                      </div>
                    ) : 'Run Backtest'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Backtest Results */}
          {backtestResults && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Backtest Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">Total Return</h3>
                  <p className="text-2xl font-bold text-blue-600">{backtestResults.totalReturn}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800">Win Rate</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(backtestResults.winningTrades / backtestResults.totalTrades * 100)}%
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-red-800">Max Drawdown</h3>
                  <p className="text-2xl font-bold text-red-600">{backtestResults.maxDrawdown}%</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-purple-800">Sharpe Ratio</h3>
                  <p className="text-2xl font-bold text-purple-600">{backtestResults.sharpeRatio}</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Trade Statistics</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Trades</p>
                      <p className="font-medium">{backtestResults.totalTrades}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Test Period</p>
                      <p className="font-medium">{backtestResults.startDate} to {backtestResults.endDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Winning Trades</p>
                      <p className="font-medium text-green-600">{backtestResults.winningTrades}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Losing Trades</p>
                      <p className="font-medium text-red-600">{backtestResults.losingTrades}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsRunning(true)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Deploy Strategy
                </button>
              </div>
            </div>
          )}

        {/* Running Strategies */}
        {runningStrategies.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">🚀</span>
              Active Strategies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {runningStrategies.map((strategy) => (
                <div key={strategy.id} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-green-800">{strategy.name}</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trades:</span>
                      <span className="font-medium">{strategy.trades}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">P&L:</span>
                      <span className={`font-medium ${strategy.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${strategy.pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Runtime:</span>
                      <span className="font-medium">
                        {Math.floor((Date.now() - strategy.startTime) / 60000)}m
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trade History */}
        {tradeHistory.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Recent Strategy Trades
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tradeHistory.slice(0, 10).map((trade) => (
                    <tr key={trade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trade.strategy}
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
                          {trade.side.toUpperCase()}
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
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          trade.status === 'executed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tradeHistory.length > 10 && (
              <div className="mt-4 text-center">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  View All Trades ({tradeHistory.length})
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Investment Tracking Modal */}
      {showInvestmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">📊 Investment Tracking - {activeStrategy?.name}</h3>
              <button
                onClick={() => setShowInvestmentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Total Invested</h4>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{investmentHistory
                    .filter(inv => inv.type === 'Investment')
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Total Sales</h4>
                <p className="text-2xl font-bold text-green-600">
                  ₹{investmentHistory
                    .filter(inv => inv.type === 'Sale')
                    .reduce((sum, inv) => sum + inv.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800">Active Trades</h4>
                <p className="text-2xl font-bold text-purple-600">{tradeHistory.length}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h4 className="font-semibold text-gray-800">Recent Investment Activity</h4>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symbol</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {investmentHistory.slice(0, 20).map((investment) => (
                      <tr key={investment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {investment.timestamp.toLocaleTimeString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            investment.action === 'buy'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {investment.action.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          {investment.symbol}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {investment.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          ₹{investment.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">
                          ₹{investment.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowInvestmentModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
