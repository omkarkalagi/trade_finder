import React, { useState } from 'react';
import {
  CpuChipIcon,
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const AIPredictionBot = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedModel, setSelectedModel] = useState('lstm');
  const [confidence, setConfidence] = useState(75);

  const models = [
    { id: 'lstm', name: 'LSTM Neural Network', accuracy: 78.5, description: 'Long Short-Term Memory for time series prediction' },
    { id: 'xgboost', name: 'XGBoost', accuracy: 82.3, description: 'Gradient boosting for ensemble learning' },
    { id: 'transformer', name: 'Transformer Model', accuracy: 85.1, description: 'Attention-based deep learning model' },
    { id: 'ensemble', name: 'Ensemble Model', accuracy: 87.2, description: 'Combined predictions from multiple models' }
  ];

  const predictions = [
    {
      symbol: 'RELIANCE',
      prediction: 'BUY',
      confidence: 89,
      target: 2550,
      stopLoss: 2400,
      timeframe: '3-5 days',
      reasoning: 'Strong technical breakout with high volume confirmation'
    },
    {
      symbol: 'TCS',
      prediction: 'SELL',
      confidence: 76,
      target: 3400,
      stopLoss: 3500,
      timeframe: '1-2 days',
      reasoning: 'RSI overbought with bearish divergence pattern'
    },
    {
      symbol: 'INFY',
      prediction: 'HOLD',
      confidence: 65,
      target: 1500,
      stopLoss: 1400,
      timeframe: '5-7 days',
      reasoning: 'Consolidation phase, waiting for breakout confirmation'
    },
    {
      symbol: 'HDFC',
      prediction: 'BUY',
      confidence: 92,
      target: 1700,
      stopLoss: 1600,
      timeframe: '2-3 days',
      reasoning: 'Bullish flag pattern with institutional buying'
    }
  ];

  const performanceMetrics = {
    totalPredictions: 156,
    accuratePredictions: 134,
    accuracy: 85.9,
    totalProfit: 45600,
    averageReturn: 12.5,
    maxDrawdown: -8.2
  };

  const handleStartBot = () => {
    setIsRunning(true);
    // Add actual bot start logic here
  };

  const handleStopBot = () => {
    setIsRunning(false);
    // Add actual bot stop logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Prediction Bot</h1>
          <p className="text-gray-600 mt-2">Advanced AI-powered stock prediction and trading signals</p>
        </div>

        {/* Bot Control Panel */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">AI Bot Control</h2>
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isRunning ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id}>{model.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confidence Threshold (%)</label>
              <input
                type="range"
                min="50"
                max="95"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-center mt-1 text-sm font-medium">{confidence}%</div>
            </div>

            <div className="flex items-end space-x-4">
              {!isRunning ? (
                <button
                  onClick={handleStartBot}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CpuChipIcon className="h-4 w-4 mr-2" />
                  Start Bot
                </button>
              ) : (
                <button
                  onClick={handleStopBot}
                  className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <CpuChipIcon className="h-4 w-4 mr-2" />
                  Stop Bot
                </button>
              )}
            </div>
          </div>

          {/* Selected Model Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            {models.map((model) => (
              model.id === selectedModel && (
                <div key={model.id}>
                  <h4 className="font-medium text-gray-900 mb-2">{model.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">Accuracy:</span>
                    <span className="font-semibold text-green-600">{model.accuracy}%</span>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Predictions</p>
                <p className="text-2xl font-bold text-gray-900">{performanceMetrics.totalPredictions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{performanceMetrics.accuracy}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-gray-900">₹{performanceMetrics.totalProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Max Drawdown</p>
                <p className="text-2xl font-bold text-orange-600">{performanceMetrics.maxDrawdown}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Latest AI Predictions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((prediction, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">{prediction.symbol}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prediction.prediction === 'BUY' ? 'bg-green-100 text-green-800' :
                    prediction.prediction === 'SELL' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prediction.prediction}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Confidence</span>
                    <span className="font-semibold text-gray-900">{prediction.confidence}%</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target Price</span>
                    <span className="font-semibold text-green-600">₹{prediction.target}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stop Loss</span>
                    <span className="font-semibold text-red-600">₹{prediction.stopLoss}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Timeframe</span>
                    <span className="font-semibold text-gray-900">{prediction.timeframe}</span>
                  </div>

                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{prediction.reasoning}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Comparison */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">AI Model Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precision</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recall</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">F1 Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {models.map((model, index) => (
                  <tr key={model.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{model.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{model.accuracy}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(model.accuracy - 5).toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(model.accuracy - 3).toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(model.accuracy - 4).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Sentiment Analysis</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bullish Sentiment</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Neutral Sentiment</span>
                  <span>22%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Bearish Sentiment</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                                  <h4 className="font-medium text-green-900 mb-2">High Confidence Signals</h4>
                  <p className="text-sm text-green-700">
                    RELIANCE and HDFC show strong buy signals with &gt;85% confidence
                  </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Watch List</h4>
                <p className="text-sm text-yellow-700">
                  INFY in consolidation phase, monitor for breakout confirmation
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-medium text-red-900 mb-2">Risk Alert</h4>
                <p className="text-sm text-red-700">
                  TCS showing bearish signals, consider reducing position
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictionBot;
