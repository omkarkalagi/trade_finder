import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import MarketSummary from './MarketSummary';
import PortfolioSummary from './PortfolioSummary';
import LiveMarketWidget from './LiveMarketWidget';
import MarketChart from './MarketChart';
import MarketNews from './MarketNews';
import BotPerformance from './BotPerformance';
import FeatureHighlights from './FeatureHighlights';
import MarketStatus from './MarketStatus';
import RealTimeClock from './RealTimeClock';
import alpacaService from '../services/alpacaService';
import notificationService from '../services/notificationService';
import marketStatusService from '../services/marketStatusService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [showAllActions, setShowAllActions] = useState(false);

  const quickActions = [
    { icon: '🔍', title: 'Discover Trades', description: 'Find new opportunities', path: '/trade-discovery' },
    { icon: '📊', title: 'Analyze Sectors', description: 'Sector performance', path: '/sector-scope' },
    { icon: '🤖', title: 'Setup Bot', description: 'Automated trading', path: '/algo-trading' },
    { icon: '📈', title: 'Live Market', description: 'Real-time data', path: '/market' },
    { icon: '💼', title: 'Portfolio', description: 'Track performance', path: '/portfolio-analytics' },
    { icon: '🛡️', title: 'Risk Management', description: 'Safety controls', path: '/risk-management' },
    { icon: '⚙️', title: 'Strategy Builder', description: 'Build strategies', path: '/strategy-builder' },
    { icon: '🧪', title: 'Strategy Lab', description: 'Test & optimize', path: '/strategy-lab' }
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Subscribe to Alpaca service updates
    const unsubscribe = alpacaService.subscribe((data) => {
      setIsConnected(data.connected);
      if (data.connected) {
        setPortfolioSummary(data.portfolio);
      }
    });

    // Initial state
    setIsConnected(alpacaService.isAlpacaConnected());
    if (alpacaService.isAlpacaConnected()) {
      setPortfolioSummary(alpacaService.getPortfolioSummary());
    }

    // Welcome notification
    setTimeout(() => {
      notificationService.notifySystem('Welcome to Trade Finder! Your intelligent trading companion is ready. 🚀');
    }, 2000);

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-72 p-4 lg:p-6 overflow-y-auto transition-all duration-300">
          {/* Welcome Section */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  🚀 Welcome to Trade Finder
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Your intelligent trading dashboard powered by AI and real-time market data
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white/90 p-4 border border-gray-200/50 rounded-xl shadow-sm">
                  <RealTimeClock />
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status Banner */}
          {!isConnected ? (
            <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl flex-shrink-0">🔗</div>
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base">Connect to Alpaca for Live Trading</h3>
                    <p className="text-xs lg:text-sm opacity-90">
                      Connect your Alpaca account to access real-time portfolio data and enable live trading
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alpacaService.connect()}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm lg:text-base flex-shrink-0 touch-manipulation"
                >
                  Connect Now
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base">Connected to Alpaca</h3>
                    <p className="text-xs lg:text-sm opacity-90">
                      Your account is connected and ready for trading
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => alpacaService.disconnect()}
                  className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm lg:text-base flex-shrink-0 touch-manipulation"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Market Summary */}
            <div className="bg-white p-4 lg:p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <MarketSummary />
            </div>

            {/* Portfolio Summary */}
            <div className="bg-white p-4 lg:p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <PortfolioSummary
                isConnected={isConnected}
                portfolioSummary={portfolioSummary}
              />
            </div>

            {/* Live Market Widget */}
            <div className="bg-white p-4 lg:p-6 md:col-span-2 lg:col-span-1 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <LiveMarketWidget />
            </div>

            {/* Market Chart */}
            <div className="bg-white p-4 lg:p-6 md:col-span-2 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <MarketChart />
            </div>

            {/* Bot Performance */}
            <div className="bg-white p-4 lg:p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <BotPerformance />
            </div>

            {/* Market Status */}
            <div className="bg-white p-4 lg:p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <MarketStatus />
            </div>

            {/* Feature Highlights */}
            <div className="bg-white p-4 lg:p-6 md:col-span-2 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <FeatureHighlights />
            </div>

            {/* Trading Activity */}
            <div className="bg-white p-4 lg:p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2 bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">ACTIVITY</span>
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-600 mr-2 font-bold">BUY</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">RELIANCE</p>
                      <p className="text-xs text-gray-600">Bought 10 shares</p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">+₹2,450</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-red-600 mr-2 font-bold">SELL</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">TCS</p>
                      <p className="text-xs text-gray-600">Sold 5 shares</p>
                    </div>
                  </div>
                  <span className="text-sm text-red-600">-₹1,200</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-blue-600 mr-2 font-bold">BOT</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Auto Bot</p>
                      <p className="text-xs text-gray-600">Strategy executed</p>
                    </div>
                  </div>
                  <span className="text-sm text-blue-600">Active</span>
                </div>
              </div>
            </div>

            {/* Market Movers */}
            <div className="bg-white p-4 lg:p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2 bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">MOVERS</span>
                Top Movers
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">ADANI</p>
                    <p className="text-xs text-gray-600">₹2,450.50</p>
                  </div>
                  <span className="text-sm text-green-600">+5.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">HDFC</p>
                    <p className="text-xs text-gray-600">₹1,680.25</p>
                  </div>
                  <span className="text-sm text-green-600">+3.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">WIPRO</p>
                    <p className="text-xs text-gray-600">₹425.75</p>
                  </div>
                  <span className="text-sm text-red-600">-2.1%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">INFY</p>
                    <p className="text-xs text-gray-600">₹1,520.30</p>
                  </div>
                  <span className="text-sm text-green-600">+1.9%</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-dark-lg p-4 lg:p-6 text-white border border-blue-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.slice(0, showAllActions ? quickActions.length : 3).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(action.path)}
                    className="w-full bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg p-2.5 text-left transition-all duration-200 touch-manipulation hover:scale-105 transform"
                  >
                    <div className="font-medium flex items-center">
                      <span className="mr-2" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
                        {action.icon}
                      </span>
                      {action.title}
                    </div>
                    <div className="text-xs opacity-80">{action.description}</div>
                  </button>
                ))}

                {/* View More/Less Button */}
                {quickActions.length > 3 && (
                  <button
                    onClick={() => setShowAllActions(!showAllActions)}
                    className="w-full mt-3 py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all duration-200 border border-white/20 hover:border-white/30"
                  >
                    <span className="mr-2" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
                      {showAllActions ? '📤' : '📥'}
                    </span>
                    {showAllActions ? 'Show Less' : `View More (${quickActions.length - 3} more)`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Market News - Full Width at Bottom */}
          <div className="mt-6">
            <div className="bg-white p-4 lg:p-6 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <MarketNews />
            </div>
          </div>
        </main>
      </div>
      <div className="lg:ml-72">
        <Footer />
      </div>
    </div>
  );
}
