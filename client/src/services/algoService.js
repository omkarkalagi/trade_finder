import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const generateTradingStrategies = async (budget) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/algo-trading/strategies`, { budget });
    return response.data;
  } catch (error) {
    console.error('Error generating trading strategies:', error);
    return [];
  }
}; 