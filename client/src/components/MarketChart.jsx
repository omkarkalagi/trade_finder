import React, { useState } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const MarketChart = () => {
  const [selectedIndex, setSelectedIndex] = useState('nifty');
  const [timeframe, setTimeframe] = useState('1d');

  const indices = [
    { id: 'nifty', name: 'NIFTY 50', price: 19234.50, change: 234.50, changePercent: 1.23, color: 'green' },
    { id: 'banknifty', name: 'BANK NIFTY', price: 43256.75, change: -156.25, changePercent: -0.36, color: 'red' },
    { id: 'sensex', name: 'SENSEX', price: 64234.80, change: 456.20, changePercent: 0.72, color: 'blue' }
  ];

  const timeframes = ['1d', '1w', '1m', '3m', '1y'];

  // Mock chart data
  const generateChartData = () => {
    const data = [];
    const basePrice = indices.find(i => i.id === selectedIndex)?.price || 19000;

    for (let i = 0; i < 24; i++) {
      const time = `${9 + Math.floor(i/6)}:${(i%6)*10}`;
      const price = basePrice + Math.sin(i/2) * 200 + i * 10 + (Math.random() - 0.5) * 100;
      data.push({ time, price: Math.round(price * 100) / 100 });
    }
    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Market Charts</h1>
          <p className="text-gray-600 mt-2">Real-time market data and technical analysis</p>
        </div>

        {/* Index Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-4">
              {indices.map((index) => (
                <button
                  key={index.id}
                  onClick={() => setSelectedIndex(index.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedIndex === index.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index.name}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Index Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            {indices.map((index) => (
              index.id === selectedIndex && (
                <div key={index.id} className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{index.name}</h3>
                    <p className="text-2xl font-bold text-gray-900">₹{index.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <div className={`flex items-center text-lg font-semibold ${
                      index.color === 'green' ? 'text-green-600' :
                      index.color === 'red' ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {index.color === 'green' ? (
                        <TrendingUpIcon className="h-5 w-5 mr-1" />
                      ) : (
                        <TrendingDownIcon className="h-5 w-5 mr-1" />
                      )}
                      {index.change >= 0 ? '+' : ''}{index.change} ({index.changePercent}%)
                    </div>
                    <p className="text-sm text-gray-600">Today's change</p>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Price Chart</h2>
            <div className="flex items-center text-sm text-gray-600">
              <CalendarIcon className="h-4 w-4 mr-1" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Chart Container */}
          <div className="h-96 bg-gray-50 rounded-lg p-4">
            <div className="h-full flex items-end justify-between space-x-1">
              {chartData.map((point, index) => {
                const maxPrice = Math.max(...chartData.map(p => p.price));
                const minPrice = Math.min(...chartData.map(p => p.price));
                const height = ((point.price - minPrice) / (maxPrice - minPrice)) * 100;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-blue-500 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    {index % 4 === 0 && (
                      <span className="text-xs text-gray-500 mt-2 rotate-45 origin-left">
                        {point.time}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chart Legend */}
          <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              Price Movement
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
              Volume
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              Support/Resistance
            </div>
          </div>
        </div>

        {/* Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Volume</p>
                <p className="text-2xl font-bold text-gray-900">2.4B</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Advancing</p>
                <p className="text-2xl font-bold text-green-600">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingDownIcon className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Declining</p>
                <p className="text-2xl font-bold text-red-600">567</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-gray-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Unchanged</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Indicators */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Indicators</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">RSI (14)</span>
                <span className="text-green-600 font-semibold">65.4</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">MACD</span>
                <span className="text-blue-600 font-semibold">+12.5</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Bollinger Bands</span>
                <span className="text-yellow-600 font-semibold">Upper</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Moving Average (50)</span>
                <span className="text-green-600 font-semibold">Above</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Sentiment</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bullish</span>
                  <span>65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bearish</span>
                  <span>25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Neutral</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketChart;
