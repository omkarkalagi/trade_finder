import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// Mock strategy templates
const STRATEGY_TEMPLATES = [
  {
    id: 1,
    name: 'Moving Average Crossover',
    description: 'Buy when fast MA crosses above slow MA, sell when it crosses below',
    category: 'Trend Following',
    complexity: 'Beginner'
  },
  {
    id: 2,
    name: 'RSI Reversal',
    description: 'Buy when RSI crosses above 30, sell when it crosses below 70',
    category: 'Mean Reversion',
    complexity: 'Beginner'
  },
  {
    id: 3,
    name: 'MACD Momentum',
    description: 'Buy when MACD line crosses above signal line, sell when it crosses below',
    category: 'Momentum',
    complexity: 'Intermediate'
  },
  {
    id: 4,
    name: 'Bollinger Band Breakout',
    description: 'Buy on upper band breakout, sell on lower band breakout',
    category: 'Volatility',
    complexity: 'Intermediate'
  },
  {
    id: 5,
    name: 'Ichimoku Cloud Strategy',
    description: 'Complex strategy using multiple components of the Ichimoku Cloud',
    category: 'Multi-Factor',
    complexity: 'Advanced'
  },
  {
    id: 6,
    name: 'Volume Price Confirmation',
    description: 'Buy when price increases with high volume, sell when price decreases with high volume',
    category: 'Volume Based',
    complexity: 'Intermediate'
  }
];

// Mock indicators
const INDICATORS = [
  { id: 'ma', name: 'Moving Average', type: 'Trend', parameters: ['period', 'type'] },
  { id: 'rsi', name: 'Relative Strength Index', type: 'Momentum', parameters: ['period'] },
  { id: 'macd', name: 'MACD', type: 'Momentum', parameters: ['fast period', 'slow period', 'signal period'] },
  { id: 'bb', name: 'Bollinger Bands', type: 'Volatility', parameters: ['period', 'standard deviation'] },
  { id: 'atr', name: 'Average True Range', type: 'Volatility', parameters: ['period'] },
  { id: 'adx', name: 'Average Directional Index', type: 'Trend', parameters: ['period'] },
  { id: 'stoch', name: 'Stochastic Oscillator', type: 'Momentum', parameters: ['k period', 'd period'] },
  { id: 'obv', name: 'On-Balance Volume', type: 'Volume', parameters: [] },
  { id: 'vwap', name: 'Volume Weighted Average Price', type: 'Volume', parameters: ['period'] },
  { id: 'ichimoku', name: 'Ichimoku Cloud', type: 'Multi-Factor', parameters: ['conversion period', 'base period', 'lagging span period', 'displacement'] }
];

// Mock conditions
const CONDITIONS = [
  { id: 'crossover', name: 'Crosses Above', type: 'comparison' },
  { id: 'crossunder', name: 'Crosses Below', type: 'comparison' },
  { id: 'greater', name: 'Greater Than', type: 'comparison' },
  { id: 'less', name: 'Less Than', type: 'comparison' },
  { id: 'between', name: 'Between', type: 'range' },
  { id: 'outside', name: 'Outside', type: 'range' },
  { id: 'increasing', name: 'Increasing For', type: 'trend' },
  { id: 'decreasing', name: 'Decreasing For', type: 'trend' }
];

// Mock actions
const ACTIONS = [
  { id: 'buy', name: 'Buy', parameters: ['quantity', 'order type'] },
  { id: 'sell', name: 'Sell', parameters: ['quantity', 'order type'] },
  { id: 'stoploss', name: 'Set Stop Loss', parameters: ['percentage', 'price'] },
  { id: 'takeprofit', name: 'Set Take Profit', parameters: ['percentage', 'price'] },
  { id: 'alert', name: 'Send Alert', parameters: ['message', 'type'] }
];

// Mock backtest results
const BACKTEST_RESULTS = {
  totalTrades: 42,
  winningTrades: 28,
  losingTrades: 14,
  winRate: 66.67,
  profitFactor: 2.3,
  averageWin: 2.8,
  averageLoss: 1.2,
  maxDrawdown: 8.5,
  sharpeRatio: 1.8,
  totalReturn: 32.4,
  annualizedReturn: 18.7,
  trades: [
    { date: '2023-01-05', type: 'Buy', price: 1250.75, result: 'Win', profit: 3.2 },
    { date: '2023-01-12', type: 'Sell', price: 1290.50, result: 'Win', profit: 2.8 },
    { date: '2023-01-20', type: 'Buy', price: 1275.25, result: 'Loss', profit: -1.5 },
    { date: '2023-02-03', type: 'Buy', price: 1310.80, result: 'Win', profit: 4.1 },
    { date: '2023-02-15', type: 'Sell', price: 1295.30, result: 'Loss', profit: -1.2 },
    { date: '2023-02-28', type: 'Buy', price: 1320.45, result: 'Win', profit: 2.5 },
    { date: '2023-03-10', type: 'Sell', price: 1355.20, result: 'Win', profit: 2.6 },
    { date: '2023-03-22', type: 'Buy', price: 1340.60, result: 'Loss', profit: -0.9 },
    { date: '2023-04-05', type: 'Buy', price: 1380.15, result: 'Win', profit: 3.8 },
    { date: '2023-04-18', type: 'Sell', price: 1365.70, result: 'Loss', profit: -1.1 }
  ]
};

export default function StrategyBuilder() {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showBacktest, setShowBacktest] = useState(false);
  const [strategyRules, setStrategyRules] = useState([
    { id: 1, type: 'entry', indicator: 'ma', condition: 'crossover', value: 'ma', parameters: { period1: 20, period2: 50 } },
    { id: 2, type: 'exit', indicator: 'ma', condition: 'crossunder', value: 'ma', parameters: { period1: 20, period2: 50 } }
  ]);

  // Add a new rule to the strategy
  const addRule = (type) => {
    const newRule = {
      id: strategyRules.length + 1,
      type: type,
      indicator: '',
      condition: '',
      value: '',
      parameters: {}
    };
    setStrategyRules([...strategyRules, newRule]);
  };

  // Remove a rule from the strategy
  const removeRule = (id) => {
    setStrategyRules(strategyRules.filter(rule => rule.id !== id));
  };

  // Update a rule in the strategy
  const updateRule = (id, field, value) => {
    setStrategyRules(strategyRules.map(rule => {
      if (rule.id === id) {
        return { ...rule, [field]: value };
      }
      return rule;
    }));
  };

  // Render the rule editor
  const renderRuleEditor = (rule) => {
    return (
      <div key={rule.id} className="bg-white p-4 rounded-lg border border-gray-200 mb-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">
            {rule.type === 'entry' ? '📈 Entry Rule' : '📉 Exit Rule'}
          </h3>
          <button
            onClick={() => removeRule(rule.id)}
            className="text-red-600 hover:text-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Indicator</label>
            <select
              className="block w-full p-2 text-sm border border-gray-300 rounded-md"
              value={rule.indicator}
              onChange={(e) => updateRule(rule.id, 'indicator', e.target.value)}
            >
              <option value="">Select Indicator</option>
              {INDICATORS.map(indicator => (
                <option key={indicator.id} value={indicator.id}>{indicator.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
            <select
              className="block w-full p-2 text-sm border border-gray-300 rounded-md"
              value={rule.condition}
              onChange={(e) => updateRule(rule.id, 'condition', e.target.value)}
            >
              <option value="">Select Condition</option>
              {CONDITIONS.map(condition => (
                <option key={condition.id} value={condition.id}>{condition.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Value/Indicator</label>
            <select
              className="block w-full p-2 text-sm border border-gray-300 rounded-md"
              value={rule.value}
              onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
            >
              <option value="">Select Value</option>
              <option value="value">Numeric Value</option>
              {INDICATORS.map(indicator => (
                <option key={indicator.id} value={indicator.id}>{indicator.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parameters</label>
            <div className="flex space-x-2">
              <input
                type="number"
                className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                placeholder="Period 1"
                value={rule.parameters.period1 || ''}
                onChange={(e) => updateRule(rule.id, 'parameters', {...rule.parameters, period1: parseInt(e.target.value)})}
              />
              <input
                type="number"
                className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                placeholder="Period 2"
                value={rule.parameters.period2 || ''}
                onChange={(e) => updateRule(rule.id, 'parameters', {...rule.parameters, period2: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render the backtest results
  const renderBacktestResults = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-medium text-lg mb-4">Backtest Results</h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Total Trades</div>
            <div className="text-xl font-bold">{BACKTEST_RESULTS.totalTrades}</div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Win Rate</div>
            <div className="text-xl font-bold text-green-600">{BACKTEST_RESULTS.winRate}%</div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Profit Factor</div>
            <div className="text-xl font-bold">{BACKTEST_RESULTS.profitFactor}</div>
          </div>

          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Max Drawdown</div>
            <div className="text-xl font-bold text-red-600">{BACKTEST_RESULTS.maxDrawdown}%</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium mb-2">Performance Metrics</h4>
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 text-sm text-gray-600">Total Return</td>
                  <td className="py-2 text-sm font-medium text-right">{BACKTEST_RESULTS.totalReturn}%</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-600">Annualized Return</td>
                  <td className="py-2 text-sm font-medium text-right">{BACKTEST_RESULTS.annualizedReturn}%</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-600">Sharpe Ratio</td>
                  <td className="py-2 text-sm font-medium text-right">{BACKTEST_RESULTS.sharpeRatio}</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-600">Average Win</td>
                  <td className="py-2 text-sm font-medium text-right text-green-600">+{BACKTEST_RESULTS.averageWin}%</td>
                </tr>
                <tr>
                  <td className="py-2 text-sm text-gray-600">Average Loss</td>
                  <td className="py-2 text-sm font-medium text-right text-red-600">-{BACKTEST_RESULTS.averageLoss}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h4 className="font-medium mb-2">Equity Curve</h4>
            <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Equity curve chart would be displayed here</p>
            </div>
          </div>
        </div>

        <h4 className="font-medium mb-2">Trade History</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {BACKTEST_RESULTS.trades.map((trade, index) => (
                <tr key={index} className={trade.result === 'Win' ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{trade.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{trade.type}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">₹{trade.price}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.result === 'Win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.result}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 lg:ml-72 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">⚙️ Strategy Builder</h1>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                NSE
              </div>
              <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 bg-purple-500 rounded-full mr-1.5"></span>
                No-Code Builder
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'templates'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Strategy Templates
                </button>
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'builder'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Strategy Builder
                </button>
                <button
                  onClick={() => setActiveTab('backtest')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'backtest'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Backtest
                </button>
                <button
                  onClick={() => setActiveTab('deploy')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'deploy'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Deploy
                </button>
              </nav>
            </div>

            {/* Strategy Templates Tab */}
            {activeTab === 'templates' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Strategy Templates</h2>
                  <p className="text-gray-600 text-sm">
                    Choose a pre-built strategy template to get started quickly. You can customize it later.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {STRATEGY_TEMPLATES.map(template => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 border-2 border-gray-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{template.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          template.complexity === 'Beginner' ? 'bg-green-100 text-green-800' :
                          template.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {template.complexity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                      <div className="mt-3 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{template.category}</span>
                        <button className="text-blue-600 text-sm hover:text-blue-800">
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveTab('builder')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={!selectedTemplate}
                  >
                    Continue to Builder
                  </button>
                </div>
              </div>
            )}

            {/* Strategy Builder Tab */}
            {activeTab === 'builder' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Strategy Builder</h2>
                  <p className="text-gray-600 text-sm">
                    Build your strategy by adding entry and exit rules. Each rule consists of an indicator, condition, and value.
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Strategy Rules</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addRule('entry')}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Entry Rule
                      </button>
                      <button
                        onClick={() => addRule('exit')}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add Exit Rule
                      </button>
                    </div>
                  </div>

                  {strategyRules.map(rule => renderRuleEditor(rule))}
                </div>

                <div className="mb-6">
                  <h3 className="font-medium mb-3">Risk Management</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position Size</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          placeholder="10"
                          defaultValue="10"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          placeholder="2"
                          defaultValue="2"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Take Profit</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          placeholder="5"
                          defaultValue="5"
                        />
                        <span className="ml-2">%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveTab('backtest')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue to Backtest
                  </button>
                </div>
              </div>
            )}

            {/* Backtest Tab */}
            {activeTab === 'backtest' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Backtest Strategy</h2>
                  <p className="text-gray-600 text-sm">
                    Test your strategy against historical data to see how it would have performed.
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-3">Backtest Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                      <select className="block w-full p-2 text-sm border border-gray-300 rounded-md">
                        <option>NIFTY</option>
                        <option>BANKNIFTY</option>
                        <option>RELIANCE</option>
                        <option>TCS</option>
                        <option>INFY</option>
                        <option>HDFCBANK</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                      <select className="block w-full p-2 text-sm border border-gray-300 rounded-md">
                        <option>1 Minute</option>
                        <option>5 Minutes</option>
                        <option>15 Minutes</option>
                        <option>30 Minutes</option>
                        <option>1 Hour</option>
                        <option>1 Day</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                      <div className="flex space-x-2">
                        <input
                          type="date"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          defaultValue="2023-01-01"
                        />
                        <input
                          type="date"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          defaultValue="2023-12-31"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setShowBacktest(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Run Backtest
                    </button>
                  </div>
                </div>

                {showBacktest && renderBacktestResults()}

                {showBacktest && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={() => setActiveTab('deploy')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Continue to Deploy
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Deploy Tab */}
            {activeTab === 'deploy' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Deploy Strategy</h2>
                  <p className="text-gray-600 text-sm">
                    Deploy your strategy to run automatically or receive alerts when conditions are met.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Deployment Options</h3>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <input
                          id="paper-trading"
                          type="radio"
                          name="deployment"
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          defaultChecked
                        />
                        <label htmlFor="paper-trading" className="ml-3">
                          <div className="text-sm font-medium text-gray-700">Paper Trading</div>
                          <p className="text-xs text-gray-500">
                            Test your strategy with simulated trades without risking real money.
                          </p>
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          id="live-trading"
                          type="radio"
                          name="deployment"
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="live-trading" className="ml-3">
                          <div className="text-sm font-medium text-gray-700">Live Trading</div>
                          <p className="text-xs text-gray-500">
                            Execute trades automatically with real money based on your strategy.
                          </p>
                        </label>
                      </div>

                      <div className="flex items-start">
                        <input
                          id="alerts-only"
                          type="radio"
                          name="deployment"
                          className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="alerts-only" className="ml-3">
                          <div className="text-sm font-medium text-gray-700">Alerts Only</div>
                          <p className="text-xs text-gray-500">
                            Receive notifications when your strategy conditions are met, but execute trades manually.
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Notification Settings</h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            defaultChecked
                          />
                          <label htmlFor="email-notifications" className="ml-2 text-sm text-gray-700">
                            Email Notifications
                          </label>
                        </div>
                        <input
                          type="email"
                          className="block w-48 p-1 text-sm border border-gray-300 rounded-md"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="sms-notifications"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="sms-notifications" className="ml-2 text-sm text-gray-700">
                            SMS Notifications
                          </label>
                        </div>
                        <input
                          type="tel"
                          className="block w-48 p-1 text-sm border border-gray-300 rounded-md"
                          placeholder="+91 9876543210"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="app-notifications"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            defaultChecked
                          />
                          <label htmlFor="app-notifications" className="ml-2 text-sm text-gray-700">
                            In-App Notifications
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            id="webhook-notifications"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="webhook-notifications" className="ml-2 text-sm text-gray-700">
                            Webhook
                          </label>
                        </div>
                        <input
                          type="url"
                          className="block w-48 p-1 text-sm border border-gray-300 rounded-md"
                          placeholder="https://your-webhook.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-medium mb-3">Strategy Schedule</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trading Days</label>
                      <div className="flex flex-wrap gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
                          <label key={day} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              defaultChecked
                            />
                            <span className="ml-1 text-sm text-gray-700">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trading Hours</label>
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          defaultValue="09:15"
                        />
                        <span className="self-center">to</span>
                        <input
                          type="time"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          defaultValue="15:30"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Trades Per Day</label>
                      <input
                        type="number"
                        className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                        placeholder="5"
                        defaultValue="5"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                    Deploy Strategy
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Strategy Library */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Strategy Library</h2>
              <div>
                <button className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Win Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Factor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">NIFTY MA Crossover</div>
                      <div className="text-xs text-gray-500">Created 2 weeks ago</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Trend Following
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">68.5%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      2.1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-gray-600 hover:text-gray-800">Clone</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">BANKNIFTY RSI Strategy</div>
                      <div className="text-xs text-gray-500">Created 1 month ago</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Mean Reversion
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">72.3%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      2.8
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Paper Trading
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-gray-600 hover:text-gray-800">Clone</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Reliance Bollinger Band</div>
                      <div className="text-xs text-gray-500">Created 3 days ago</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Volatility
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600">58.9%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      1.7
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                        <button className="text-gray-600 hover:text-gray-800">Clone</button>
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
