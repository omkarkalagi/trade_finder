import React, { useState } from 'react';

const MarketChart = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');

  const timeframes = [
    { id: '1D', name: '1 Day', icon: '📅' },
    { id: '1W', name: '1 Week', icon: '📊' },
    { id: '1M', name: '1 Month', icon: '📈' },
    { id: '3M', name: '3 Months', icon: '📉' },
    { id: '1Y', name: '1 Year', icon: '📊' }
  ];

  const chartData = [
    { time: '09:00', price: 19200, volume: 1200 },
    { time: '10:00', price: 19250, volume: 1500 },
    { time: '11:00', price: 19300, volume: 1800 },
    { time: '12:00', price: 19280, volume: 1400 },
    { time: '13:00', price: 19350, volume: 2000 },
    { time: '14:00', price: 19400, volume: 2200 },
    { time: '15:00', price: 19380, volume: 1900 },
    { time: '16:00', price: 19420, volume: 1600 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Market Chart</h2>
        <span className="text-2xl">📈</span>
      </div>

      {/* Timeframe Selector */}
      <div className="flex space-x-2 mb-6">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.id}
            onClick={() => setSelectedTimeframe(timeframe.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeframe === timeframe.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="mr-1">{timeframe.icon}</span>
            {timeframe.name}
          </button>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl mb-4 block">📊</span>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Chart</h3>
            <p className="text-gray-600">Chart data for {selectedTimeframe} timeframe</p>
          </div>
        </div>
      </div>

      {/* Price Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📈</span>
            <div>
              <p className="text-sm text-gray-600">High</p>
              <p className="text-lg font-bold text-green-600">₹19,420</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📉</span>
            <div>
              <p className="text-sm text-gray-600">Low</p>
              <p className="text-lg font-bold text-red-600">₹19,200</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-2">💰</span>
            <div>
              <p className="text-sm text-gray-600">Open</p>
              <p className="text-lg font-bold text-blue-600">₹19,250</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📊</span>
            <div>
              <p className="text-sm text-gray-600">Volume</p>
              <p className="text-lg font-bold text-purple-600">13.6M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Data Points */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Data Points</h3>
        <div className="space-y-2">
          {chartData.slice(-5).map((data, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-lg mr-3">⏰</span>
                <div>
                  <p className="font-medium text-gray-900">{data.time}</p>
                  <p className="text-sm text-gray-600">Volume: {data.volume.toLocaleString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">₹{data.price.toLocaleString()}</p>
                <p className={`text-sm ${
                  index > 0 && data.price > chartData[index - 1].price ? 'text-green-600' : 'text-red-600'
                }`}>
                  {index > 0 ? (data.price > chartData[index - 1].price ? '↗' : '↘') : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Controls */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-3">Chart Controls</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            <span className="mr-1">📊</span>Candlestick
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            <span className="mr-1">📈</span>Line
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            <span className="mr-1">📉</span>Area
          </button>
          <button className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">
            <span className="mr-1">📊</span>Volume
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketChart;
