import React, { useState, useEffect } from 'react';
import LiveMarket from '../components/LiveMarket';
import MarketNews from '../components/MarketNews';
import MarketStatus from '../components/MarketStatus';

const Market = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: '📊' },
    { id: 'indices', label: 'Major Indices', icon: '📈' },
    { id: 'sectors', label: 'Sector Performance', icon: '🏢' },
    { id: 'currencies', label: 'Currencies', icon: '💱' },
    { id: 'commodities', label: 'Commodities', icon: '🥇' }
  ];

  const majorIndices = [
    { symbol: 'SPY', name: 'S&P 500 ETF', price: 427.83, change: 5.32, changePercent: 1.26 },
    { symbol: 'QQQ', name: 'NASDAQ 100 ETF', price: 367.45, change: 8.12, changePercent: 2.26 },
    { symbol: 'DIA', name: 'Dow Jones ETF', price: 337.21, change: -1.45, changePercent: -0.43 },
    { symbol: 'IWM', name: 'Russell 2000 ETF', price: 195.67, change: 2.89, changePercent: 1.50 },
    { symbol: 'VIX', name: 'Volatility Index', price: 18.45, change: -0.85, changePercent: -4.41 }
  ];

  const sectorPerformance = [
    { name: 'Technology', symbol: 'XLK', change: 2.15, volume: '45.2M' },
    { name: 'Healthcare', symbol: 'XLV', change: 1.85, volume: '32.1M' },
    { name: 'Financials', symbol: 'XLF', change: 1.25, volume: '28.9M' },
    { name: 'Consumer Discretionary', symbol: 'XLY', change: 0.95, volume: '21.4M' },
    { name: 'Industrials', symbol: 'XLI', change: 0.75, volume: '19.8M' },
    { name: 'Energy', symbol: 'XLE', change: -0.45, volume: '25.6M' },
    { name: 'Utilities', symbol: 'XLU', change: -0.85, volume: '15.2M' },
    { name: 'Real Estate', symbol: 'XLRE', change: -1.25, volume: '12.8M' }
  ];

  const currencies = [
    { pair: 'EUR/USD', rate: 1.0875, change: 0.0025, changePercent: 0.23 },
    { pair: 'GBP/USD', rate: 1.2654, change: -0.0045, changePercent: -0.35 },
    { pair: 'USD/JPY', rate: 149.85, change: 0.75, changePercent: 0.50 },
    { pair: 'USD/CAD', rate: 1.3425, change: 0.0015, changePercent: 0.11 },
    { pair: 'AUD/USD', rate: 0.6825, change: 0.0035, changePercent: 0.52 }
  ];

  const commodities = [
    { name: 'Gold', symbol: 'XAUUSD', price: 2045.50, change: 12.25, changePercent: 0.60 },
    { name: 'Silver', symbol: 'XAGUSD', price: 24.85, change: -0.15, changePercent: -0.60 },
    { name: 'Crude Oil', symbol: 'USOIL', price: 78.45, change: 2.35, changePercent: 3.09 },
    { name: 'Natural Gas', symbol: 'NGAS', price: 2.875, change: -0.125, changePercent: -4.17 },
    { name: 'Copper', symbol: 'COPPER', price: 3.825, change: 0.045, changePercent: 1.19 }
  ];

  const formatPrice = (price) => {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatChange = (change, changePercent) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${formatPrice(change)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Market Overview
          </h1>
          <p className="text-gray-600">Real-time market data and analysis</p>
        </div>

        {/* Market Status */}
        <div className="mb-8">
          <MarketStatus />
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 bg-white rounded-t-xl">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-sm border border-gray-200">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Live Market Data</h3>
                  <LiveMarket />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Market News</h3>
                  <MarketNews compact={true} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'indices' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Major Indices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {majorIndices.map((index) => (
                  <div key={index.symbol} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{index.symbol}</h4>
                      <span className={`text-2xl ${index.change >= 0 ? '📈' : '📉'}`}></span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{index.name}</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">${formatPrice(index.price)}</p>
                      <p className={`text-sm font-medium ${index.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatChange(index.change, index.changePercent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sectors' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Sector Performance</h3>
              <div className="space-y-4">
                {sectorPerformance.map((sector) => (
                  <div key={sector.symbol} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${sector.change >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900">{sector.name}</h4>
                        <p className="text-sm text-gray-600">{sector.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${sector.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-500">Vol: {sector.volume}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'currencies' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Currency Exchange Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currencies.map((currency) => (
                  <div key={currency.pair} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{currency.pair}</h4>
                      <span className="text-2xl">💱</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(currency.rate)}</p>
                      <p className={`text-sm font-medium ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatChange(currency.change, currency.changePercent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'commodities' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Commodities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {commodities.map((commodity) => (
                  <div key={commodity.symbol} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{commodity.name}</h4>
                      <span className="text-2xl">
                        {commodity.name === 'Gold' ? '🥇' : 
                         commodity.name === 'Silver' ? '🥈' :
                         commodity.name === 'Crude Oil' ? '🛢️' :
                         commodity.name === 'Natural Gas' ? '⛽' : '🔩'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{commodity.symbol}</p>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-gray-900">${formatPrice(commodity.price)}</p>
                      <p className={`text-sm font-medium ${commodity.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatChange(commodity.change, commodity.changePercent)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to Trade?</h3>
              <p className="text-sm opacity-90">Access real-time market data and execute trades instantly</p>
            </div>
            <div className="flex space-x-4">
              <button className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                View Watchlist
              </button>
              <button className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Market; 