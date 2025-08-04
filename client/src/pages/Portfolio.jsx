import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('1D');

  // Mock portfolio data
  const mockPortfolioData = {
    totalValue: 125750.50,
    dailyChange: 1250.75,
    dailyChangePercent: 1.005,
    totalReturn: 15750.50,
    totalReturnPercent: 14.31,
    buyingPower: 25000.00,
    cash: 5250.00,
    positions: [
      {
        symbol: 'AAPL',
        company: 'Apple Inc.',
        shares: 50,
        avgPrice: 175.30,
        currentPrice: 178.25,
        marketValue: 8912.50,
        dayChange: 147.50,
        dayChangePercent: 1.68,
        totalReturn: 147.50,
        totalReturnPercent: 1.68
      },
      {
        symbol: 'MSFT',
        company: 'Microsoft Corporation',
        shares: 25,
        avgPrice: 340.80,
        currentPrice: 345.60,
        marketValue: 8640.00,
        dayChange: 120.00,
        dayChangePercent: 1.41,
        totalReturn: 120.00,
        totalReturnPercent: 1.41
      },
      {
        symbol: 'GOOGL',
        company: 'Alphabet Inc.',
        shares: 30,
        avgPrice: 142.50,
        currentPrice: 145.20,
        marketValue: 4356.00,
        dayChange: 81.00,
        dayChangePercent: 1.89,
        totalReturn: 81.00,
        totalReturnPercent: 1.89
      },
      {
        symbol: 'TSLA',
        company: 'Tesla Inc.',
        shares: 15,
        avgPrice: 210.40,
        currentPrice: 205.80,
        marketValue: 3087.00,
        dayChange: -69.00,
        dayChangePercent: -2.19,
        totalReturn: -69.00,
        totalReturnPercent: -2.19
      },
      {
        symbol: 'NVDA',
        company: 'NVIDIA Corporation',
        shares: 20,
        avgPrice: 520.75,
        currentPrice: 545.30,
        marketValue: 10906.00,
        dayChange: 491.00,
        dayChangePercent: 4.71,
        totalReturn: 491.00,
        totalReturnPercent: 4.71
      }
    ],
    sectors: [
      { name: 'Technology', allocation: 65.5, value: 82266.75, change: 2.15 },
      { name: 'Consumer Discretionary', allocation: 20.2, value: 25400.10, change: -1.85 },
      { name: 'Healthcare', allocation: 8.1, value: 10185.79, change: 0.95 },
      { name: 'Financial Services', allocation: 6.2, value: 7797.86, change: 1.25 }
    ],
    performance: {
      '1D': { return: 1.005, benchmark: 0.85 },
      '1W': { return: 3.25, benchmark: 2.10 },
      '1M': { return: 8.75, benchmark: 6.50 },
      '3M': { return: 15.20, benchmark: 12.80 },
      '1Y': { return: 24.65, benchmark: 18.90 }
    }
  };

  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPortfolioData(mockPortfolioData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setPortfolioData(mockPortfolioData); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const { totalValue, dailyChange, dailyChangePercent, totalReturn, totalReturnPercent, positions, sectors, performance } = portfolioData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Portfolio Analytics
          </h1>
          <p className="text-gray-600">Track your investments and performance</p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Value</h3>
              <span className="text-green-600">📈</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
              <p className={`text-sm font-medium ${dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(dailyChange)} ({formatPercent(dailyChangePercent)})
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Total Return</h3>
              <span className="text-blue-600">💰</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalReturn)}</p>
              <p className={`text-sm font-medium ${totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(totalReturnPercent)}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Buying Power</h3>
              <span className="text-purple-600">💳</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioData.buyingPower)}</p>
              <p className="text-sm text-gray-500">Available to trade</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Cash Balance</h3>
              <span className="text-gray-600">💵</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioData.cash)}</p>
              <p className="text-sm text-gray-500">Available cash</p>
            </div>
          </div>
        </div>

        {/* Performance Chart and Sector Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              <div className="flex space-x-1">
                {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      timeframe === period
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl mb-4 block">📊</span>
                <p className="text-gray-600 mb-2">Performance: {formatPercent(performance[timeframe].return)}</p>
                <p className="text-sm text-gray-500">vs S&P 500: {formatPercent(performance[timeframe].benchmark)}</p>
              </div>
            </div>
          </div>

          {/* Sector Allocation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sector Allocation</h3>
            <div className="space-y-4">
              {sectors.map((sector, index) => (
                <div key={sector.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-purple-500' : 'bg-orange-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-900">{sector.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{sector.allocation}%</p>
                    <p className={`text-xs ${sector.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(sector.change)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Holdings</h3>
            <Link 
              to="/auto-trading"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Place Order
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Symbol</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Company</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Shares</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Avg Price</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Current Price</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Market Value</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Day Change</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Total Return</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.symbol} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{position.symbol}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">{position.company}</div>
                    </td>
                    <td className="py-4 px-4 text-right">{position.shares}</td>
                    <td className="py-4 px-4 text-right">{formatCurrency(position.avgPrice)}</td>
                    <td className="py-4 px-4 text-right">{formatCurrency(position.currentPrice)}</td>
                    <td className="py-4 px-4 text-right font-medium">{formatCurrency(position.marketValue)}</td>
                    <td className={`py-4 px-4 text-right ${position.dayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <div>{formatCurrency(position.dayChange)}</div>
                      <div className="text-xs">{formatPercent(position.dayChangePercent)}</div>
                    </td>
                    <td className={`py-4 px-4 text-right ${position.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <div>{formatCurrency(position.totalReturn)}</div>
                      <div className="text-xs">{formatPercent(position.totalReturnPercent)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link 
            to="/auto-trading" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">📊</span>
              <div>
                <h4 className="font-semibold">Place Order</h4>
                <p className="text-sm opacity-90">Buy or sell securities</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/strategy-builder" 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">⚙️</span>
              <div>
                <h4 className="font-semibold">Build Strategy</h4>
                <p className="text-sm opacity-90">Create trading algorithms</p>
              </div>
            </div>
          </Link>

          <Link 
            to="/risk-management" 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">🛡️</span>
              <div>
                <h4 className="font-semibold">Risk Analysis</h4>
                <p className="text-sm opacity-90">Manage portfolio risk</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Portfolio; 