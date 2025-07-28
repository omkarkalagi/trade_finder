import React, { useState, useEffect } from 'react';

interface MarketDataItem {
  symbol: string;
  price: number;
  timestamp: Date;
}

const LiveMarket: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketDataItem[]>([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8081');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMarketData(prev => [
        { symbol: data.symbol, price: data.price, timestamp: new Date(data.timestamp) },
        ...prev.slice(0, 50)
      ]);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="live-market p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Live Market Updates</h2>
      <div className="h-80 overflow-y-auto">
        {marketData.map((item, index) => (
          <div key={index} className="py-2 border-b">
            <span className="font-semibold">{item.symbol}</span>:
            ${item.price.toFixed(2)} at {item.timestamp.toLocaleTimeString()}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveMarket;
