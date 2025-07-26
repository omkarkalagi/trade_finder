import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';

const MarketChart = () => {
  const [timeRange, setTimeRange] = useState('1d');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const indices = [
    { name: 'NIFTY 50', symbol: 'NIFTY', color: '#8884d8' },
    { name: 'BANK NIFTY', symbol: 'BANKNIFTY', color: '#82ca9d' }
  ];
  
  const activeSymbol = indices[activeIndex].symbol;
  
  // Mock chart data
  const chartData = Array.from({ length: 30 }, (_, i) => ({
    time: `${9 + Math.floor(i/6)}:${(i%6)*10}`,
    [activeSymbol]: 18000 + Math.sin(i/2) * 200 + i * 10
  }));

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <div className="flex space-x-4 mb-2 sm:mb-0">
          {indices.map((index, i) => (
            <button
              key={index.symbol}
              className={`px-4 py-2 rounded-md font-medium ${
                activeIndex === i
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveIndex(i)}
            >
              {index.name}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          {['1d', '1w', '1m', '3m', '1y'].map(range => (
            <button
              key={range}
              className={`px-3 py-1 rounded-md ${
                timeRange === range 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={indices[activeIndex].color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={indices[activeIndex].color} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem'
            }}
          />
          <Area 
            type="monotone" 
            dataKey={activeSymbol} 
            stroke={indices[activeIndex].color} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-500 text-sm">Open</div>
          <div className="text-lg font-bold">18,200.15</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-500 text-sm">High</div>
          <div className="text-lg font-bold">18,250.75</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-500 text-sm">Low</div>
          <div className="text-lg font-bold">18,150.30</div>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-gray-500 text-sm">Volume</div>
          <div className="text-lg font-bold">25.4M</div>
        </div>
      </div>
    </div>
  );
};

export default MarketChart; 