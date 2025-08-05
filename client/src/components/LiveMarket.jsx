import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './common/LoadingSpinner';
import realTimeMarketService from '../services/realTimeMarketService';
import newsService from '../services/newsService';
import tradingService from '../services/tradingService';
import TradingModal from './TradingModal';
import Header from './Header';
import Sidebar from './Sidebar';

export default function LiveMarket() {
  const [marketData, setMarketData] = useState([]);
  const [indices, setIndices] = useState([]);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [mostActive, setMostActive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [tradingModal, setTradingModal] = useState({
    isOpen: false,
    symbol: '',
    side: 'buy',
    currentPrice: 0
  });

  useEffect(() => {
    const unsubscribe = realTimeMarketService.subscribe((data) => {
      setMarketData(data.data || []);
      setIndices(data.indices || []);
      setTopGainers(data.topGainers || []);
      setTopLosers(data.topLosers || []);
      setMostActive(data.mostActive || []);
      setIsConnected(data.isConnected);
      setLastUpdate(data.lastUpdate);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        const latestNews = await newsService.fetchLatestNews();
        setNews(latestNews.slice(0, 5)); // Show top 5 news items
      } catch (error) {
        console.error('Failed to fetch news:', error);
        setNews(newsService.getLatestNews(5)); // Fallback to cached news
      } finally {
        setNewsLoading(false);
      }
    };

    fetchNews();

    // Refresh news every 10 minutes
    const newsInterval = setInterval(fetchNews, 10 * 60 * 1000);

    return () => clearInterval(newsInterval);
  }, []);

  // Filter data based on search query and active tab
  useEffect(() => {
    let dataToFilter = [];

    if (activeTab === 'all') {
      dataToFilter = marketData.filter(data => !data.symbol.startsWith('^'));
    } else if (activeTab === 'gainers') {
      dataToFilter = topGainers;
    } else if (activeTab === 'losers') {
      dataToFilter = topLosers;
    } else if (activeTab === 'active') {
      dataToFilter = mostActive;
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      dataToFilter = dataToFilter.filter(stock =>
        stock.symbol.toLowerCase().includes(query) ||
        stock.symbol.replace('.NS', '').toLowerCase().includes(query)
      );
    }

    setFilteredData(dataToFilter);
  }, [marketData, topGainers, topLosers, mostActive, activeTab, searchQuery]);

  // Trading functions
  const handleTrade = (symbol, side, currentPrice) => {
    setTradingModal({
      isOpen: true,
      symbol,
      side,
      currentPrice
    });
  };

  const closeTradingModal = () => {
    setTradingModal({
      isOpen: false,
      symbol: '',
      side: 'buy',
      currentPrice: 0
    });
  };

  const handleAddToWatchlist = (symbol) => {
    tradingService.addToWatchlist(symbol);
    // You could add a toast notification here
  };

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

        <main className="flex-1 lg:ml-72 p-6 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">📈 Indian Stock Market (NSE)</h1>

            <div className="flex items-center space-x-4">
              <div className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center ${
                isConnected
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className={`h-2 w-2 rounded-full mr-1.5 ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                {isConnected ? 'Live Data' : 'Offline'}
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                NSE
              </div>
              {lastUpdate && (
                <div className="text-xs text-gray-500">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Market Overview Card */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {indices.slice(0, 3).map((index, i) => (
                  <div key={index.symbol} className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-800">{index.name}</h3>
                    <p className="text-2xl font-bold">
                      {index.price ? index.price.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }) : 'Loading...'}
                    </p>
                    {index.change !== undefined && (
                      <p className={index.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent?.toFixed(2)}%)
                      </p>
                    )}
                  </div>
                ))}
                {indices.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                    Loading market data...
                  </div>
                )}
              </div>
            </div>

            {/* Market Sentiment Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Market Sentiment</h2>
              <div className="flex items-center justify-center h-32">
                <div className="w-32 h-32 rounded-full border-8 border-green-600 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">72</p>
                    <p className="text-sm text-gray-600">Strong Bullish</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Indian market sentiment is strongly bullish with institutional buying.</p>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-red-50 p-2 rounded">
                  <span className="text-red-600 font-medium">Bearish</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
                <div className="bg-yellow-50 p-2 rounded">
                  <span className="text-yellow-600 font-medium">Neutral</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-600 font-medium">Bullish</span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '72%' }}></div>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search symbol (e.g., RELIANCE, TCS)..."
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
                  <button
                    onClick={() => setActiveTab('active')}
                    className={`px-3 py-1 rounded ${activeTab === 'active' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                  >
                    Most Active
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
                    {activeTab === 'all' && filteredData.map((data) => (
                      <tr key={data.symbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {data.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {data.symbol.replace('.NS', '')}
                              </div>
                              <div className="text-xs text-gray-500">NSE</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{data.price?.toFixed(2) || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Open: ₹{data.open?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(data.change, data.changePercent)}
                          <div className="text-xs text-gray-500 mt-1">
                            Prev: ₹{data.previousClose?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <span className="text-green-600">H: ₹{data.high?.toFixed(2) || 'N/A'}</span>
                            <br />
                            <span className="text-red-600">L: ₹{data.low?.toFixed(2) || 'N/A'}</span>
                          </div>
                          {data.high && data.low && data.price && (
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-blue-600 h-1 rounded-full"
                                style={{
                                  width: `${((data.price - data.low) / (data.high - data.low) * 100)}%`
                                }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {data.volume?.toLocaleString() || 'N/A'}
                          <div className="text-xs text-gray-400 mt-1">
                            {data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTrade(data.symbol, 'buy', data.price)}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => handleTrade(data.symbol, 'sell', data.price)}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                            >
                              Sell
                            </button>
                            <button
                              onClick={() => handleAddToWatchlist(data.symbol)}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              title="Add to Watchlist"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'gainers' && filteredData.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 bg-green-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                              {stock.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {stock.symbol.replace('.NS', '')}
                              </div>
                              <div className="text-xs text-gray-500">NSE</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{stock.price?.toFixed(2) || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Open: ₹{stock.open?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.changePercent)}
                          <div className="text-xs text-gray-500 mt-1">
                            Prev: ₹{stock.previousClose?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <span className="text-green-600">H: ₹{stock.high?.toFixed(2) || 'N/A'}</span>
                            <br />
                            <span className="text-red-600">L: ₹{stock.low?.toFixed(2) || 'N/A'}</span>
                          </div>
                          {stock.high && stock.low && stock.price && (
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-green-600 h-1 rounded-full"
                                style={{
                                  width: `${((stock.price - stock.low) / (stock.high - stock.low) * 100)}%`
                                }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.volume?.toLocaleString() || 'N/A'}
                          <div className="text-xs text-gray-400 mt-1">
                            {stock.timestamp ? new Date(stock.timestamp).toLocaleTimeString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTrade(stock.symbol, 'buy', stock.price)}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => handleTrade(stock.symbol, 'sell', stock.price)}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                            >
                              Sell
                            </button>
                            <button
                              onClick={() => handleAddToWatchlist(stock.symbol)}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              title="Add to Watchlist"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'losers' && filteredData.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 bg-red-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                              {stock.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {stock.symbol.replace('.NS', '')}
                              </div>
                              <div className="text-xs text-gray-500">NSE</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{stock.price?.toFixed(2) || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Open: ₹{stock.open?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.changePercent)}
                          <div className="text-xs text-gray-500 mt-1">
                            Prev: ₹{stock.previousClose?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <span className="text-green-600">H: ₹{stock.high?.toFixed(2) || 'N/A'}</span>
                            <br />
                            <span className="text-red-600">L: ₹{stock.low?.toFixed(2) || 'N/A'}</span>
                          </div>
                          {stock.high && stock.low && stock.price && (
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-red-600 h-1 rounded-full"
                                style={{
                                  width: `${((stock.price - stock.low) / (stock.high - stock.low) * 100)}%`
                                }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.volume?.toLocaleString() || 'N/A'}
                          <div className="text-xs text-gray-400 mt-1">
                            {stock.timestamp ? new Date(stock.timestamp).toLocaleTimeString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTrade(stock.symbol, 'buy', stock.price)}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => handleTrade(stock.symbol, 'sell', stock.price)}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                            >
                              Sell
                            </button>
                            <button
                              onClick={() => handleAddToWatchlist(stock.symbol)}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              title="Add to Watchlist"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {activeTab === 'active' && filteredData.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50 bg-purple-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                              {stock.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {stock.symbol.replace('.NS', '')}
                              </div>
                              <div className="text-xs text-gray-500">NSE</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ₹{stock.price?.toFixed(2) || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Open: ₹{stock.open?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.changePercent)}
                          <div className="text-xs text-gray-500 mt-1">
                            Prev: ₹{stock.previousClose?.toFixed(2) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs text-gray-500">
                            <span className="text-green-600">H: ₹{stock.high?.toFixed(2) || 'N/A'}</span>
                            <br />
                            <span className="text-red-600">L: ₹{stock.low?.toFixed(2) || 'N/A'}</span>
                          </div>
                          {stock.high && stock.low && stock.price && (
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div
                                className="bg-purple-600 h-1 rounded-full"
                                style={{
                                  width: `${((stock.price - stock.low) / (stock.high - stock.low) * 100)}%`
                                }}
                              ></div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="font-semibold text-purple-600">
                            {stock.volume?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {stock.timestamp ? new Date(stock.timestamp).toLocaleTimeString() : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleTrade(stock.symbol, 'buy', stock.price)}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs"
                            >
                              Buy
                            </button>
                            <button
                              onClick={() => handleTrade(stock.symbol, 'sell', stock.price)}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                            >
                              Sell
                            </button>
                            <button
                              onClick={() => handleAddToWatchlist(stock.symbol)}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                              title="Add to Watchlist"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* No results found message */}
                    {filteredData.length === 0 && searchQuery.trim() && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-lg font-medium">No stocks found</p>
                            <p className="text-sm">Try searching for a different symbol like "RELIANCE", "TCS", or "HDFC"</p>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Loading state for empty data */}
                    {filteredData.length === 0 && !searchQuery.trim() && marketData.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                            <p>Loading market data...</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Market News */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Latest Market News</h2>
              <Link to="/news" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {newsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner text="Loading news..." />
              </div>
            ) : (
              <div className="space-y-4">
                {news.map((newsItem) => (
                  <div key={newsItem.id} className="border-b pb-4 hover:bg-blue-50 p-2 rounded transition-colors cursor-pointer">
                    <div className="flex items-start">
                      <div className={`h-10 w-10 rounded flex items-center justify-center mr-3 mt-1 ${
                        newsItem.sentiment === 'positive' ? 'bg-green-100 text-green-600' :
                        newsItem.sentiment === 'negative' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {newsItem.category === 'Market' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        )}
                        {newsItem.category === 'Policy' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {newsItem.category === 'Earnings' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                        {(newsItem.category === 'Sector' || newsItem.category === 'General') && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium text-blue-600 hover:text-blue-800 line-clamp-2">
                            {newsItem.title}
                          </h3>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                            newsItem.category === 'Market' ? 'bg-blue-100 text-blue-800' :
                            newsItem.category === 'Policy' ? 'bg-purple-100 text-purple-800' :
                            newsItem.category === 'Earnings' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {newsItem.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {newsItem.summary}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {new Date(newsItem.timestamp).toLocaleString()} • {newsItem.source}
                          </p>
                          {newsItem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {newsItem.tags.slice(0, 2).map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {news.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                    <p>No news available at the moment</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Trading Modal */}
      <TradingModal
        isOpen={tradingModal.isOpen}
        onClose={closeTradingModal}
        symbol={tradingModal.symbol}
        side={tradingModal.side}
        currentPrice={tradingModal.currentPrice}
      />
    </div>
  );
}
