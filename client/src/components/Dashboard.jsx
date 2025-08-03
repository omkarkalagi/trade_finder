import React, { useEffect, useState } from 'react';
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
import zerodhaService from '../services/zerodhaService';
import notificationService from '../services/notificationService';

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Subscribe to Zerodha service updates
    const unsubscribe = zerodhaService.subscribe((data) => {
      setIsConnected(data.connected);
      if (data.connected) {
        setPortfolioSummary(zerodhaService.getPortfolioSummary());
      }
    });

    // Initial state
    setIsConnected(zerodhaService.isZerodhaConnected());
    if (zerodhaService.isZerodhaConnected()) {
      setPortfolioSummary(zerodhaService.getPortfolioSummary());
    }

    // Welcome notification
    setTimeout(() => {
      notificationService.notifySystem('Welcome to Trade Finder! Your intelligent trading companion is ready. 🚀');
    }, 2000);

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-0 p-4 lg:p-6 overflow-y-auto">
          {/* Welcome Section */}
          <div className="mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  🚀 Welcome to Trade Finder
                </h1>
                <p className="text-slate-400 text-sm lg:text-base">
                  Your intelligent trading dashboard powered by AI and real-time market data
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="glass dark-card p-4 border border-slate-700/30">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-green-400">
                      {new Date().toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-slate-400">
                      {new Date().toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connection Status Banner */}
          {!isConnected && (
            <div className="mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl flex-shrink-0">🔗</div>
                  <div>
                    <h3 className="font-semibold text-sm lg:text-base">Connect to Zerodha for Live Trading</h3>
                    <p className="text-xs lg:text-sm opacity-90">
                      Connect your Zerodha account to access real-time portfolio data and enable live trading
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => zerodhaService.connectToZerodha()}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm lg:text-base flex-shrink-0 touch-manipulation"
                >
                  Connect Now
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Market Summary */}
            <div className="glass dark-card p-4 lg:p-6 border border-slate-700/30 hover:shadow-dark-lg transition-all duration-300 hover:scale-105">
              <MarketSummary />
            </div>

            {/* Portfolio Summary */}
            <div className="glass dark-card p-4 lg:p-6 border border-slate-700/30 hover:shadow-dark-lg transition-all duration-300 hover:scale-105">
              <PortfolioSummary
                isConnected={isConnected}
                portfolioSummary={portfolioSummary}
              />
            </div>

            {/* Live Market Widget */}
            <div className="glass dark-card p-4 lg:p-6 md:col-span-2 lg:col-span-1 border border-slate-700/30 hover:shadow-dark-lg transition-all duration-300 hover:scale-105">
              <LiveMarketWidget />
            </div>

            {/* Market Chart */}
            <div className="glass dark-card p-4 lg:p-6 md:col-span-2 border border-slate-700/30 hover:shadow-dark-lg transition-all duration-300 hover:scale-105">
              <MarketChart />
            </div>

            {/* Bot Performance */}
            <div className="glass dark-card p-4 lg:p-6 border border-slate-700/30 hover:shadow-dark-lg transition-all duration-300 hover:scale-105">
              <BotPerformance />
            </div>

            {/* Market News */}
            <div className="glass dark-card p-4 lg:p-6 border border-slate-700/30 hover:shadow-dark-lg transition-all duration-300 hover:scale-105">
              <MarketNews />
            </div>

            {/* Feature Highlights */}
            <div className="glass dark-card p-4 lg:p-6 md:col-span-2 border border-slate-700/30 hover:shadow-dark-lg transition-all duration-300 hover:scale-105">
              <FeatureHighlights />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-dark-lg p-4 lg:p-6 text-white border border-blue-500/20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg p-3 text-left transition-all duration-200 touch-manipulation">
                  <div className="font-medium">🔍 Discover Trades</div>
                  <div className="text-sm opacity-80">Find new opportunities</div>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg p-3 text-left transition-all duration-200 touch-manipulation">
                  <div className="font-medium">📊 Analyze Sectors</div>
                  <div className="text-sm opacity-80">Sector performance</div>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-lg p-3 text-left transition-all duration-200 touch-manipulation">
                  <div className="font-medium">🤖 Setup Bot</div>
                  <div className="text-sm opacity-80">Automated trading</div>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
