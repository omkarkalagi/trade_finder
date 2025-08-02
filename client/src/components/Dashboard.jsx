import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MarketSummary from './MarketSummary';
import PortfolioSummary from './PortfolioSummary';
import LiveMarketWidget from './LiveMarketWidget';
import MarketChart from './MarketChart';
import MarketNews from './MarketNews';
import BotPerformance from './BotPerformance';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">🚀 AI Trading Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Market Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <MarketSummary />
            </div>

            {/* Portfolio Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <PortfolioSummary />
            </div>

            {/* Live Market Widget */}
            <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2 lg:col-span-1">
              <LiveMarketWidget />
            </div>

            {/* Market Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 md:col-span-2">
              <MarketChart />
            </div>

            {/* Bot Performance */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <BotPerformance />
            </div>

            {/* Market News */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <MarketNews />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
