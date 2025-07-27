import React, { useState } from 'react';
// Use emojis instead of Heroicons to avoid import issues
// Remove all Heroicons imports

const Dashboard = () => {
  console.log('Dashboard component rendering');

  const [marketData, setMarketData] = useState({
    nifty: { price: 19234.50, change: 234.50, changePercent: 1.23 },
    bankNifty: { price: 43256.75, change: -156.25, changePercent: -0.36 },
    sensex: { price: 64234.80, change: 456.20, changePercent: 0.72 }
  });

  const [portfolioValue, setPortfolioValue] = useState(125000);
  const [dailyPnL, setDailyPnL] = useState(2340);
  const [totalPnL, setTotalPnL] = useState(15600);

  const [recentTrades] = useState([
    { symbol: 'RELIANCE', type: 'BUY', quantity: 100, price: 2456.50, time: '09:45 AM' },
    { symbol: 'TCS', type: 'SELL', quantity: 50, price: 3456.75, time: '10:15 AM' },
    { symbol: 'INFY', type: 'BUY', quantity: 200, price: 1456.25, time: '11:30 AM' }
  ]);

  const [watchlist] = useState([
    { symbol: 'RELIANCE', price: 2456.50, change: 23.50, changePercent: 0.96 },
    { symbol: 'TCS', price: 3456.75, change: -45.25, changePercent: -1.29 },
    { symbol: 'INFY', price: 1456.25, change: 12.75, changePercent: 0.88 },
    { symbol: 'HDFC', price: 1654.30, change: 34.20, changePercent: 2.11 }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '20px' }}>
        <h2>Dashboard Component is Loading!</h2>
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trading Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your market overview</p>
        </div>

        {/* Simple test content */}
        <div style={{ backgroundColor: 'blue', color: 'white', padding: '20px', marginBottom: '20px' }}>
          <h3>Simple Test Content</h3>
          <p>If you can see this, the Dashboard is working!</p>
        </div>

        {/* Market Overview Cards - updated with emojis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* NIFTY card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NIFTY 50</p>
                <p className="text-2xl font-bold text-gray-900">₹{marketData.nifty.price.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-lg mr-1">📈</span>
                  <span className="text-sm font-medium text-green-600">
                    +{marketData.nifty.change} ({marketData.nifty.changePercent}%)
                  </span>
                </div>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </div>

          {/* BANK NIFTY card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">BANK NIFTY</p>
                <p className="text-2xl font-bold text-gray-900">₹{marketData.bankNifty.price.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-lg mr-1">📉</span>
                  <span className="text-sm font-medium text-red-600">
                    {marketData.bankNifty.change} ({marketData.bankNifty.changePercent}%)
                  </span>
                </div>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </div>

          {/* SENSEX card */}
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SENSEX</p>
                <p className="text-2xl font-bold text-gray-900">₹{marketData.sensex.price.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <span className="text-lg mr-1">📈</span>
                  <span className="text-sm font-medium text-blue-600">
                    +{marketData.sensex.change} ({marketData.sensex.changePercent}%)
                  </span>
                </div>
              </div>
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Value</h3>
            <div className="flex items-center">
              <span className="h-8 w-8 text-green-500 mr-3">💰</span>
              <div>
                <p className="text-2xl font-bold text-gray-900">₹{portfolioValue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total holdings</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily P&L</h3>
            <div className="flex items-center">
              <span className="h-8 w-8 text-green-500 mr-3">📈</span>
              <div>
                <p className="text-2xl font-bold text-green-600">+₹{dailyPnL.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Today's profit</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total P&L</h3>
            <div className="flex items-center">
              <span className="h-8 w-8 text-green-500 mr-3">📈</span>
              <div>
                <p className="text-2xl font-bold text-green-600">+₹{totalPnL.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Overall profit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Trades */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Trades</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {recentTrades.map((trade, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${trade.type === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{trade.symbol}</p>
                      <p className="text-sm text-gray-600">{trade.quantity} shares @ ₹{trade.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${trade.type === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                      {trade.type}
                    </p>
                    <p className="text-sm text-gray-600">{trade.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Watchlist</h3>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Manage</button>
            </div>
            <div className="space-y-3">
              {watchlist.map((stock, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-600">₹{stock.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change} ({stock.changePercent}%)
                    </p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="h-8 w-8 text-blue-600 mb-2">📈</span>
              <span className="text-sm font-medium text-blue-900">New Trade</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="h-8 w-8 text-green-600 mb-2">💰</span>
              <span className="text-sm font-medium text-green-900">Buy Order</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <span className="h-8 w-8 text-red-600 mb-2">📉</span>
              <span className="text-sm font-medium text-red-900">Sell Order</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="h-8 w-8 text-gray-600 mb-2">⚙️</span>
              <span className="text-sm font-medium text-gray-900">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
