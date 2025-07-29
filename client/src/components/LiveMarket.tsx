import React, { useState, useEffect, useRef } from 'react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

const LiveMarket = () => {
  const [marketData, setMarketData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = () => {
    // Clear any previous reconnect attempts
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    setConnectionStatus('connecting');
    setLoading(true);
    setError(null);

    const ws = new WebSocket('wss://stream.data.alpaca.markets/v2/iex');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('authenticating');

      ws.send(JSON.stringify({
        action: 'auth',
        key: import.meta.env.VITE_ALPACA_API_KEY,
        secret: import.meta.env.VITE_ALPACA_API_SECRET
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle authentication response
      if (data[0].msg === 'authenticated') {
        setConnectionStatus('subscribing');
        console.log('Authentication successful');

        ws.send(JSON.stringify({
          action: 'subscribe',
          quotes: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'JPM', 'V', 'DIS']
        }));
        return;
      }

      // Handle subscription success
      if (data[0].msg === 'subscribed') {
        setConnectionStatus('connected');
        setLoading(false);
        console.log('Subscription successful');
        return;
      }

      // Process market data
      const quotes = data.filter((item: any) => item.T === 'q');
      if (quotes.length > 0) {
        setMarketData(prev => {
          const newData = [...prev];
          quotes.forEach((quote: any) => {
            const index = newData.findIndex(item => item.symbol === quote.S);
            const newItem = {
              symbol: quote.S,
              price: quote.ap,
              change: quote.ap - (quote.pc || quote.ap),
              changePercent: quote.pc ? ((quote.ap - quote.pc) / quote.pc) * 100 : 0,
              volume: quote.v
            };

            if (index !== -1) {
              newData[index] = newItem;
            } else {
              newData.push(newItem);
            }
          });
          return newData;
        });
        setLastUpdated(new Date());
        setLoading(false);
        setError(null);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error. Reconnecting...');
      setConnectionStatus('error');
      reconnect();
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setConnectionStatus('disconnected');
      reconnect();
    };
  };

  const reconnect = () => {
    if (reconnectTimerRef.current) return;

    setConnectionStatus('reconnecting');
    reconnectTimerRef.current = setTimeout(() => {
      console.log('Attempting to reconnect...');
      connectWebSocket();
    }, 5000);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
    };
  }, []);

  const sortedData = [...marketData].sort((a, b) => b.volume - a.volume);

  // Connection status messages
  const statusMessages = {
    connecting: 'Connecting to market data...',
    authenticating: 'Authenticating with Alpaca...',
    subscribing: 'Subscribing to market data...',
    connected: 'Connected to live market',
    reconnecting: 'Reconnecting to market data...',
    disconnected: 'Connection lost. Reconnecting...',
    error: 'Connection error. Reconnecting...'
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">📈 Live Market</h2>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center text-sm">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
          }`}></span>
          <span>{statusMessages[connectionStatus]}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="mt-2">Loading market data...</span>
          {connectionStatus === 'reconnecting' && (
            <p className="text-sm text-yellow-600 mt-2">
              Taking longer than usual. Please check your network connection.
            </p>
          )}
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((stock, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{stock.symbol}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">${stock.price.toFixed(2)}</td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
                    stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.change >= 0 ? '▲' : '▼'} {Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {stock.volume.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LiveMarket;
