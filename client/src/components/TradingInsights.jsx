import React from 'react';

const TradingInsights = () => {
  const insights = [
    { 
      symbol: 'RELIANCE', 
      recommendation: 'BUY', 
      confidence: 85,
      target: 2600,
      rationale: 'Strong quarterly results and new energy initiatives'
    },
    { 
      symbol: 'HDFCBANK', 
      recommendation: 'HOLD', 
      confidence: 70,
      target: 1700,
      rationale: 'Stable growth but facing margin pressure'
    },
    { 
      symbol: 'INFY', 
      recommendation: 'SELL', 
      confidence: 65,
      target: 1400,
      rationale: 'Valuation concerns and slowing deal wins'
    }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Trading Insights</h2>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold">{insight.symbol}</div>
                <div className={`text-lg font-bold ${
                  insight.recommendation === 'BUY' ? 'text-green-600' : 
                  insight.recommendation === 'SELL' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {insight.recommendation} @ ₹{insight.target}
                </div>
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {insight.confidence}% confidence
              </div>
            </div>
            <p className="text-gray-600 mt-2 text-sm">{insight.rationale}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradingInsights; 