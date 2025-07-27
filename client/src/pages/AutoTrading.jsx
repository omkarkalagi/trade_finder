import React, { useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  CogIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AutoTrading = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');
  const [riskLevel, setRiskLevel] = useState('medium');
  const [dailyTarget, setDailyTarget] = useState(5000);
  const [stopLoss, setStopLoss] = useState(2000);

  const [botStats] = useState({
    totalTrades: 156,
    winningTrades: 98,
    losingTrades: 58,
    winRate: 62.8,
    totalProfit: 45600,
    todayProfit: 2340,
    activePositions: 3
  });

  const [strategies] = useState([
    { id: 'momentum', name: 'Momentum Trading', description: 'Follows price momentum with RSI confirmation' },
    { id: 'mean-reversion', name: 'Mean Reversion', description: 'Trades against extreme price movements' },
    { id: 'breakout', name: 'Breakout Strategy', description: 'Enters on price breakouts with volume confirmation' },
    { id: 'scalping', name: 'Scalping', description: 'Quick trades with small profits and tight stops' }
  ]);

  const [recentSignals] = useState([
    { symbol: 'RELIANCE', action: 'BUY', price: 2456.50, time: '10:30 AM', confidence: 85 },
    { symbol: 'TCS', action: 'SELL', price: 3456.75, time: '11:15 AM', confidence: 72 },
    { symbol: 'INFY', action: 'BUY', price: 1456.25, time: '12:00 PM', confidence: 91 },
    { symbol: 'HDFC', action: 'HOLD', price: 1654.30, time: '12:45 PM', confidence: 45 }
  ]);

  const handleStartBot = () => {
    setIsRunning(true);
    // Add actual bot start logic here
  };

  const handleStopBot = () => {
    setIsRunning(false);
    // Add actual bot stop logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Auto Trading Bot</h1>
          <p className="text-gray-600 mt-2">Automated trading with AI-powered strategies</p>
        </div>

        {/* Bot Control Panel */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Bot Control</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
              <select
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {strategies.map(strategy => (
                  <option key={strategy.id} value={strategy.id}>{strategy.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
              <select
                value={riskLevel}
                onChange={(e) => setRiskLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Target (₹)</label>
              <input
                type="number"
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stop Loss (₹)</label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mt-6">
            {!isRunning ? (
              <button
                onClick={handleStartBot}
                className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlayIcon className="h-5 w-5 mr-2" />
                Start Bot
              </button>
            ) : (
              <button
                onClick={handleStopBot}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <PauseIcon className="h-5 w-5 mr-2" />
                Stop Bot
              </button>
            )}

            <button className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <CogIcon className="h-5 w-5 mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Bot Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">{botStats.totalTrades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-green-600">{botStats.winRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900">₹{botStats.totalProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Positions</p>
                <p className="text-2xl font-bold text-orange-600">{botStats.activePositions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategy Details</h3>
            <div className="space-y-4">
              {strategies.map(strategy => (
                <div
                  key={strategy.id}
                  className={`p-4 rounded-lg border-2 ${
                    selectedStrategy === strategy.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <h4 className="font-medium text-gray-900">{strategy.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Signals</h3>
            <div className="space-y-3">
              {recentSignals.map((signal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      signal.action === 'BUY' ? 'bg-green-500' :
                      signal.action === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{signal.symbol}</p>
                      <p className="text-sm text-gray-600">₹{signal.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      signal.action === 'BUY' ? 'text-green-600' :
                      signal.action === 'SELL' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {signal.action}
                    </p>
                    <p className="text-sm text-gray-600">{signal.confidence}% confidence</p>
                    <p className="text-xs text-gray-500">{signal.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Chart</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTrading;
