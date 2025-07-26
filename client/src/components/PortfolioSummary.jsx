import React from 'react';

const PortfolioSummary = () => {
  const portfolio = {
    totalValue: 125000,
    dayGain: 2500,
    totalGain: 15000,
    stocks: [
      { symbol: 'RELIANCE', quantity: 10, avgPrice: 2400, ltp: 2450 },
      { symbol: 'HDFCBANK', quantity: 15, avgPrice: 1600, ltp: 1650 },
      { symbol: 'TCS', quantity: 20, avgPrice: 3200, ltp: 3250 },
    ]
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Portfolio Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-500">Total Value</div>
          <div className="text-2xl font-bold">₹{portfolio.totalValue.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-500">Day's Gain</div>
          <div className="text-2xl font-bold text-green-600">+₹{portfolio.dayGain.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg col-span-2">
          <div className="text-gray-500">Total Gain</div>
          <div className="text-2xl font-bold text-green-600">+₹{portfolio.totalGain.toLocaleString()}</div>
        </div>
      </div>
      
      <h3 className="font-medium text-gray-700 mb-2">Holdings</h3>
      <div className="space-y-3">
        {portfolio.stocks.map((stock, index) => (
          <div key={index} className="flex justify-between items-center border-b pb-2">
            <div>
              <div className="font-medium">{stock.symbol}</div>
              <div className="text-sm text-gray-500">{stock.quantity} shares</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">₹{stock.ltp.toLocaleString()}</div>
              <div className="text-sm text-green-600">
                +₹{(stock.ltp - stock.avgPrice).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioSummary; 