import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import LoadingSpinner from './common/LoadingSpinner';

export default function AutoTrading() {
  const [activeBot, setActiveBot] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [botPerformance, setBotPerformance] = useState(null);
  const [tradingPairs, setTradingPairs] = useState([
    { id: 1, symbol: 'AAPL', enabled: true },
    { id: 2, symbol: 'MSFT', enabled: true },
    { id: 3, symbol: 'GOOGL', enabled: false },
    { id: 4, symbol: 'AMZN', enabled: true },
    { id: 5, symbol: 'TSLA', enabled: false },
    { id: 6, symbol: 'NVDA', enabled: true },
    { id: 7, symbol: 'META', enabled: false },
    { id: 8, symbol: 'NFLX', enabled: false }
  ]);

  const tradingBots = [
    {
      id: 1,
      name: 'Trend Follower',
      description: 'Identifies and follows market trends using technical indicators like moving averages and MACD.',
      riskLevel: 'Medium',
      performance: { monthlyReturn: 2.8, winRate: 65, tradesPerDay: 5 }
    },
    {
      id: 2,
      name: 'Volatility Breakout',
      description: 'Capitalizes on price breakouts during periods of high volatility using Bollinger Bands and ATR.',
      riskLevel: 'High',
      performance: { monthlyReturn: 4.2, winRate: 58, tradesPerDay: 8 }
    },
    {
      id: 3,
      name: 'Mean Reversion',
      description: 'Takes advantage of price reversions to the mean using RSI and stochastic oscillators.',
      riskLevel: 'Medium',
      performance: { monthlyReturn: 2.1, winRate: 72, tradesPerDay: 4 }
    },
    {
      id: 4,
      name: 'Conservative Growth',
      description: 'Focuses on stable growth with lower risk using a combination of fundamental and technical analysis.',
      riskLevel: 'Low',
      performance: { monthlyReturn: 1.5, winRate: 80, tradesPerDay: 2 }
    }
  ];

  const toggleBot = () => {
    if (!activeBot) return;

    setIsRunning(!isRunning);

    if (!isRunning) {
      // Generate random performance data when bot is started
      setBotPerformance({
        totalTrades: 0,
        profitableTrades: 0,
        totalProfit: 0,
        startTime: new Date().toISOString()
      });

      // Simulate updating performance over time
      const intervalId = setInterval(() => {
        setBotPerformance(prev => {
          const newTrades = Math.floor(Math.random() * 3);
          const newProfitableTrades = Math.floor(Math.random() * (newTrades + 1));
          const newProfit = (Math.random() * 10 - 3) * newTrades;

          return {
            totalTrades: prev.totalTrades + newTrades,
            profitableTrades: prev.profitableTrades + newProfitableTrades,
            totalProfit: prev.totalProfit + newProfit,
            startTime: prev.startTime
          };
        });
      }, 5000);

      // Store interval ID in a ref or state to clear it when bot is stopped
      window.botInterval = intervalId;
    } else {
      // Clear interval when bot is stopped
      clearInterval(window.botInterval);
    }
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">🚀 Automated Trading</h1>

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

          {/* Trading Pairs */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Trading Pairs</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tradingPairs.map(pair => (
                <div
                  key={pair.id}
                  onClick={() => togglePair(pair.id)}
                  className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${pair.enabled ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'}`}
                >
                  <div className="font-medium">{pair.symbol}</div>
                  <div className={`text-xs mt-1 ${pair.enabled ? 'text-green-600' : 'text-gray-500'}`}>
                    {pair.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
        </main>
      </div>
    </div>
  );
}
