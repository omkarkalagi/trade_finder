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
      name: 'Mean Reversion',
      description: 'This strategy is based on the concept that asset prices tend to revert to their historical mean or average over time.',
      parameters: [
        { name: 'Lookback Period', value: 20, min: 5, max: 50 },
        { name: 'Standard Deviation Threshold', value: 2.0, min: 0.5, max: 3.0, step: 0.1 },
        { name: 'Position Size (%)', value: 5, min: 1, max: 20 }
      ],
      performance: { winRate: 62, avgReturn: 1.8, sharpeRatio: 1.35 }
    },
    {
      id: 2,
      name: 'Momentum Trading',
      description: 'This strategy capitalizes on the continuance of existing market trends, buying assets that have been rising and selling those that have been declining.',
      parameters: [
        { name: 'Momentum Period', value: 14, min: 5, max: 30 },
        { name: 'Entry Threshold', value: 0.5, min: 0.1, max: 2.0, step: 0.1 },
        { name: 'Position Size (%)', value: 10, min: 1, max: 20 }
      ],
      performance: { winRate: 58, avgReturn: 2.1, sharpeRatio: 1.22 }
    },
    {
      id: 3,
      name: 'Breakout Strategy',
      description: 'This strategy identifies and capitalizes on situations where the price breaks through established support or resistance levels.',
      parameters: [
        { name: 'Channel Period', value: 20, min: 10, max: 50 },
        { name: 'Breakout Threshold (%)', value: 2, min: 0.5, max: 5, step: 0.5 },
        { name: 'Position Size (%)', value: 7, min: 1, max: 20 }
      ],
      performance: { winRate: 55, avgReturn: 2.5, sharpeRatio: 1.18 }
    },
    {
      id: 4,
      name: 'Moving Average Crossover',
      description: 'This strategy generates trading signals based on the crossing of two moving averages with different periods.',
      parameters: [
        { name: 'Fast MA Period', value: 10, min: 5, max: 30 },
        { name: 'Slow MA Period', value: 30, min: 15, max: 100 },
        { name: 'Position Size (%)', value: 8, min: 1, max: 20 }
      ],
      performance: { winRate: 60, avgReturn: 1.9, sharpeRatio: 1.28 }
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

      notificationService.notifySystem(`${activeStrategy.name} strategy started`, 'medium');

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
    // Simulate strategy making trades every 30 seconds to 2 minutes
    const executeInterval = setInterval(async () => {
      if (!isRunning) {
        clearInterval(executeInterval);
        return;
      }

      // Randomly decide to make a trade (30% chance)
      if (Math.random() < 0.3) {
        const stocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META'];
        const randomStock = stocks[Math.floor(Math.random() * stocks.length)];
        const side = Math.random() > 0.5 ? 'buy' : 'sell';
        const quantity = Math.floor(Math.random() * 10) + 1;

        try {
          let order;
          if (side === 'buy') {
            order = await alpacaService.placeBuyOrder(randomStock, quantity, 'market');
          } else {
            order = await alpacaService.placeSellOrder(randomStock, quantity, 'market');
          }

          // Add to trade history
          const newTrade = {
            id: Date.now(),
            strategy: strategy.name,
            symbol: randomStock,
            side: side,
            quantity: quantity,
            price: Math.random() * 200 + 50, // Mock price
            timestamp: new Date(),
            status: 'executed',
            pnl: (Math.random() - 0.5) * 100 // Random P&L
          };

          setTradeHistory(prev => [newTrade, ...prev]);

          // Update running strategy stats
          setRunningStrategies(prev => prev.map(s =>
            s.id === strategy.id
              ? { ...s, trades: s.trades + 1, pnl: s.pnl + newTrade.pnl }
              : s
          ));

          notificationService.notifyTrade(
            `${strategy.name}: ${side.toUpperCase()} ${quantity} ${randomStock} at $${newTrade.price.toFixed(2)}`,
            'info'
          );
        } catch (error) {
          console.error('Strategy execution error:', error);
        }
      }
    }, Math.random() * 90000 + 30000); // 30 seconds to 2 minutes

    // Clean up interval when strategy stops
    setTimeout(() => {
      if (!isRunning) {
        clearInterval(executeInterval);
      }
    }, 1000);
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
        </main>
      </div>
    </div>
  );
}
