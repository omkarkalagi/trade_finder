import React from 'react';

const MarketSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Market Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">{key.toUpperCase()}</h3>
            <p className="text-2xl font-bold mt-2">₹{value.price.toLocaleString()}</p>
            <p className={`mt-1 ${value.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {value.change >= 0 ? '↑' : '↓'} {Math.abs(value.change)} ({value.changePercent}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSummary;
