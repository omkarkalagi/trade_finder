import React, { useState, useEffect } from 'react';
import LoadingSpinner from './common/LoadingSpinner';
import { getMockMarketData, getTopGainers, getTopLosers } from '../services/mockMarketData';
import Header from './Header';
import Sidebar from './Sidebar';

export default function LiveMarket() {
  const [marketData, setMarketData] = useState({});
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Initial data load
    setMarketData(getMockMarketData());
    setTopGainers(getTopGainers());
    setTopLosers(getTopLosers());
    setLoading(false);

    // Set up interval to update data every 3 seconds
    const intervalId = setInterval(() => {
      setMarketData(getMockMarketData());
      // Occasionally update top gainers and losers (less frequently)
      if (Math.random() > 0.7) {
        setTopGainers(getTopGainers());
        setTopLosers(getTopLosers());
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const renderPriceChange = (change, percentChange) => {
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
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">📈 Live Market</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Market Overview Card */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">S&P 500</h3>
                  <p className="text-2xl font-bold">4,783.45</p>
                  <p className="text-green-600">+12.45 (0.26%)</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">NASDAQ</h3>
                  <p className="text-2xl font-bold">16,742.39</p>
                  <p className="text-green-600">+32.78 (0.20%)</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800">DOW JONES</h3>
                  <p className="text-2xl font-bold">38,239.98</p>
                  <p className="text-red-600">-45.63 (-0.12%)</p>
                </div>
              </div>
            </div>

            {/* Market Sentiment Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Market Sentiment</h2>
              <div className="flex items-center justify-center h-32">
                <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">65</p>
                    <p className="text-sm text-gray-600">Bullish</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Market sentiment is currently bullish with strong buying pressure.</p>
              </div>
            </div>
          </div>

          {/* Live Market Data */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Live Market Data</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                  All Stocks
                </button>
                <button
                  onClick={() => setActiveTab('gainers')}
                  className={`px-3 py-1 rounded ${activeTab === 'gainers' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                >
                  Top Gainers
                </button>
                <button
                  onClick={() => setActiveTab('losers')}
                  className={`px-3 py-1 rounded ${activeTab === 'losers' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}
                >
                  Top Losers
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeTab === 'all' && Object.entries(marketData).map(([symbol, data]) => (
                      <tr key={symbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{symbol}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${data.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(data.change, data.percentChange)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {data.volume.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'gainers' && topGainers.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                            <div className="ml-2 text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${stock.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.percentChange)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(Math.floor(Math.random() * 10000000) + 1000000).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'losers' && topLosers.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                            <div className="ml-2 text-xs text-gray-500">{stock.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${stock.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.percentChange)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(Math.floor(Math.random() * 10000000) + 1000000).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date().toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Market News */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Latest Market News</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium text-blue-600">Fed Signals Potential Rate Cut in September</h3>
                <p className="text-sm text-gray-600 mt-1">Federal Reserve officials indicated they could begin cutting interest rates as early as September if inflation continues to cool.</p>
                <p className="text-xs text-gray-500 mt-2">2 hours ago • Financial Times</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium text-blue-600">Tech Stocks Rally on Strong Earnings Reports</h3>
                <p className="text-sm text-gray-600 mt-1">Major tech companies exceeded analyst expectations, driving a broad market rally in the technology sector.</p>
                <p className="text-xs text-gray-500 mt-2">4 hours ago • Wall Street Journal</p>
              </div>
              <div>
                <h3 className="font-medium text-blue-600">Oil Prices Stabilize After Recent Volatility</h3>
                <p className="text-sm text-gray-600 mt-1">Crude oil prices have stabilized following weeks of volatility, as supply concerns ease and demand outlook improves.</p>
                <p className="text-xs text-gray-500 mt-2">6 hours ago • Bloomberg</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
