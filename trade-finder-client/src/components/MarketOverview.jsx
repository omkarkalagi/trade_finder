import React from 'react';

const MarketOverview = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Live Market</h2>
        <div className="text-center py-8 text-gray-500">
          Loading market data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Live Market</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-right">Price</th>
              <th className="px-4 py-2 text-right">Change</th>
              <th className="px-4 py-2 text-right">Change %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((stock, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                <td className="px-4 py-2 font-medium">{stock.symbol}</td>
                <td className="px-4 py-2 text-right font-semibold">
                  ₹{stock.price.toFixed(2)}
                </td>
                <td className={`px-4 py-2 text-right ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change.toFixed(2))}
                </td>
                <td className={`px-4 py-2 text-right ${
                  stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.changePercent}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketOverview; 