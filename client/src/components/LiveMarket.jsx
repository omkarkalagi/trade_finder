import React, { useState, useEffect } from 'react';
import LoadingSpinner from './common/LoadingSpinner';

export default function LiveMarket() {
  const [marketData, setMarketData] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');

    ws.onopen = () => {
      setConnectionStatus('connecting');
      ws.send(JSON.stringify({
        action: 'auth',
        key: import.meta.env.VITE_ALPACA_API_KEY,
        secret: import.meta.env.VITE_ALPACA_API_SECRET
      }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message[0].T === 'success' && message[0].msg === 'authenticated') {
        setConnectionStatus('connected');
        // Subscribe to symbols after authentication
        ws.send(JSON.stringify({
          action: 'subscribe',
          trades: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'] // Add your symbols here
        }));
      }

      if (message[0].T === 't') { // Trade update
        const { S: symbol, p: price, s: size, t: timestamp } = message[0];
        setMarketData(prev => ({
          ...prev,
          [symbol]: { price, size, timestamp }
        }));
      }
    };

    ws.onerror = (error) => {
      setConnectionStatus('error');
      setError(error.message);
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };

    return () => ws.close();
  }, []);

  // Render market data
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Live Market Data</h2>

      {connectionStatus === 'connecting' && (
        <div className="flex items-center">
          <LoadingSpinner />
          <span className="ml-2">Connecting to live market...</span>
        </div>
      )}

      {connectionStatus === 'connected' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(marketData).map(([symbol, data]) => (
                <tr key={symbol}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{symbol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{data.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {connectionStatus === 'error' && (
        <div className="text-red-500">
          Connection error: {error || 'Unknown error'} - Trying to reconnect...
        </div>
      )}
    </div>
  );
}
