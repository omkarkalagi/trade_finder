import React, { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const LiveMarket = () => {
  const [marketData, setMarketData] = useState<StockData[]>([
    { symbol: 'AAPL', price: 182.52, change: 1.24, changePercent: 0.68 },
    { symbol: 'MSFT', price: 328.79, change: 2.35, changePercent: 0.72 },
    { symbol: 'GOOGL', price: 135.21, change: -0.42, changePercent: -0.31 },
    { symbol: 'AMZN', price: 134.95, change: 0.87, changePercent: 0.65 },
    { symbol: 'TSLA', price: 234.50, change: 5.32, changePercent: 2.32 },
  ]);

  // Simulate live updates
  useEffect(() => {
    const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'auth',
        key: import.meta.env.VITE_ALPACA_API_KEY,
        secret: import.meta.env.VITE_ALPACA_API_SECRET
      }));

      ws.send(JSON.stringify({
        action: 'subscribe',
        quotes: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data[0].msg === 'connected' || data[0].msg === 'authenticated') return;

      const quotes = data.filter(item => item.T === 'q');
      setMarketData(quotes.map(quote => ({
        symbol: quote.S,
        price: quote.ap,
        change: quote.ap - quote.pc,
        changePercent: ((quote.ap - quote.pc) / quote.pc) * 100
      })));
    };

    return () => ws.close();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Live Market</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketData.map((stock, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{stock.symbol}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${stock.price.toFixed(2)}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveMarket;
