import io from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const socket = io(API_BASE_URL);

export const connectToMarket = (callback) => {
  socket.on('connect', () => {
    console.log('Connected to market data server');
    socket.emit('subscribe', ['NIFTY', 'BANKNIFTY', 'RELIANCE', 'TATASTEEL', 'HDFCBANK', 'INFY']);
  });
  
  socket.on('real-time-data', (data) => {
    callback(data);
  });
  
  socket.on('sector-data', (data) => {
    // Handle sector data updates
  });
  
  socket.on('disconnect', () => {
    console.log('Disconnected from market data server');
  });
  
  return () => socket.disconnect();
};

export const fetchMarketData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stocks/market`);
    return response.json();
  } catch (error) {
    console.error('Error fetching market data:', error);
    return [];
  }
}; 