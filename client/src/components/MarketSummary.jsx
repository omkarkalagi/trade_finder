import React, { useState, useEffect } from 'react';

const MarketSummary = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock market data
  const mockData = {
    nifty50: {
      name: 'NIFTY 50',
      price: 19845.65,
      change: 167.85,
      changePercent: 0.85,
      icon: '📈'
    },
    sensex: {
      name: 'SENSEX',
      price: 66589.93,
      change: 742.19,
      changePercent: 1.12,
      icon: '📊'
    },
    banknifty: {
      name: 'BANK NIFTY',
      price: 45234.80,
      change: -103.45,
      changePercent: -0.23,
      icon: '🏦'
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMarketData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">📊</span>
          Market Summary
        </h2>
        <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(marketData).map(([key, value]) => (
          <div key={key} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{value.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{value.name}</h3>
                  <p className="text-2xl font-bold text-gray-900">
                    {value.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${value.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {value.change >= 0 ? '+' : ''}{value.change.toFixed(2)}
                </p>
                <p className={`text-sm ${value.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({value.change >= 0 ? '+' : ''}{value.changePercent}%)
                </p>
              </div>
            </div>

            {/* Mini progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full ${value.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(Math.abs(value.changePercent) * 20, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MarketSummary;
