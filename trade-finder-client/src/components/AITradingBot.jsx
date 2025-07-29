import React, { useState } from 'react';

const AITradingBot = () => {
  const [predictions, setPredictions] = useState([
    { symbol: 'RELIANCE', action: 'BUY', confidence: 92, price: 2450, target: 2600 },
    { symbol: 'HDFCBANK', action: 'HOLD', confidence: 78, price: 1650, target: 1700 },
    { symbol: 'INFY', action: 'SELL', confidence: 85, price: 1425, target: 1350 },
    { symbol: 'TCS', action: 'BUY', confidence: 88, price: 3250, target: 3400 },
  ]);

  const [newSymbol, setNewSymbol] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeStock = () => {
    if (!newSymbol) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const actions = ['BUY', 'SELL', 'HOLD'];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const confidence = Math.floor(Math.random() * 30) + 70;
      const price = Math.floor(Math.random() * 1000) + 1000;
      const target = action === 'BUY' 
        ? Math.floor(price * 1.05) 
        : action === 'SELL' 
          ? Math.floor(price * 0.95) 
          : price;
      
      setPredictions([
        { symbol: newSymbol.toUpperCase(), action, confidence, price, target },
        ...predictions
      ]);
      
      setNewSymbol('');
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">AI Trading Bot</h2>
      
      <div className="mb-4 flex">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Enter stock symbol"
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={analyzeStock}
          disabled={isAnalyzing}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>
      
      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">{prediction.symbol}</div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                prediction.action === 'BUY' ? 'bg-green-100 text-green-800' :
                prediction.action === 'SELL' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {prediction.action}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <span className="text-gray-600">Current: </span>
                <span className="font-medium">₹{prediction.price}</span>
              </div>
              <div>
                <span className="text-gray-600">Target: </span>
                <span className="font-medium">₹{prediction.target}</span>
              </div>
              <div>
                <span className="text-gray-600">Confidence: </span>
                <span className="font-medium">{prediction.confidence}%</span>
              </div>
              <div>
                <span className="text-gray-600">Potential: </span>
                <span className={`font-medium ${
                  prediction.action === 'BUY' ? 'text-green-600' : 
                  prediction.action === 'SELL' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {prediction.action === 'BUY' ? `+${(prediction.target - prediction.price).toLocaleString()}` : 
                   prediction.action === 'SELL' ? `-${(prediction.price - prediction.target).toLocaleString()}` : 
                   'Hold'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AITradingBot; 