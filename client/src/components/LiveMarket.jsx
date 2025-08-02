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
  const [selectedMarket, setSelectedMarket] = useState('us'); // 'us' or 'indian'

  useEffect(() => {
    // Initial data load
    setLoading(true);
    setMarketData(getMockMarketData(selectedMarket));
    setTopGainers(getTopGainers(selectedMarket));
    setTopLosers(getTopLosers(selectedMarket));
    setLoading(false);

    // Set up interval to update data every 3 seconds
    const intervalId = setInterval(() => {
      setMarketData(getMockMarketData(selectedMarket));
      // Occasionally update top gainers and losers (less frequently)
      if (Math.random() > 0.7) {
        setTopGainers(getTopGainers(selectedMarket));
        setTopLosers(getTopLosers(selectedMarket));
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [selectedMarket]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">📈 Live Market</h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Market:</span>
                <div className="relative">
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="us">US Market</option>
                    <option value="indian">Indian Market (NSE)</option>
                  </select>
                </div>
              </div>

              <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
                Live Data
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Market Overview Card */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedMarket === 'us' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800">NIFTY 50</h3>
                      <p className="text-2xl font-bold">22,845.30</p>
                      <p className="text-green-600">+156.35 (0.69%)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800">SENSEX</h3>
                      <p className="text-2xl font-bold">75,320.54</p>
                      <p className="text-green-600">+498.25 (0.67%)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="text-sm font-medium text-blue-800">NIFTY BANK</h3>
                      <p className="text-2xl font-bold">48,650.75</p>
                      <p className="text-red-600">-125.40 (-0.26%)</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Market Sentiment Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Market Sentiment</h2>
              <div className="flex items-center justify-center h-32">
                {selectedMarket === 'us' ? (
                  <div className="w-32 h-32 rounded-full border-8 border-green-500 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">65</p>
                      <p className="text-sm text-gray-600">Bullish</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full border-8 border-green-600 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">72</p>
                      <p className="text-sm text-gray-600">Strong Bullish</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                {selectedMarket === 'us' ? (
                  <p>US market sentiment is bullish with strong buying pressure.</p>
                ) : (
                  <p>Indian market sentiment is strongly bullish with institutional buying.</p>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-red-50 p-2 rounded">
                  <span className="text-red-600 font-medium">Bearish</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: selectedMarket === 'us' ? '15%' : '10%' }}></div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <span className="text-yellow-600 font-medium">Neutral</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: selectedMarket === 'us' ? '20%' : '18%' }}></div>
                  </div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-600 font-medium">Bullish</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: selectedMarket === 'us' ? '65%' : '72%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Market Data */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 space-y-3 md:space-y-0">
              <h2 className="text-xl font-semibold">Live Market Data</h2>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                  </div>
                  <input
                    type="search"
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search symbol..."
                  />
                </div>

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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day Range</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeTab === 'all' && Object.entries(marketData).map(([symbol, data]) => (
                      <tr key={symbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{symbol}</div>
                              <div className="text-xs text-gray-500">{selectedMarket === 'indian' ? 'NSE' : 'NASDAQ'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {selectedMarket === 'indian' ? '₹' : '$'}{data.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Open: {selectedMarket === 'indian' ? '₹' : '$'}{data.open.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(data.change, data.percentChange)}
                          <div className="text-xs text-gray-500 mt-1">
                            Prev: {selectedMarket === 'indian' ? '₹' : '$'}{data.prevClose.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <span className="text-green-600">H: {selectedMarket === 'indian' ? '₹' : '$'}{data.dayHigh.toFixed(2)}</span>
                            <br />
                            <span className="text-red-600">L: {selectedMarket === 'indian' ? '₹' : '$'}{data.dayLow.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full"
                              style={{
                                width: `${((data.price - data.dayLow) / (data.dayHigh - data.dayLow) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {data.volume.toLocaleString()}
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(data.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                              Trade
                            </button>
                            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'gainers' && topGainers.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 bg-green-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {stock.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                              <div className="text-xs text-gray-500">{stock.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {selectedMarket === 'indian' ? '₹' : '$'}{stock.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Open: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price - (stock.price * 0.01)).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.percentChange)}
                          <div className="text-xs text-gray-500 mt-1">
                            Prev: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price - stock.change).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <span className="text-green-600">H: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price + (stock.price * 0.01)).toFixed(2)}</span>
                            <br />
                            <span className="text-red-600">L: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price - (stock.price * 0.02)).toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-green-600 h-1 rounded-full"
                              style={{ width: '80%' }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(Math.floor(Math.random() * 10000000) + 1000000).toLocaleString()}
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date().toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                              Trade
                            </button>
                            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'losers' && topLosers.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                              {stock.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                              <div className="text-xs text-gray-500">{stock.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {selectedMarket === 'indian' ? '₹' : '$'}{stock.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Open: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price + Math.abs(stock.change * 0.5)).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.percentChange)}
                          <div className="text-xs text-gray-500 mt-1">
                            Prev: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price - stock.change).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <span className="text-green-600">H: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price + Math.abs(stock.change * 0.2)).toFixed(2)}</span>
                            <br />
                            <span className="text-red-600">L: {selectedMarket === 'indian' ? '₹' : '$'}{(stock.price - Math.abs(stock.change * 0.1)).toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                            <div
                              className="bg-red-600 h-1 rounded-full"
                              style={{ width: '20%' }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(Math.floor(Math.random() * 10000000) + 1000000).toLocaleString()}
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date().toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                              Trade
                            </button>
                            <button className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
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
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Latest Market News</h2>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {selectedMarket === 'us' ? (
                <>
                  <div className="border-b pb-4 hover:bg-blue-50 p-2 rounded transition-colors">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-600">Fed Signals Potential Rate Cut in September</h3>
                        <p className="text-sm text-gray-600 mt-1">Federal Reserve officials indicated they could begin cutting interest rates as early as September if inflation continues to cool.</p>
                        <p className="text-xs text-gray-500 mt-2">2 hours ago • Financial Times</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-4 hover:bg-blue-50 p-2 rounded transition-colors">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-600">Tech Stocks Rally on Strong Earnings Reports</h3>
                        <p className="text-sm text-gray-600 mt-1">Major tech companies exceeded analyst expectations, driving a broad market rally in the technology sector.</p>
                        <p className="text-xs text-gray-500 mt-2">4 hours ago • Wall Street Journal</p>
                      </div>
                    </div>
                  </div>
                  <div className="hover:bg-blue-50 p-2 rounded transition-colors">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded bg-yellow-100 flex items-center justify-center text-yellow-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-600">Oil Prices Stabilize After Recent Volatility</h3>
                        <p className="text-sm text-gray-600 mt-1">Crude oil prices have stabilized following weeks of volatility, as supply concerns ease and demand outlook improves.</p>
                        <p className="text-xs text-gray-500 mt-2">6 hours ago • Bloomberg</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-b pb-4 hover:bg-blue-50 p-2 rounded transition-colors">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded bg-green-100 flex items-center justify-center text-green-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-600">Sensex, Nifty Hit Record Highs on Strong FII Inflows</h3>
                        <p className="text-sm text-gray-600 mt-1">Indian benchmark indices Sensex and Nifty reached new all-time highs, driven by robust foreign institutional investor inflows and positive global cues.</p>
                        <p className="text-xs text-gray-500 mt-2">1 hour ago • Economic Times</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-b pb-4 hover:bg-blue-50 p-2 rounded transition-colors">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-600">RBI Maintains Repo Rate at 6.5% for Seventh Consecutive Time</h3>
                        <p className="text-sm text-gray-600 mt-1">The Reserve Bank of India's Monetary Policy Committee kept the repo rate unchanged at 6.5%, maintaining its focus on inflation control while supporting growth.</p>
                        <p className="text-xs text-gray-500 mt-2">3 hours ago • Business Standard</p>
                      </div>
                    </div>
                  </div>
                  <div className="hover:bg-blue-50 p-2 rounded transition-colors">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded bg-purple-100 flex items-center justify-center text-purple-600 mr-3 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-blue-600">IT Sector Leads Market Gains as Rupee Weakens</h3>
                        <p className="text-sm text-gray-600 mt-1">Indian IT stocks surged as the rupee depreciated against the US dollar, potentially boosting export revenues for technology companies.</p>
                        <p className="text-xs text-gray-500 mt-2">5 hours ago • Mint</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
