import React from 'react';
import { Link } from 'react-router-dom';

const PortfolioSummary = ({ isConnected, portfolioSummary }) => {
  if (!isConnected) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <span className="mr-2">💼</span>
          Portfolio Summary
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="text-5xl mb-4 text-gray-300">💼</div>
          <p className="text-gray-500 mb-2">Connect to Alpaca to view your portfolio</p>
          <p className="text-xs text-gray-400 mb-4">Your portfolio data will appear here</p>
        </div>
      </div>
    );
  }

  if (!portfolioSummary) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <span className="mr-2">💼</span>
          Portfolio Summary
        </h3>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  const { totalEquity, totalCash, totalPositionsValue, totalUnrealizedPL, totalUnrealizedPLPercent } = portfolioSummary;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">💼</span>
          Portfolio Summary
        </h3>
        <Link
          to="/portfolio"
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
        >
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Total Equity */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-sm text-gray-500 mb-1">Total Equity</div>
          <div className="text-2xl font-bold text-gray-800">
            ${parseFloat(totalEquity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Performance */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Unrealized P&L</div>
            <div className={`text-lg font-bold ${totalUnrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${parseFloat(totalUnrealizedPL).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className={`text-xs ${totalUnrealizedPLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalUnrealizedPLPercent >= 0 ? '+' : ''}{parseFloat(totalUnrealizedPLPercent).toFixed(2)}%
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Cash Balance</div>
            <div className="text-lg font-bold text-gray-800">
              ${parseFloat(totalCash).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-gray-500">
              {totalEquity > 0 ? ((totalCash / totalEquity) * 100).toFixed(1) : 0}% of portfolio
            </div>
          </div>
        </div>

        {/* Allocation */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">Allocation</div>
            <div className="text-xs text-gray-400">Positions vs Cash</div>
          </div>
          <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-blue-500"
              style={{ width: `${totalEquity > 0 ? (totalPositionsValue / totalEquity) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <div>Positions: {totalEquity > 0 ? ((totalPositionsValue / totalEquity) * 100).toFixed(1) : 0}%</div>
            <div>Cash: {totalEquity > 0 ? ((totalCash / totalEquity) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;
