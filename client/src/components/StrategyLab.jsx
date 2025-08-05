import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

// Mock strategy templates
const STRATEGY_TEMPLATES = [
  {
    id: 1,
    name: 'AI Market Predictor',
    description: 'Uses machine learning to predict market movements based on historical patterns',
    category: 'AI-Powered',
    complexity: 'Advanced'
  },
  {
    id: 2,
    name: 'Sentiment Analysis Strategy',
    description: 'Analyzes news and social media sentiment to predict stock movements',
    category: 'Alternative Data',
    complexity: 'Intermediate'
  },
  {
    id: 3,
    name: 'Multi-Factor Quant Model',
    description: 'Combines multiple factors including value, momentum, and quality metrics',
    category: 'Quantitative',
    complexity: 'Advanced'
  },
  {
    id: 4,
    name: 'Economic Indicator Strategy',
    description: 'Trades based on macroeconomic indicators like GDP, inflation, and interest rates',
    category: 'Fundamental',
    complexity: 'Intermediate'
  }
];

// Mock market conditions
const MARKET_CONDITIONS = [
  { id: 'bull', name: 'Bull Market', description: 'Strong uptrend with positive sentiment' },
  { id: 'bear', name: 'Bear Market', description: 'Downtrend with negative sentiment' },
  { id: 'sideways', name: 'Sideways Market', description: 'Range-bound with low volatility' },
  { id: 'volatile', name: 'Volatile Market', description: 'High volatility with large price swings' },
  { id: 'crash', name: 'Market Crash', description: 'Sudden, severe market downturn' },
  { id: 'recovery', name: 'Market Recovery', description: 'Rebound after a significant downturn' },
  { id: 'bubble', name: 'Market Bubble', description: 'Excessive speculation driving prices up' },
  { id: 'custom', name: 'Custom Scenario', description: 'Define your own market conditions' }
];

// Mock historical periods
const HISTORICAL_PERIODS = [
  { id: 'covid', name: 'COVID-19 Crash (2020)', description: 'Market crash and recovery during the pandemic' },
  { id: '2008', name: '2008 Financial Crisis', description: 'Global financial crisis and its aftermath' },
  { id: 'dotcom', name: 'Dot-com Bubble (1999-2001)', description: 'Tech bubble and subsequent crash' },
  { id: '2018', name: '2018 Correction', description: 'Market correction in late 2018' },
  { id: '2021', name: '2021 Inflation Concerns', description: 'Market reaction to rising inflation' },
  { id: 'custom', name: 'Custom Period', description: 'Define your own historical period' }
];

// Mock alternative data sources
const ALTERNATIVE_DATA = [
  { id: 'sentiment', name: 'Social Media Sentiment', description: 'Twitter, Reddit, and other social platforms' },
  { id: 'news', name: 'News Sentiment Analysis', description: 'Major financial news sources' },
  { id: 'macro', name: 'Macroeconomic Indicators', description: 'GDP, inflation, unemployment, etc.' },
  { id: 'insider', name: 'Insider Trading Activity', description: 'Legal insider buying and selling' },
  { id: 'options', name: 'Options Flow', description: 'Unusual options activity' },
  { id: 'crypto', name: 'Crypto Fear & Greed Index', description: 'Sentiment indicator for crypto markets' },
  { id: 'weather', name: 'Weather Data', description: 'Impact of weather on commodities and retail' },
  { id: 'satellite', name: 'Satellite Imagery', description: 'Parking lots, shipping, agriculture, etc.' }
];

// Mock simulation results
const SIMULATION_RESULTS = {
  performance: {
    totalReturn: 32.7,
    annualizedReturn: 18.4,
    maxDrawdown: 15.2,
    sharpeRatio: 1.8,
    sortinoRatio: 2.3,
    winRate: 68.5,
    profitFactor: 2.4
  },
  monthlyReturns: [
    { month: 'Jan', return: 3.2 },
    { month: 'Feb', return: -1.5 },
    { month: 'Mar', return: 5.7 },
    { month: 'Apr', return: 2.8 },
    { month: 'May', return: -2.3 },
    { month: 'Jun', return: 4.1 },
    { month: 'Jul', return: 3.5 },
    { month: 'Aug', return: 1.2 },
    { month: 'Sep', return: -3.1 },
    { month: 'Oct', return: 4.8 },
    { month: 'Nov', return: 6.2 },
    { month: 'Dec', return: 2.9 }
  ],
  trades: [
    { id: 1, date: '2023-03-15', symbol: 'AAPL', type: 'Buy', price: 150.25, shares: 10, result: 'Win', profit: 320.50 },
    { id: 2, date: '2023-03-22', symbol: 'MSFT', type: 'Buy', price: 280.75, shares: 5, result: 'Win', profit: 215.25 },
    { id: 3, date: '2023-04-05', symbol: 'GOOGL', type: 'Buy', price: 105.50, shares: 15, result: 'Loss', profit: -180.75 },
    { id: 4, date: '2023-04-18', symbol: 'AMZN', type: 'Buy', price: 102.30, shares: 12, result: 'Win', profit: 246.60 },
    { id: 5, date: '2023-05-02', symbol: 'TSLA', type: 'Sell', price: 160.40, shares: 8, result: 'Loss', profit: -320.80 },
    { id: 6, date: '2023-05-15', symbol: 'META', type: 'Buy', price: 240.10, shares: 6, result: 'Win', profit: 180.60 },
    { id: 7, date: '2023-06-01', symbol: 'NFLX', type: 'Buy', price: 420.75, shares: 3, result: 'Win', profit: 135.75 },
    { id: 8, date: '2023-06-15', symbol: 'NVDA', type: 'Buy', price: 380.20, shares: 4, result: 'Win', profit: 520.80 }
  ],
  marketConditions: {
    volatility: 'Medium',
    trend: 'Bullish',
    volume: 'Above Average',
    sentiment: 'Positive'
  }
};

export default function StrategyLab() {
  const [activeTab, setActiveTab] = useState('design');
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [selectedMarketCondition, setSelectedMarketCondition] = useState('bull');
  const [selectedHistoricalPeriod, setSelectedHistoricalPeriod] = useState('');
  const [selectedAlternativeData, setSelectedAlternativeData] = useState([]);
  const [showSimulation, setShowSimulation] = useState(false);
  const [customParameters, setCustomParameters] = useState({
    timeframe: 'daily',
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    initialCapital: 100000,
    positionSize: 10,
    maxOpenPositions: 5,
    stopLoss: 5,
    takeProfit: 15
  });

  // Handle strategy selection
  const handleStrategySelect = (strategy) => {
    setSelectedStrategy(strategy);
  };

  // Handle alternative data selection
  const handleAlternativeDataToggle = (dataId) => {
    if (selectedAlternativeData.includes(dataId)) {
      setSelectedAlternativeData(selectedAlternativeData.filter(id => id !== dataId));
    } else {
      setSelectedAlternativeData([...selectedAlternativeData, dataId]);
    }
  };

  // Handle custom parameter change
  const handleParameterChange = (param, value) => {
    setCustomParameters({
      ...customParameters,
      [param]: value
    });
  };

  // Run simulation
  const runSimulation = () => {
    setShowSimulation(true);
  };

  // Render strategy card
  const renderStrategyCard = (strategy) => {
    return (
      <div
        key={strategy.id}
        className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
          selectedStrategy?.id === strategy.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => handleStrategySelect(strategy)}
      >
        <h3 className="font-medium text-lg mb-2">{strategy.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
        <div className="flex justify-between items-center">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {strategy.category}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
            strategy.complexity === 'Beginner' ? 'bg-green-100 text-green-800' :
            strategy.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {strategy.complexity}
          </span>
        </div>
      </div>
    );
  };

  // Render simulation results
  const renderSimulationResults = () => {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-medium text-xl mb-4">Simulation Results</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium mb-3">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Total Return</div>
                <div className="text-xl font-bold text-blue-600">{SIMULATION_RESULTS.performance.totalReturn}%</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Win Rate</div>
                <div className="text-xl font-bold text-green-600">{SIMULATION_RESULTS.performance.winRate}%</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Sharpe Ratio</div>
                <div className="text-xl font-bold text-purple-600">{SIMULATION_RESULTS.performance.sharpeRatio}</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Max Drawdown</div>
                <div className="text-xl font-bold text-red-600">{SIMULATION_RESULTS.performance.maxDrawdown}%</div>
              </div>
            </div>

            <h4 className="font-medium mt-6 mb-3">Market Conditions</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-y-2">
                <div className="text-sm text-gray-600">Volatility:</div>
                <div className="text-sm font-medium">{SIMULATION_RESULTS.marketConditions.volatility}</div>
                <div className="text-sm text-gray-600">Trend:</div>
                <div className="text-sm font-medium">{SIMULATION_RESULTS.marketConditions.trend}</div>
                <div className="text-sm text-gray-600">Volume:</div>
                <div className="text-sm font-medium">{SIMULATION_RESULTS.marketConditions.volume}</div>
                <div className="text-sm text-gray-600">Sentiment:</div>
                <div className="text-sm font-medium">{SIMULATION_RESULTS.marketConditions.sentiment}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Monthly Returns</h4>
            <div className="bg-gray-50 p-4 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">Monthly returns chart would be displayed here</p>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {SIMULATION_RESULTS.monthlyReturns.map((month, index) => (
                <div key={index} className={`p-2 rounded-lg text-center ${
                  month.return >= 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="text-xs text-gray-600">{month.month}</div>
                  <div className={`text-sm font-medium ${
                    month.return >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {month.return >= 0 ? '+' : ''}{month.return}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h4 className="font-medium mb-3">Trade History</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {SIMULATION_RESULTS.trades.map((trade) => (
                <tr key={trade.id} className={trade.result === 'Win' ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{trade.date}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{trade.symbol}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.type === 'Buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">₹{trade.price}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{trade.shares}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.result === 'Win' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.result}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <span className={trade.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {trade.profit >= 0 ? '+' : ''}₹{Math.abs(trade.profit).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
            Export Results
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Deploy Strategy
          </button>
        </div>
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
            <h1 className="text-2xl font-bold">🧪 Strategy Lab</h1>

            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                NSE
              </div>
              <div className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                <span className="h-2 w-2 bg-purple-500 rounded-full mr-1.5"></span>
                AI-Powered
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="border-b border-gray-200 mb-4">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('design')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'design'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Strategy Design
                </button>
                <button
                  onClick={() => setActiveTab('conditions')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'conditions'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Market Conditions
                </button>
                <button
                  onClick={() => setActiveTab('data')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'data'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Alternative Data
                </button>
                <button
                  onClick={() => setActiveTab('parameters')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'parameters'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Parameters
                </button>
                <button
                  onClick={() => setActiveTab('simulation')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'simulation'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Simulation
                </button>
              </nav>
            </div>

            {/* Strategy Design Tab */}
            {activeTab === 'design' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Select Strategy Template</h2>
                  <p className="text-gray-600 text-sm">
                    Choose an AI-powered strategy template as a starting point. You can customize it in the next steps.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {STRATEGY_TEMPLATES.map(strategy => renderStrategyCard(strategy))}
                </div>

                {selectedStrategy && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-medium mb-2">Strategy Details: {selectedStrategy.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{selectedStrategy.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">Key Features</h4>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          <li>Advanced pattern recognition algorithms</li>
                          <li>Multi-timeframe analysis</li>
                          <li>Adaptive parameter optimization</li>
                          <li>Real-time market condition assessment</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Performance Characteristics</h4>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          <li>Best in trending markets</li>
                          <li>Moderate trade frequency</li>
                          <li>Average holding period: 5-10 days</li>
                          <li>Historical Sharpe ratio: 1.8</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setActiveTab('conditions')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    disabled={!selectedStrategy}
                  >
                    Continue to Market Conditions
                  </button>
                </div>
              </div>
            )}

            {/* Market Conditions Tab */}
            {activeTab === 'conditions' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Define Market Conditions</h2>
                  <p className="text-gray-600 text-sm">
                    Select the market conditions or historical period you want to test your strategy against.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium mb-3">Market Condition Scenarios</h3>
                    <div className="space-y-3">
                      {MARKET_CONDITIONS.map(condition => (
                        <div
                          key={condition.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer ${
                            selectedMarketCondition === condition.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedMarketCondition(condition.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`condition-${condition.id}`}
                              name="marketCondition"
                              checked={selectedMarketCondition === condition.id}
                              onChange={() => setSelectedMarketCondition(condition.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor={`condition-${condition.id}`} className="ml-2 font-medium">
                              {condition.name}
                            </label>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 ml-6">{condition.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Historical Periods</h3>
                    <div className="space-y-3">
                      {HISTORICAL_PERIODS.map(period => (
                        <div
                          key={period.id}
                          className={`p-3 rounded-lg border-2 cursor-pointer ${
                            selectedHistoricalPeriod === period.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedHistoricalPeriod(period.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`period-${period.id}`}
                              name="historicalPeriod"
                              checked={selectedHistoricalPeriod === period.id}
                              onChange={() => setSelectedHistoricalPeriod(period.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <label htmlFor={`period-${period.id}`} className="ml-2 font-medium">
                              {period.name}
                            </label>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 ml-6">{period.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setActiveTab('design')}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Back to Strategy Design
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue to Alternative Data
                  </button>
                </div>
              </div>
            )}

            {/* Alternative Data Tab */}
            {activeTab === 'data' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Alternative Data Sources</h2>
                  <p className="text-gray-600 text-sm">
                    Select additional data sources to enhance your strategy's predictive power.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {ALTERNATIVE_DATA.map(data => (
                    <div
                      key={data.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer ${
                        selectedAlternativeData.includes(data.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleAlternativeDataToggle(data.id)}
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`data-${data.id}`}
                          checked={selectedAlternativeData.includes(data.id)}
                          onChange={() => handleAlternativeDataToggle(data.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`data-${data.id}`} className="ml-2 font-medium">
                          {data.name}
                        </label>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-6">{data.description}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-medium text-yellow-800">Data Usage Note</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Adding alternative data sources may increase strategy complexity and processing time.
                        Some data sources may have limited historical availability, which could affect backtest accuracy.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setActiveTab('conditions')}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Back to Market Conditions
                  </button>
                  <button
                    onClick={() => setActiveTab('parameters')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue to Parameters
                  </button>
                </div>
              </div>
            )}

            {/* Parameters Tab */}
            {activeTab === 'parameters' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Strategy Parameters</h2>
                  <p className="text-gray-600 text-sm">
                    Customize the parameters for your strategy simulation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Timeframe & Period</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
                        <select
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          value={customParameters.timeframe}
                          onChange={(e) => handleParameterChange('timeframe', e.target.value)}
                        >
                          <option value="1min">1 Minute</option>
                          <option value="5min">5 Minutes</option>
                          <option value="15min">15 Minutes</option>
                          <option value="30min">30 Minutes</option>
                          <option value="1hour">1 Hour</option>
                          <option value="4hour">4 Hours</option>
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                            <input
                              type="date"
                              className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                              value={customParameters.startDate}
                              onChange={(e) => handleParameterChange('startDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">End Date</label>
                            <input
                              type="date"
                              className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                              value={customParameters.endDate}
                              onChange={(e) => handleParameterChange('endDate', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Capital & Position Sizing</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Capital (₹)</label>
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          value={customParameters.initialCapital}
                          onChange={(e) => handleParameterChange('initialCapital', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position Size (% of Capital)</label>
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          value={customParameters.positionSize}
                          onChange={(e) => handleParameterChange('positionSize', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Open Positions</label>
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          value={customParameters.maxOpenPositions}
                          onChange={(e) => handleParameterChange('maxOpenPositions', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Risk Management</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stop Loss (%)</label>
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          value={customParameters.stopLoss}
                          onChange={(e) => handleParameterChange('stopLoss', parseInt(e.target.value))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Take Profit (%)</label>
                        <input
                          type="number"
                          className="block w-full p-2 text-sm border border-gray-300 rounded-md"
                          value={customParameters.takeProfit}
                          onChange={(e) => handleParameterChange('takeProfit', parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3">Advanced Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="slippage"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="slippage" className="ml-2 text-sm text-gray-700">
                          Include slippage (0.1%)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="commission"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="commission" className="ml-2 text-sm text-gray-700">
                          Include commission (0.05%)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="dividends"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="dividends" className="ml-2 text-sm text-gray-700">
                          Include dividends
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="optimization"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          defaultChecked
                        />
                        <label htmlFor="optimization" className="ml-2 text-sm text-gray-700">
                          Enable parameter optimization
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setActiveTab('data')}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Back to Alternative Data
                  </button>
                  <button
                    onClick={() => setActiveTab('simulation')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Continue to Simulation
                  </button>
                </div>
              </div>
            )}

            {/* Simulation Tab */}
            {activeTab === 'simulation' && (
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-medium mb-2">Strategy Simulation</h2>
                  <p className="text-gray-600 text-sm">
                    Run a simulation of your strategy with the selected parameters and market conditions.
                  </p>
                </div>

                {!showSimulation ? (
                  <div>
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
                      <h3 className="font-medium text-lg mb-4">Simulation Summary</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Strategy</h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="font-medium">{selectedStrategy?.name || 'No strategy selected'}</p>
                            <p className="text-sm text-gray-600 mt-1">{selectedStrategy?.description || ''}</p>
                          </div>

                          <h4 className="text-sm font-medium mt-4 mb-2">Market Conditions</h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <p className="font-medium">
                              {MARKET_CONDITIONS.find(c => c.id === selectedMarketCondition)?.name || 'None selected'}
                            </p>
                            {selectedHistoricalPeriod && (
                              <p className="text-sm text-gray-600 mt-1">
                                Historical Period: {HISTORICAL_PERIODS.find(p => p.id === selectedHistoricalPeriod)?.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Parameters</h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div className="text-gray-600">Timeframe:</div>
                              <div className="font-medium">{customParameters.timeframe}</div>
                              <div className="text-gray-600">Date Range:</div>
                              <div className="font-medium">{customParameters.startDate} to {customParameters.endDate}</div>
                              <div className="text-gray-600">Initial Capital:</div>
                              <div className="font-medium">₹{customParameters.initialCapital.toLocaleString()}</div>
                              <div className="text-gray-600">Position Size:</div>
                              <div className="font-medium">{customParameters.positionSize}%</div>
                              <div className="text-gray-600">Stop Loss:</div>
                              <div className="font-medium">{customParameters.stopLoss}%</div>
                              <div className="text-gray-600">Take Profit:</div>
                              <div className="font-medium">{customParameters.takeProfit}%</div>
                            </div>
                          </div>

                          <h4 className="text-sm font-medium mt-4 mb-2">Alternative Data</h4>
                          <div className="bg-white p-3 rounded-lg border border-gray-200">
                            {selectedAlternativeData.length > 0 ? (
                              <ul className="text-sm">
                                {selectedAlternativeData.map(dataId => (
                                  <li key={dataId} className="mb-1">
                                    {ALTERNATIVE_DATA.find(d => d.id === dataId)?.name}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-sm text-gray-600">No alternative data selected</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={runSimulation}
                          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Run Simulation
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">Simulation Options</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="monte-carlo"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="monte-carlo" className="ml-2 text-sm text-gray-700">
                            Run Monte Carlo simulation (100 iterations)
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="stress-test"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="stress-test" className="ml-2 text-sm text-gray-700">
                            Include stress testing (extreme market conditions)
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="walk-forward"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="walk-forward" className="ml-2 text-sm text-gray-700">
                            Perform walk-forward optimization
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="detailed-report"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked
                          />
                          <label htmlFor="detailed-report" className="ml-2 text-sm text-gray-700">
                            Generate detailed performance report
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  renderSimulationResults()
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={() => setActiveTab('parameters')}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Back to Parameters
                  </button>
                  {showSimulation && (
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save & Deploy Strategy
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Strategy Lab Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">About Strategy Lab</h2>
            <p className="text-gray-600 mb-4">
              Strategy Lab is an advanced AI-powered platform for creating, testing, and optimizing trading strategies.
              It allows you to simulate how your strategies would perform under different market conditions and with various alternative data sources.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    1
                  </div>
                  <h3 className="ml-3 font-medium">Predictive Backtesting</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Test strategies against historical data with AI-enhanced simulations that account for market conditions and alternative data sources.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    2
                  </div>
                  <h3 className="ml-3 font-medium">Market Condition Analysis</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Understand how your strategy performs in different market environments, from bull markets to crashes and recoveries.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    3
                  </div>
                  <h3 className="ml-3 font-medium">Alternative Data Integration</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Enhance your strategies with alternative data sources like social media sentiment, news analysis, and macroeconomic indicators.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
