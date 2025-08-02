import React, { useState, useEffect } from 'react';

interface PortfolioData {
  totalValue: number;
  dailyPnL: number;
  totalPnL: number;
}

const PortfolioSummary = () => {
  const [data, setData] = useState<PortfolioData | null>(null);

  useEffect(() => {
    fetchPortfolioData().then(setData);
  }, []);

  if (!data) {
    return <LoadingSpinner />;
  }

  console.log('PortfolioSummary data:', data); // Add console log to inspect data
    // Minor change to force re-transpilation
    return (
        <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Portfolio Summary</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">₹{data.totalValue.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Today&#39;s Profit & Loss</p>
                    <p className={`text-xl font-bold ${(data?.dailyPnL ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(data?.dailyPnL ?? 0) >= 0 ? '+' : ''}₹{(data?.dailyPnL ?? 0).toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600">Total P&L</p>
                    <p className={`text-xl font-bold ${(data?.totalPnL ?? 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {(data?.totalPnL ?? 0) >= 0 ? '+' : ''}₹{(data?.totalPnL ?? 0).toLocaleString()}
                    </p>
                </div>
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
