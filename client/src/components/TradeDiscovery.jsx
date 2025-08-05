import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { getMockMarketData } from '../services/mockMarketData';
import LoadingSpinner from './common/LoadingSpinner';

// Mock scanner presets
const SCANNER_PRESETS = [
  { id: 1, name: 'Volume Breakouts', description: 'Stocks with unusual volume increase', category: 'Technical' },
  { id: 2, name: 'RSI Oversold', description: 'Stocks with RSI below 30', category: 'Technical' },
  { id: 3, name: 'Golden Cross', description: 'Stocks where 50 EMA crosses above 200 EMA', category: 'Technical' },
  { id: 4, name: 'Earnings Surprise', description: 'Stocks that beat earnings expectations', category: 'Fundamental' },
  { id: 5, name: 'Insider Buying', description: 'Stocks with recent insider purchases', category: 'Fundamental' },
  { id: 6, name: 'Unusual Options Activity', description: 'Stocks with unusual options volume', category: 'Options' },
  { id: 7, name: 'Gap Up', description: 'Stocks that opened significantly higher', category: 'Technical' },
  { id: 8, name: 'Bollinger Band Squeeze', description: 'Stocks with narrowing Bollinger Bands', category: 'Technical' },
];

// Mock filter categories
const FILTER_CATEGORIES = [
  { id: 'price', name: 'Price', type: 'range' },
  { id: 'volume', name: 'Volume', type: 'range' },
  { id: 'marketCap', name: 'Market Cap', type: 'range' },
  { id: 'sector', name: 'Sector', type: 'select' },
  { id: 'technicals', name: 'Technical Indicators', type: 'multi' },
  { id: 'fundamentals', name: 'Fundamentals', type: 'multi' },
  { id: 'patterns', name: 'Chart Patterns', type: 'multi' },
  { id: 'options', name: 'Options Data', type: 'multi' },
];

// Mock sectors for filter
const SECTORS = [
  'Technology', 'Healthcare', 'Financial Services', 'Consumer Cyclical',
  'Industrials', 'Communication Services', 'Utilities', 'Basic Materials',
  'Consumer Defensive', 'Real Estate', 'Energy'
];

// Mock technical indicators
const TECHNICAL_INDICATORS = [
  'RSI', 'MACD', 'Moving Averages', 'Bollinger Bands', 'Stochastic',
  'ADX', 'OBV', 'ATR', 'Ichimoku Cloud', 'Fibonacci Levels'
];

// Mock chart patterns
const CHART_PATTERNS = [
  'Double Top', 'Double Bottom', 'Head and Shoulders', 'Inverse Head and Shoulders',
  'Triangle', 'Flag', 'Pennant', 'Cup and Handle', 'Wedge', 'Channel'
];

// Mock scan results
const generateMockScanResults = (preset) => {
  const results = [];
  const marketData = getMockMarketData('indian');

  // Convert market data to array and sort by different criteria based on preset
  const stocksArray = Object.entries(marketData).map(([symbol, data]) => ({
    symbol,
    ...data
  }));

  let filteredStocks = [];

  switch(preset.id) {
    case 1: // Volume Breakouts
      filteredStocks = stocksArray
        .sort((a, b) => b.volume - a.volume)
        .slice(0, 15);
      break;
    case 2: // RSI Oversold
      filteredStocks = stocksArray
        .filter(stock => Math.random() < 0.3) // Simulate RSI < 30
        .slice(0, 15);
      break;
    case 3: // Golden Cross
      filteredStocks = stocksArray
        .filter(stock => Math.random() < 0.2) // Simulate golden cross
        .slice(0, 15);
      break;
    case 4: // Earnings Surprise
      filteredStocks = stocksArray
        .filter(stock => Math.random() < 0.25) // Simulate earnings surprise
        .slice(0, 15);
      break;
    case 5: // Insider Buying
      filteredStocks = stocksArray
        .filter(stock => Math.random() < 0.15) // Simulate insider buying
        .slice(0, 15);
      break;
    case 6: // Unusual Options Activity
      filteredStocks = stocksArray
        .filter(stock => Math.random() < 0.2) // Simulate unusual options
        .slice(0, 15);
      break;
    case 7: // Gap Up
      filteredStocks = stocksArray
        .filter(stock => stock.change > 0 && Math.random() < 0.3) // Simulate gap up
        .slice(0, 15);
      break;
    case 8: // Bollinger Band Squeeze
      filteredStocks = stocksArray
        .filter(stock => Math.random() < 0.15) // Simulate BB squeeze
        .slice(0, 15);
      break;
    default:
      filteredStocks = stocksArray.slice(0, 15);
  }

  // Add additional scan-specific data
  return filteredStocks.map(stock => {
    // Generate random values for scan-specific metrics
    const scanData = {
      signal: Math.random() > 0.7 ? 'Strong Buy' : Math.random() > 0.4 ? 'Buy' : 'Neutral',
      strength: Math.floor(Math.random() * 100),
      timeFrame: ['1D', '1W', '1M'][Math.floor(Math.random() * 3)],
      sector: SECTORS[Math.floor(Math.random() * SECTORS.length)],
      patternDetected: Math.random() > 0.7 ? CHART_PATTERNS[Math.floor(Math.random() * CHART_PATTERNS.length)] : null,
      rsi: Math.floor(Math.random() * 100),
      volume24hChange: (Math.random() * 200 - 100).toFixed(2),
    };

    return {
      ...stock,
      ...scanData
    };
  });
};

export default function TradeDiscovery() {
  const [activePreset, setActivePreset] = useState(SCANNER_PRESETS[0]);
  const [scanResults, setScanResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    price: { min: 0, max: 5000 },
    volume: { min: 0, max: 10000000 },
    marketCap: { min: 0, max: 1000000 },
    sector: [],
    technicals: [],
    patterns: []
  });

  // Load scan results when preset changes
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const results = generateMockScanResults(activePreset);
      setScanResults(results);
      setLoading(false);
    }, 800);
  }, [activePreset]);

  // Handle filter changes
  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Render signal badge with appropriate color
  const renderSignalBadge = (signal) => {
    let bgColor = 'bg-gray-100 text-gray-800';

    if (signal === 'Strong Buy') {
      bgColor = 'bg-green-100 text-green-800';
    } else if (signal === 'Buy') {
      bgColor = 'bg-blue-100 text-blue-800';
    } else if (signal === 'Sell') {
      bgColor = 'bg-red-100 text-red-800';
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {signal}
      </span>
    );
  };

  // Render price change with appropriate color
  const renderPriceChange = (change, percentChange) => {
    const isPositive = change >= 0;
    const textColor = isPositive ? 'text-green-600' : 'text-red-600';
    const sign = isPositive ? '+' : '';

    return (
      <div className={textColor}>
        <span>{sign}{change.toFixed(2)}</span>
        <span className="ml-1">({sign}{percentChange.toFixed(2)}%)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 lg:ml-72 p-6 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">🔍 Trade Discovery Engine</h1>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                NSE
              </div>
              <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5"></span>
                Live Scanning
              </div>
            </div>
          </div>

          {/* Scanner Presets */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Scanner Presets</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {SCANNER_PRESETS.map(preset => (
                <div
                  key={preset.id}
                  onClick={() => setActivePreset(preset)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    activePreset.id === preset.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-gray-100 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      preset.category === 'Technical' ? 'bg-blue-500' :
                      preset.category === 'Fundamental' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <h3 className="font-medium text-sm">{preset.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{preset.description}</p>
                </div>
              ))}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-3">Advanced Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Price Range Filter */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (₹)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={selectedFilters.price.min}
                        onChange={(e) => handleFilterChange('price', {...selectedFilters.price, min: Number(e.target.value)})}
                        className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={selectedFilters.price.max}
                        onChange={(e) => handleFilterChange('price', {...selectedFilters.price, max: Number(e.target.value)})}
                        className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Volume Filter */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Volume</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={selectedFilters.volume.min}
                        onChange={(e) => handleFilterChange('volume', {...selectedFilters.volume, min: Number(e.target.value)})}
                        className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        value={selectedFilters.volume.max}
                        onChange={(e) => handleFilterChange('volume', {...selectedFilters.volume, max: Number(e.target.value)})}
                        className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  {/* Sector Filter */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                    <select
                      multiple
                      className="block w-full p-2 text-sm border border-gray-300 rounded-md h-24"
                      value={selectedFilters.sector}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        handleFilterChange('sector', values);
                      }}
                    >
                      {SECTORS.map(sector => (
                        <option key={sector} value={sector}>{sector}</option>
                      ))}
                    </select>
                  </div>

                  {/* Technical Indicators */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technical Indicators</label>
                    <select
                      multiple
                      className="block w-full p-2 text-sm border border-gray-300 rounded-md h-24"
                      value={selectedFilters.technicals}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        handleFilterChange('technicals', values);
                      }}
                    >
                      {TECHNICAL_INDICATORS.map(indicator => (
                        <option key={indicator} value={indicator}>{indicator}</option>
                      ))}
                    </select>
                  </div>

                  {/* Chart Patterns */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chart Patterns</label>
                    <select
                      multiple
                      className="block w-full p-2 text-sm border border-gray-300 rounded-md h-24"
                      value={selectedFilters.patterns}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value);
                        handleFilterChange('patterns', values);
                      }}
                    >
                      {CHART_PATTERNS.map(pattern => (
                        <option key={pattern} value={pattern}>{pattern}</option>
                      ))}
                    </select>
                  </div>

                  {/* Apply Filters Button */}
                  <div className="md:col-span-3 mt-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                      Apply Filters
                    </button>
                    <button className="ml-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scan Results */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Scan Results</h2>
                <p className="text-sm text-gray-500">Showing results for "{activePreset.name}"</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Export
                </button>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RSI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pattern</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {scanResults.map((stock) => (
                      <tr key={stock.symbol} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {stock.symbol.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{stock.symbol}</div>
                              <div className="text-xs text-gray-500">NSE</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">₹{stock.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderPriceChange(stock.change, stock.percentChange)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderSignalBadge(stock.signal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.sector}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stock.volume.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            {stock.volume24hChange > 0 ? (
                              <span className="text-green-600">+{stock.volume24hChange}%</span>
                            ) : (
                              <span className="text-red-600">{stock.volume24hChange}%</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm ${
                              stock.rsi < 30 ? 'text-red-600' :
                              stock.rsi > 70 ? 'text-green-600' : 'text-gray-600'
                            }`}>{stock.rsi}</span>
                            <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  stock.rsi < 30 ? 'bg-red-500' :
                                  stock.rsi > 70 ? 'bg-green-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${stock.rsi}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stock.patternDetected ? (
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                              {stock.patternDetected}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
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

          {/* Pattern Recognition */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">AI Pattern Recognition</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Double Bottom</h3>
                    <p className="text-xs text-gray-500 mt-1">Bullish reversal pattern</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    3 Stocks
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>INFY</span>
                    <span className="text-green-600">98% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>RELIANCE</span>
                    <span className="text-green-600">92% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>HDFCBANK</span>
                    <span className="text-green-600">87% Match</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Cup and Handle</h3>
                    <p className="text-xs text-gray-500 mt-1">Bullish continuation pattern</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    2 Stocks
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>TCS</span>
                    <span className="text-green-600">95% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>WIPRO</span>
                    <span className="text-green-600">89% Match</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Head and Shoulders</h3>
                    <p className="text-xs text-gray-500 mt-1">Bearish reversal pattern</p>
                  </div>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    4 Stocks
                  </span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>SUNPHARMA</span>
                    <span className="text-red-600">96% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>TATASTEEL</span>
                    <span className="text-red-600">93% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>ICICIBANK</span>
                    <span className="text-red-600">91% Match</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>AXISBANK</span>
                    <span className="text-red-600">85% Match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Create Custom Scanner */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Custom Scanner</h2>
              <div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Create New
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Saved Custom Scanners</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                    <div>
                      <h4 className="font-medium text-sm">My Momentum Scanner</h4>
                      <p className="text-xs text-gray-500">Volume &gt; 1M, Price &gt; 100, RSI &gt; 60</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                    <div>
                      <h4 className="font-medium text-sm">Oversold Opportunities</h4>
                      <p className="text-xs text-gray-500">RSI &lt; 30, MACD Crossover, Volume Spike</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Scanner Builder</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Create a custom scanner by combining multiple technical and fundamental criteria.
                </p>
                <button className="w-full bg-blue-100 text-blue-800 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Open Scanner Builder
                </button>
                <div className="mt-3 text-xs text-gray-500">
                  <p>Pro Tip: Combine volume, price action, and momentum indicators for best results.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
