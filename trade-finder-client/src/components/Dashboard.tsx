import React from 'react';
import LiveMarket from './LiveMarket';
import PortfolioSummary from './PortfolioSummary';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🚀 AI Trading Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LiveMarket />
        </div>

        <div className="lg:col-span-1">
          <PortfolioSummary />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Market Insights</h2>
        <p className="text-gray-600">
          Real-time market data and AI-powered insights will appear here once fully integrated.
          Focused on delivering a beautiful, functional trading experience.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
