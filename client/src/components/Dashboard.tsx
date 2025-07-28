import React from 'react';
import LiveMarket from './LiveMarket';
import BotPerformance from './BotPerformance';
import PortfolioSummary from './PortfolioSummary';
import TradingPanel from './TradingPanel';
import MarketNews from './MarketNews';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <h1 className="text-3xl font-bold mb-6">🚀 AI Trading Dashboard</h1>
        </div>

        {/* Real-time Market */}
        <div className="col-span-12 lg:col-span-8">
          <LiveMarket />
        </div>

        {/* Portfolio Summary */}
        <div className="col-span-12 lg:col-span-4">
          <PortfolioSummary />
        </div>

        {/* Bot Performance */}
        <div className="col-span-12">
          <BotPerformance />
        </div>

        {/* Trading Panel */}
        <div className="col-span-12 md:col-span-6">
          <TradingPanel />
        </div>

        {/* Risk Monitor */}
        <div className="col-span-12 md:col-span-6">
          {/* Remove RiskMonitor or replace with custom component */}
          <div className="bg-white p-4 rounded shadow">Risk Monitor Placeholder</div>
        </div>

        {/* Market News */}
        <div className="col-span-12">
          <MarketNews />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
