import React, { useState, useEffect } from 'react';

interface PortfolioData {
  totalValue: number;
  dailyPnL: number;
  totalPnL: number;
}

interface PortfolioSummaryProps {
  isConnected?: boolean;
  portfolioSummary?: any;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ isConnected, portfolioSummary }) => {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    if (isConnected && portfolioSummary) {
      // Use Zerodha data
      setData({
        totalValue: parseFloat(portfolioSummary.currentValue),
        dailyPnL: parseFloat(portfolioSummary.totalPnL) * 0.1, // Simulate daily P&L
        totalPnL: parseFloat(portfolioSummary.totalPnL),
      });
    } else {
      // Use mock data
      fetchPortfolioData().then(setData);
    }
  }, [isConnected, portfolioSummary]);

  if (!data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <span className="mr-2">💰</span>
          Portfolio Summary
        </h2>
        {isConnected && (
          <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">Total Portfolio Value</p>
          <p className="text-3xl font-bold text-gray-900">₹{data.totalValue.toLocaleString()}</p>
          {isConnected && portfolioSummary && (
            <p className="text-xs text-gray-500 mt-1">
              {portfolioSummary.stockCount} stocks • Investment: ₹{parseFloat(portfolioSummary.totalInvestment).toLocaleString()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className={`rounded-lg p-3 ${data.dailyPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-xs text-gray-600">Today's P&L</p>
            <p className={`text-lg font-bold ${data.dailyPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.dailyPnL >= 0 ? '+' : ''}₹{Math.abs(data.dailyPnL).toLocaleString()}
            </p>
          </div>

          <div className={`rounded-lg p-3 ${data.totalPnL >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <p className="text-xs text-gray-600">Total P&L</p>
            <p className={`text-lg font-bold ${data.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.totalPnL >= 0 ? '+' : ''}₹{Math.abs(data.totalPnL).toLocaleString()}
            </p>
            {isConnected && portfolioSummary && (
              <p className={`text-xs ${data.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({portfolioSummary.totalPnLPercentage}%)
              </p>
            )}
          </div>
        </div>

        {!isConnected && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs text-orange-700 text-center">
              📊 Connect to Zerodha for live portfolio data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSummary;

// Placeholder for fetching portfolio data
const fetchPortfolioData = async (): Promise<PortfolioData> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalValue: 123456.78,
        dailyPnL: 123.45,
        totalPnL: 5678.90,
      });
    }, 1000); // Simulate 1 second loading time
  });
};

// Placeholder for a loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    <p className="text-gray-500">Loading portfolio data...</p>
  </div>
)
