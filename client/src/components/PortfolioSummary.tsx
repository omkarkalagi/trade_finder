import React from 'react';

interface PortfolioData {
  totalValue: number;
  dailyPnL: number;
  totalPnL: number;
}

const PortfolioSummary = ({ data }: { data?: PortfolioData }) => {
  console.log('PortfolioSummary data:', data); // Add console log to inspect data
    // Minor change to force re-transpilation
    return (
        <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">💰 Portfolio Summary</h2>
            <div className="space-y-4">
                <div>
                    <p className="text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold">₹{data?.totalValue?.toLocaleString() ?? '0'}</p>
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
