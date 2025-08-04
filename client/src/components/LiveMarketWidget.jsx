import React, { useState, useEffect } from 'react';
import { getMockMarketData } from '../services/mockMarketData';

export default function LiveMarketWidget() {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial data load - using Indian market data
    setMarketData(getMockMarketData('indian'));
    setLoading(false);

    // Set up interval to update data every 5 seconds
    const intervalId = setInterval(() => {
      setMarketData(getMockMarketData('indian'));
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const renderPriceChange = (change, percentChange) => {
    if (change === undefined || change === null || percentChange === undefined || percentChange === null) {
      return <span className="text-gray-500">--</span>;
    }

    const isPositive = change >= 0;
    const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
    const arrow = isPositive ? '▲' : '▼';

    return (
      <span className={`${colorClass} font-medium`}>
        {arrow} {Math.abs(change).toFixed(2)} ({Math.abs(percentChange).toFixed(2)}%)
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">NSE Live Market</h2>

      {loading ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Loading market data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(marketData).slice(0, 5).map(([symbol, data]) => (
                <tr key={symbol} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{symbol}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    ₹{data?.price ? data.price.toFixed(2) : '--'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {renderPriceChange(data?.change, data?.percentChange)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
