import React, { useState } from 'react';
import {
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

const SectorAnalysis = () => {
  const [selectedSector, setSelectedSector] = useState('technology');

  const sectors = [
    {
      id: 'technology',
      name: 'Technology',
      change: 2.34,
      volume: '1.2B',
      marketCap: '45.6T',
      topStocks: ['TCS', 'INFY', 'WIPRO'],
      performance: 85
    },
    {
      id: 'banking',
      name: 'Banking & Finance',
      change: -0.87,
      volume: '2.1B',
      marketCap: '38.9T',
      topStocks: ['HDFC', 'ICICI', 'SBI'],
      performance: 62
    },
    {
      id: 'energy',
      name: 'Energy',
      change: 1.56,
      volume: '890M',
      marketCap: '12.3T',
      topStocks: ['RELIANCE', 'ONGC', 'IOC'],
      performance: 78
    },
    {
      id: 'healthcare',
      name: 'Healthcare',
      change: 0.92,
      volume: '650M',
      marketCap: '8.7T',
      topStocks: ['SUNPHARMA', 'DRREDDY', 'CIPLA'],
      performance: 71
    },
    {
      id: 'automotive',
      name: 'Automotive',
      change: -1.23,
      volume: '450M',
      marketCap: '6.2T',
      topStocks: ['TATAMOTORS', 'MARUTI', 'BAJAJ'],
      performance: 45
    },
    {
      id: 'consumer',
      name: 'Consumer Goods',
      change: 0.45,
      volume: '320M',
      marketCap: '4.8T',
      topStocks: ['HUL', 'ITC', 'NESTLE'],
      performance: 68
    }
  ];

  const selectedSectorData = sectors.find(s => s.id === selectedSector);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sector Analysis</h1>
          <p className="text-gray-600 mt-2">Comprehensive sector-wise market analysis and performance metrics</p>
        </div>

        {/* Sector Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedSector === sector.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedSector(sector.id)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{sector.name}</h3>
                <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Change</span>
                  <span className={`font-semibold ${
                    sector.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {sector.change >= 0 ? '+' : ''}{sector.change}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Volume</span>
                  <span className="font-semibold text-gray-900">{sector.volume}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Market Cap</span>
                  <span className="font-semibold text-gray-900">{sector.marketCap}</span>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Performance</span>
                    <span>{sector.performance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        sector.performance >= 80 ? 'bg-green-500' :
                        sector.performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${sector.performance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Sector Details */}
        {selectedSectorData && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedSectorData.name} Sector</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedSectorData.change >= 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedSectorData.change >= 0 ? '+' : ''}{selectedSectorData.change}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Top Stocks</h4>
                <div className="space-y-2">
                  {selectedSectorData.topStocks.map((stock, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{stock}</span>
                      <span className="text-sm text-gray-600">₹{Math.floor(Math.random() * 5000) + 1000}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Sector Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">P/E Ratio</span>
                    <span className="text-sm font-medium">{(Math.random() * 20 + 15).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ROE</span>
                    <span className="text-sm font-medium">{(Math.random() * 10 + 8).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Debt/Equity</span>
                    <span className="text-sm font-medium">{(Math.random() * 0.5 + 0.3).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Market Share</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Large Cap</span>
                    <span className="text-sm font-medium">{(Math.random() * 30 + 40).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Mid Cap</span>
                    <span className="text-sm font-medium">{(Math.random() * 20 + 30).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Small Cap</span>
                    <span className="text-sm font-medium">{(Math.random() * 15 + 15).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sector Performance Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Sector Performance Comparison</h3>
          <div className="h-64 bg-gray-50 rounded-lg p-4">
            <div className="h-full flex items-end justify-between space-x-2">
              {sectors.map((sector, index) => {
                const height = Math.abs(sector.change) * 10 + 20; // Scale for visualization
                return (
                  <div key={sector.id} className="flex-1 flex flex-col items-center">
                    <div
                      className={`w-full rounded-t ${
                        sector.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2 text-center">
                      {sector.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sector Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Best Performer</p>
                <p className="text-lg font-bold text-green-600">Technology</p>
                <p className="text-sm text-gray-600">+2.34%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingDownIcon className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Worst Performer</p>
                <p className="text-lg font-bold text-red-600">Automotive</p>
                <p className="text-sm text-gray-600">-1.23%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Market Cap</p>
                <p className="text-lg font-bold text-gray-900">₹116.5T</p>
                <p className="text-sm text-gray-600">All Sectors</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-lg font-bold text-gray-900">68.3%</p>
                <p className="text-sm text-gray-600">Sector Average</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sector News & Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector News</h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Technology Sector Leads Market Rally</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Tech stocks continue to outperform with strong earnings and AI adoption driving growth...
                </p>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Banking Sector Faces Regulatory Changes</h4>
                <p className="text-sm text-gray-600 mb-2">
                  New RBI guidelines impact banking stocks as sector adjusts to regulatory framework...
                </p>
                <span className="text-xs text-gray-500">4 hours ago</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Energy Sector Benefits from Global Trends</h4>
                <p className="text-sm text-gray-600 mb-2">
                  Rising oil prices and renewable energy investments boost energy sector performance...
                </p>
                <span className="text-xs text-gray-500">6 hours ago</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Insights</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Strong Buy Recommendations</h4>
                <p className="text-sm text-blue-700">
                  Technology and Healthcare sectors show strong fundamentals with positive outlook
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Watch List</h4>
                <p className="text-sm text-yellow-700">
                  Banking sector under pressure, monitor for entry opportunities
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Caution</h4>
                <p className="text-sm text-red-700">
                  Automotive sector facing headwinds, consider reducing exposure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectorAnalysis;
