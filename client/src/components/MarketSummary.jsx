import React from 'react';

const MarketSummary = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
        <h3 className="font-bold">NIFTY 50</h3>
        <div className="text-2xl font-bold mt-2">18,200.15</div>
        <div className="text-green-300">+45.30 (0.25%)</div>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
        <h3 className="font-bold">SENSEX</h3>
        <div className="text-2xl font-bold mt-2">61,350.45</div>
        <div className="text-green-300">+120.75 (0.20%)</div>
      </div>
      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white">
        <h3 className="font-bold">BANK NIFTY</h3>
        <div className="text-2xl font-bold mt-2">39,500.75</div>
        <div className="text-green-300">+95.50 (0.24%)</div>
      </div>
    </div>
  );
};

export default MarketSummary; 