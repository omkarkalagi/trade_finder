import React, { useState } from 'react';
// REMOVED: import { TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline';

const AlgoTrading = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Algorithmic Trading</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Strategy Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Momentum Strategy</h2>
            <div className="flex items-center mb-4">
              <div className="mr-4">
                {/* Replaced TrendingUpIcon with emoji */}
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <p className="text-gray-600">Buys when stock is rising, sells when falling</p>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>

          {/* Another Strategy Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mean Reversion</h2>
            <div className="flex items-center mb-4">
              <div className="mr-4">
                {/* Replaced TrendingDownIcon with emoji */}
                <span className="text-2xl">📉</span>
              </div>
              <div>
                <p className="text-gray-600">Buys when stock is oversold, sells when overbought</p>
              </div>
            </div>
            <button
              className={`px-4 py-2 rounded-md font-medium ${
                isActive
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgoTrading;
