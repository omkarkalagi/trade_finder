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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  🚀 Welcome to Trade Finder
                </h1>
                <p className="text-gray-600">
                  Your intelligent trading dashboard powered by AI and real-time market data
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {new Date().toLocaleDateString('en-IN', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="text-sm text-gray-500">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🔗</div>
                  <div>
                    <h3 className="font-semibold">Connect to Zerodha for Live Trading</h3>
                    <p className="text-sm opacity-90">
                      Connect your Zerodha account to access real-time portfolio data and enable live trading
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => zerodhaService.connectToZerodha()}
                  className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Connect Now
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Market Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <MarketSummary />
            </div>

            {/* Portfolio Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <PortfolioSummary
                isConnected={isConnected}
                portfolioSummary={portfolioSummary}
              />
            </div>

            {/* Live Market Widget */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2 lg:col-span-1 border border-gray-200 hover:shadow-xl transition-shadow">
              <LiveMarketWidget />
            </div>

            {/* Market Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2 border border-gray-200 hover:shadow-xl transition-shadow">
              <MarketChart />
            </div>

            {/* Bot Performance */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <BotPerformance />
            </div>

            {/* Market News */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
              <MarketNews />
            </div>

            {/* Feature Highlights */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2 border border-gray-200 hover:shadow-xl transition-shadow">
              <FeatureHighlights />
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                  <div className="font-medium">🔍 Discover Trades</div>
                  <div className="text-sm opacity-80">Find new opportunities</div>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
                  <div className="font-medium">📊 Analyze Sectors</div>
                  <div className="text-sm opacity-80">Sector performance</div>
                </button>
                <button className="w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-left transition-colors">
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
