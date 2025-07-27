import React, { useState } from 'react';
import {
  ChartBarIcon,
  CogIcon,
  PlayIcon,
  PauseIcon,
  CurrencyDollarIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';

const AlgoTrading = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('rsi');
  const [isRunning, setIsRunning] = useState(false);
  const [parameters, setParameters] = useState({
    rsi: { period: 14, overbought: 70, oversold: 30 },
    macd: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 },
    bollinger: { period: 20, stdDev: 2 },
    movingAverage: { shortPeriod: 10, longPeriod: 50 }
  });

  const [algorithms] = useState([
    {
      id: 'rsi',
      name: 'RSI Strategy',
      description: 'Relative Strength Index based trading signals',
      parameters: ['period', 'overbought', 'oversold']
    },
    {
      id: 'macd',
      name: 'MACD Strategy',
      description: 'Moving Average Convergence Divergence signals',
      parameters: ['fastPeriod', 'slowPeriod', 'signalPeriod']
    },
    {
      id: 'bollinger',
      name: 'Bollinger Bands',
      description: 'Price channel breakout strategy',
      parameters: ['period', 'stdDev']
    },
    {
      id: 'movingAverage',
      name: 'Moving Average Crossover',
      description: 'Short and long term MA crossover signals',
      parameters: ['shortPeriod', 'longPeriod']
    }
  ]);

  const [backtestResults] = useState({
    totalTrades: 89,
    profitableTrades: 52,
    lossTrades: 37,
    winRate: 58.4,
    totalReturn: 23.5,
    maxDrawdown: -8.2,
    sharpeRatio: 1.8
  });

  const [liveSignals] = useState([
    { symbol: 'RELIANCE', signal: 'BUY', strength: 'Strong', price: 2456.50, time: '10:30 AM' },
    { symbol: 'TCS', signal: 'SELL', strength: 'Weak', price: 3456.75, time: '11:15 AM' },
    { symbol: 'INFY', signal: 'HOLD', strength: 'Neutral', price: 1456.25, time: '12:00 PM' },
    { symbol: 'HDFC', signal: 'BUY', strength: 'Strong', price: 1654.30, time: '12:45 PM' }
  ]);

  const handleStartAlgorithm = () => {
    setIsRunning(true);
    // Add actual algorithm start logic here
  };

  const handleStopAlgorithm = () => {
    setIsRunning(false);
    // Add actual algorithm stop logic here
  };

  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [selectedAlgorithm]: {
        ...prev[selectedAlgorithm],
        [param]: Number(value)
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Algorithmic Trading</h1>
          <p className="text-gray-600 mt-2">Advanced algorithmic trading strategies with real-time signals</p>
        </div>

        {/* Algorithm Selection and Control */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Algorithm Selection */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Algorithm Control</h2>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Algorithm</label>
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {algorithms.map(algo => (
                    <option key={algo.id} value={algo.id}>{algo.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end space-x-4">
                {!isRunning ? (
                  <button
                    onClick={handleStartAlgorithm}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={handleStopAlgorithm}
                    className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Stop
                  </button>
                )}

                <button className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <CogIcon className="h-4 w-4 mr-2" />
                  Settings
                </button>
              </div>
            </div>

            {/* Algorithm Description */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                {algorithms.find(a => a.id === selectedAlgorithm)?.name}
              </h4>
              <p className="text-sm text-gray-600">
                {algorithms.find(a => a.id === selectedAlgorithm)?.description}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Win Rate</span>
                <span className="font-semibold text-green-600">{backtestResults.winRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Return</span>
                <span className="font-semibold text-blue-600">{backtestResults.totalReturn}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sharpe Ratio</span>
                <span className="font-semibold text-gray-900">{backtestResults.sharpeRatio}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Max Drawdown</span>
                <span className="font-semibold text-red-600">{backtestResults.maxDrawdown}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Parameters Configuration */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithms.find(a => a.id === selectedAlgorithm)?.parameters.map(param => (
              <div key={param}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {param.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="number"
                  value={parameters[selectedAlgorithm][param]}
                  onChange={(e) => handleParameterChange(param, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Backtest Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trades</p>
                <p className="text-2xl font-bold text-gray-900">{backtestResults.totalTrades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Profitable Trades</p>
                <p className="text-2xl font-bold text-green-600">{backtestResults.profitableTrades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <span role="img" aria-label="down">📉</span>
              <div>
                <p className="text-sm font-medium text-gray-600">Loss Trades</p>
                <p className="text-2xl font-bold text-red-600">{backtestResults.lossTrades}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Return</p>
                <p className="text-2xl font-bold text-blue-600">{backtestResults.totalReturn}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Signals and Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Signals</h3>
            <div className="space-y-3">
              {liveSignals.map((signal, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      signal.signal === 'BUY' ? 'bg-green-500' :
                      signal.signal === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{signal.symbol}</p>
                      <p className="text-sm text-gray-600">₹{signal.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      signal.signal === 'BUY' ? 'text-green-600' :
                      signal.signal === 'SELL' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {signal.signal}
                    </p>
                    <p className="text-sm text-gray-600">{signal.strength}</p>
                    <p className="text-xs text-gray-500">{signal.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Chart</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Algorithm performance chart will be displayed here</p>
            </div>
          </div>
        </div>

        {/* Algorithm Comparison */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Comparison</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Algorithm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Return</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharpe Ratio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Drawdown</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {algorithms.map((algo, index) => (
                  <tr key={algo.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{algo.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.floor(Math.random() * 30) + 50}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.floor(Math.random() * 40) + 10}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(Math.random() * 2 + 0.5).toFixed(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-{Math.floor(Math.random() * 15) + 5}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgoTrading;
