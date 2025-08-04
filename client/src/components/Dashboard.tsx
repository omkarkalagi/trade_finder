import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveMarket from './LiveMarket';
import PortfolioSummary from './PortfolioSummary.tsx';
import MarketStatus from './MarketStatus';
import MarketNews from './MarketNews';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState('unknown');
  const { user } = useAuth();

  useEffect(() => {
    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check server status
    const checkServer = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const quickActions = [
    { name: 'Place Order', href: '/auto-trading', icon: '📊', color: 'bg-blue-500', description: 'Execute trades' },
    { name: 'View Portfolio', href: '/portfolio-analytics', icon: '💼', color: 'bg-green-500', description: 'Track performance' },
    { name: 'Market Analysis', href: '/market', icon: '📈', color: 'bg-purple-500', description: 'Live data' },
    { name: 'Strategy Builder', href: '/strategy-builder', icon: '⚙️', color: 'bg-orange-500', description: 'Build strategies' },
  ];

  const marketStats = [
    { label: 'S&P 500', value: '4,127.83', change: '+1.25%', positive: true },
    { label: 'NASDAQ', value: '12,657.90', change: '+2.14%', positive: true },
    { label: 'DOW JONES', value: '33,745.40', change: '-0.45%', positive: false },
    { label: 'RUSSELL 2000', value: '1,956.76', change: '+0.89%', positive: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome back, {user?.phone ? `Trader` : 'Trader'}! 
              </h1>
              <p className="text-gray-600 mt-1">Here's what's happening in the markets today</p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-sm font-medium">Network: {isOnline ? 'Online' : 'Offline'}</span>
              </div>
              <div className="flex items-center">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                  serverStatus === 'online' ? 'bg-green-500' :
                  serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></span>
                <span className="text-sm font-medium">Server: {
                  serverStatus === 'online' ? 'Online' :
                  serverStatus === 'offline' ? 'Offline' : 'Checking...'
                }</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className="group relative bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className={`inline-flex p-3 rounded-lg text-white ${action.color} mb-4`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{action.name}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Market Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Market Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketStats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                  <span className={`text-sm font-medium ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Market Data */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio Overview</h2>
              <PortfolioSummary data={{ totalValue: 125000, dailyPnL: 1250, totalPnL: 15750 }} />
            </div>

            {/* Live Market Data */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Market Data</h2>
              <LiveMarket />
            </div>

            {/* AI Trading Insights */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">🤖</span>
                <h2 className="text-xl font-semibold">AI Trading Insights</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Market Sentiment: Bullish</h3>
                  <p className="text-sm opacity-90">AI analysis suggests positive momentum in tech stocks with 85% confidence.</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Recommended Action</h3>
                  <p className="text-sm opacity-90">Consider increasing exposure to growth stocks. Risk level: Moderate</p>
                </div>
                <Link 
                  to="/algo-trading" 
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  View Full Analysis
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - News & Status */}
          <div className="space-y-8">
            {/* Market Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Status</h2>
              <MarketStatus />
            </div>

            {/* Trading Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 mr-3">✅</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Buy order executed</p>
                    <p className="text-xs text-gray-600">AAPL - 10 shares at $175.50</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 mr-3">📊</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Strategy updated</p>
                    <p className="text-xs text-gray-600">AI Growth Strategy v2.1</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-yellow-600 mr-3">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Risk alert</p>
                    <p className="text-xs text-gray-600">Portfolio volatility above threshold</p>
                  </div>
                </div>
              </div>
              <Link 
                to="/portfolio-analytics" 
                className="block mt-4 text-center px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                View All Activity
              </Link>
            </div>

            {/* Market News */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Market News</h2>
              <MarketNews compact={true} />
            </div>
          </div>
        </div>

        {/* Performance Charts Row */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Performance Overview</h2>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">1D</button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg">1W</button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg">1M</button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-lg">1Y</button>
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-4 block">📈</span>
                <p className="text-gray-600">Performance charts will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">Integration with real-time market data pending</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
