import React from 'react';
import LiveMarket from './LiveMarket';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">🚀 AI Trading Dashboard</h1>
      <LiveMarket />
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trading Insights</h2>
        <p className="text-gray-600">
          Real-time market data and AI-powered insights will appear here once fully integrated.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
