import React, { useState } from 'react';

const AIPredictionBot = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedModel, setSelectedModel] = useState('lstm');

  const models = [
    { id: 'lstm', name: 'LSTM Neural Network', icon: '🧠', accuracy: '87%', description: 'Long-term pattern recognition' },
    { id: 'transformer', name: 'Transformer Model', icon: '⚡', accuracy: '92%', description: 'Advanced attention mechanism' },
    { id: 'ensemble', name: 'Ensemble Model', icon: '🎯', accuracy: '89%', description: 'Combined multiple models' },
    { id: 'cnn', name: 'CNN Model', icon: '📊', accuracy: '85%', description: 'Convolutional pattern analysis' }
  ];

  const predictions = [
    { symbol: 'RELIANCE', prediction: 'BUY', confidence: 87, price: '₹2,456', target: '₹2,650', timeframe: '1 week' },
    { symbol: 'TCS', prediction: 'HOLD', confidence: 72, price: '₹3,456', target: '₹3,500', timeframe: '3 days' },
    { symbol: 'INFY', prediction: 'SELL', confidence: 91, price: '₹1,456', target: '₹1,380', timeframe: '5 days' },
    { symbol: 'HDFC', prediction: 'BUY', confidence: 78, price: '₹1,654', target: '₹1,720', timeframe: '2 weeks' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">AI Prediction Bot</h2>
        <span className="text-2xl">🤖</span>
      </div>

      {/* Status and Control */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl mr-3">🧠</span>
            <div>
              <h3 className="font-semibold text-gray-900">AI Model Status</h3>
              <p className="text-sm text-gray-600">Machine learning predictions</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
          </div>
        </div>
      </div>

      {/* Model Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select AI Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedModel === model.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{model.icon}</span>
                <span className="text-sm font-medium text-green-600">{model.accuracy}</span>
              </div>
              <h4 className="font-semibold text-gray-900">{model.name}</h4>
              <p className="text-sm text-gray-600">{model.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Predictions</h3>
        <div className="space-y-3">
          {predictions.map((prediction, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${
                  prediction.prediction === 'BUY' ? 'bg-green-500' :
                  prediction.prediction === 'SELL' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">{prediction.symbol}</p>
                  <p className="text-sm text-gray-600">{prediction.price}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  prediction.prediction === 'BUY' ? 'text-green-600' :
                  prediction.prediction === 'SELL' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {prediction.prediction}
                </p>
                <p className="text-sm text-gray-600">{prediction.confidence}% confidence</p>
                <p className="text-xs text-gray-500">Target: {prediction.target}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">AI Insights</h4>
        <p className="text-sm text-blue-800">
          The {models.find(m => m.id === selectedModel)?.name} is currently analyzing market patterns
          with {models.find(m => m.id === selectedModel)?.accuracy} accuracy.
          Consider these predictions as part of your overall investment strategy.
        </p>
      </div>
    </div>
  );
};

export default AIPredictionBot;
