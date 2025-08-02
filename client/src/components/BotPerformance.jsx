import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const BotPerformance = () => {
  const [botData, setBotData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock bot performance data
  const mockBotData = {
    totalTrades: 156,
    successfulTrades: 124,
    failedTrades: 32,
    totalProfit: 45678.90,
    totalLoss: -12345.67,
    winRate: 79.5,
    avgProfit: 368.22,
    activeBots: 3,
    strategies: [
      { name: 'Momentum Bot', trades: 45, profit: 15678.90, status: 'active' },
      { name: 'Mean Reversion', trades: 67, profit: 23456.78, status: 'active' },
      { name: 'Breakout Bot', trades: 44, profit: 6543.22, status: 'paused' }
    ],
    dailyPerformance: [
      { day: 'Mon', profit: 1234.56 },
      { day: 'Tue', profit: 2345.67 },
      { day: 'Wed', profit: -567.89 },
      { day: 'Thu', profit: 3456.78 },
      { day: 'Fri', profit: 1876.54 },
      { day: 'Sat', profit: 0 },
      { day: 'Sun', profit: 0 }
    ]
  };

  useEffect(() => {
    setTimeout(() => {
      setBotData(mockBotData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading bot performance...</p>
        </div>
      </div>
    );
  }

  const pieData = [
    { name: 'Successful', value: botData.successfulTrades, color: '#10b981' },
    { name: 'Failed', value: botData.failedTrades, color: '#ef4444' }
  ];

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">🤖</span>
          Bot Performance
        </h2>
        <div className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <span>{botData.activeBots} Active</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Win Rate</p>
              <p className="text-2xl font-bold text-green-600">{botData.winRate}%</p>
            </div>
            <span className="text-2xl">🎯</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Trades</p>
              <p className="text-2xl font-bold text-blue-600">{botData.totalTrades}</p>
            </div>
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </div>

      {/* Profit/Loss */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">💰</span>
          P&L Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Profit</p>
            <p className="text-lg font-bold text-green-600">+₹{botData.totalProfit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Net P&L</p>
            <p className="text-lg font-bold text-green-600">
              +₹{(botData.totalProfit + botData.totalLoss).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Trade Distribution Pie Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <span className="mr-2">📈</span>
          Trade Distribution
        </h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Trades']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Success ({botData.successfulTrades})</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Failed ({botData.failedTrades})</span>
          </div>
        </div>
      </div>

      {/* Active Strategies */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <span className="mr-2">⚙️</span>
          Active Strategies
        </h3>
        {botData.strategies.map((strategy, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{strategy.name}</p>
                <p className="text-sm text-gray-600">{strategy.trades} trades</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+₹{strategy.profit.toLocaleString()}</p>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  strategy.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {strategy.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BotPerformance;
