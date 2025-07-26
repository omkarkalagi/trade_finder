import React from 'react';

const Watchlist = () => {
  const watchlist = [
    { symbol: 'RELIANCE', price: 2450.75, change: 12.50, changePercent: 0.51 },
    { symbol: 'HDFCBANK', price: 1650.30, change: 8.45, changePercent: 0.51 },
    { symbol: 'TCS', price: 3250.25, change: -15.75, changePercent: -0.48 },
    { symbol: 'INFY', price: 1425.50, change: 22.25, changePercent: 1.58 },
    { symbol: 'BAJFINANCE', price: 7250.00, change: 125.50, changePercent: 1.76 }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Watchlist</h2>
      
      <div className="space-y-3">
        {watchlist.map((stock, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="font-medium">{stock.symbol}</div>
            <div className="text-right">
              <div className="font-semibold">₹{stock.price.toFixed(2)}</div>
              <div className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change.toFixed(2))} ({stock.changePercent}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist; 