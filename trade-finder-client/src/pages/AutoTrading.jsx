import React, { useState } from 'react';

const AutoTrading = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');

  const strategies = [
    { id: 'momentum', name: 'Momentum Strategy', icon: '📈', description: 'Follows trending stocks' },
    { id: 'mean-reversion', name: 'Mean Reversion', icon: '📉', description: 'Buys oversold, sells overbought' },
    { id: 'arbitrage', name: 'Arbitrage', icon: '⚖️', description: 'Exploits price differences' },
    { id: 'scalping', name: 'Scalping', icon: '⚡', description: 'Quick small profits' }
  ];

  const recentTrades = [
    { symbol: 'RELIANCE', action: 'BUY', price: '₹2,456', time: '10:30 AM', status: 'success' },
    { symbol: 'TCS', action: 'SELL', price: '₹3,456', time: '11:15 AM', status: 'success' },
    { symbol: 'INFY', action: 'BUY', price: '₹1,456', time: '12:00 PM', status: 'pending' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Auto Trading</h1>
          <p className="text-gray-600 mt-2">Automated trading strategies for consistent returns</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-4">🤖</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Auto Trading Status</h2>
                <p className="text-gray-600">Automated trading system</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isActive ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
        </div>

        {/* Strategy Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all ${
                selectedStrategy === strategy.id
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setSelectedStrategy(strategy.id)}
            >
              <div className="text-center">
                <span className="text-3xl mb-3 block">{strategy.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{strategy.name}</h3>
                <p className="text-sm text-gray-600">{strategy.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">💰</span>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-green-600">₹12,450</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📊</span>
              <div>
                <p className="text-sm font-medium text-gray-600">Win Rate</p>
                <p className="text-2xl font-bold text-blue-600">68%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📈</span>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Trades</h3>
            <span className="text-2xl">📋</span>
          </div>
          <div className="space-y-4">
            {recentTrades.map((trade, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    trade.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{trade.symbol}</p>
                    <p className="text-sm text-gray-600">{trade.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    trade.action === 'BUY' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trade.action}
                  </p>
                  <p className="text-sm text-gray-600">{trade.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Trading Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Trade Amount</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="₹10,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stop Loss (%)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Take Profit (%)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Daily Limit</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="20"
              />
            </div>
          </div>
          <div className="mt-6">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTrading;
