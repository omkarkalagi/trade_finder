import axios from 'axios';
import { ALPACA_CONFIG } from '../config/alpaca';

// Create an axios instance for Alpaca API
const alpacaApi = axios.create({
  baseURL: ALPACA_CONFIG.endpoint,
  headers: {
    'APCA-API-KEY-ID': ALPACA_CONFIG.key,
    'APCA-API-SECRET-KEY': ALPACA_CONFIG.secret,
    'Content-Type': 'application/json'
  }
});

// Create an axios instance for Alpaca Data API
const alpacaDataApi = axios.create({
  baseURL: ALPACA_CONFIG.dataEndpoint,
  headers: {
    'APCA-API-KEY-ID': ALPACA_CONFIG.key,
    'APCA-API-SECRET-KEY': ALPACA_CONFIG.secret,
    'Content-Type': 'application/json'
  }
});

// Account Information
export const getAccount = async () => {
  try {
    const response = await alpacaApi.get('/account');
    return response.data;
  } catch (error) {
    console.error('Error fetching account information:', error);
    throw error;
  }
};

// Portfolio Positions
export const getPositions = async () => {
  try {
    const response = await alpacaApi.get('/positions');
    return response.data;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};

// Orders
export const getOrders = async (status = 'all', limit = 100) => {
  try {
    const response = await alpacaApi.get('/orders', {
      params: { status, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Place a new order
export const placeOrder = async (orderParams) => {
  try {
    const response = await alpacaApi.post('/orders', orderParams);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const response = await alpacaApi.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling order ${orderId}:`, error);
    throw error;
  }
};

// Get portfolio history
export const getPortfolioHistory = async (period = '1M', timeframe = '1D') => {
  try {
    const response = await alpacaApi.get('/account/portfolio/history', {
      params: { period, timeframe }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    throw error;
  }
};

// Get market clock
export const getMarketClock = async () => {
  try {
    const response = await alpacaApi.get('/clock');
    return response.data;
  } catch (error) {
    console.error('Error fetching market clock:', error);
    throw error;
  }
};

// Get market calendar
export const getMarketCalendar = async (start, end) => {
  try {
    const response = await alpacaApi.get('/calendar', {
      params: { start, end }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching market calendar:', error);
    throw error;
  }
};

// Get asset information
export const getAsset = async (symbol) => {
  try {
    const response = await alpacaApi.get(`/assets/${symbol}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset information for ${symbol}:`, error);
    throw error;
  }
};

// Get all assets
export const getAssets = async (status = 'active', assetClass = 'us_equity') => {
  try {
    const response = await alpacaApi.get('/assets', {
      params: { status, asset_class: assetClass }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

// Get bars (OHLC) data
export const getBars = async (symbols, timeframe = '1D', start, end, limit = 1000) => {
  try {
    // Convert symbols array to comma-separated string if it's an array
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;

    const response = await alpacaDataApi.get('/stocks/bars', {
      params: {
        symbols: symbolsParam,
        timeframe,
        start,
        end,
        limit
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bars data:', error);
    throw error;
  }
};

// Get latest quotes
export const getQuotes = async (symbols) => {
  try {
    // Convert symbols array to comma-separated string if it's an array
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;

    const response = await alpacaDataApi.get('/stocks/quotes/latest', {
      params: { symbols: symbolsParam }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

// Get latest trades
export const getTrades = async (symbols) => {
  try {
    // Convert symbols array to comma-separated string if it's an array
    const symbolsParam = Array.isArray(symbols) ? symbols.join(',') : symbols;

    const response = await alpacaDataApi.get('/stocks/trades/latest', {
      params: { symbols: symbolsParam }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

// Calculate portfolio metrics
export const calculatePortfolioMetrics = (account, positions) => {
  // Extract relevant account information
  const { equity, buying_power, cash, portfolio_value, initial_margin } = account;

  // Calculate basic metrics
  const totalEquity = parseFloat(equity);
  const totalCash = parseFloat(cash);
  const totalPositionsValue = parseFloat(portfolio_value) - totalCash;
  const marginUsed = parseFloat(initial_margin);
  const availableBuyingPower = parseFloat(buying_power);

  // Calculate allocation percentages
  const cashAllocation = (totalCash / totalEquity) * 100;
  const positionsAllocation = (totalPositionsValue / totalEquity) * 100;

  // Calculate position-specific metrics
  const positionMetrics = positions.map(position => {
    const marketValue = parseFloat(position.market_value);
    const costBasis = parseFloat(position.cost_basis);
    const unrealizedPL = parseFloat(position.unrealized_pl);
    const unrealizedPLPercent = parseFloat(position.unrealized_plpc) * 100;
    const allocationPercent = (marketValue / totalEquity) * 100;

    return {
      ...position,
      marketValue,
      costBasis,
      unrealizedPL,
      unrealizedPLPercent,
      allocationPercent
    };
  });

  // Sort positions by allocation percentage (descending)
  const sortedPositions = [...positionMetrics].sort((a, b) => b.allocationPercent - a.allocationPercent);

  // Calculate sector and asset class allocations
  // Note: This would require additional data about each position's sector and asset class
  // which is not directly provided by Alpaca's position data

  // Calculate risk metrics
  // This is a simplified calculation and would need to be expanded for a real application
  const totalUnrealizedPL = positions.reduce((sum, position) => sum + parseFloat(position.unrealized_pl), 0);
  const totalUnrealizedPLPercent = totalPositionsValue > 0 ? (totalUnrealizedPL / totalPositionsValue) * 100 : 0;

  return {
    totalEquity,
    totalCash,
    totalPositionsValue,
    marginUsed,
    availableBuyingPower,
    cashAllocation,
    positionsAllocation,
    positions: sortedPositions,
    totalUnrealizedPL,
    totalUnrealizedPLPercent
  };
};

export default {
  getAccount,
  getPositions,
  getOrders,
  placeOrder,
  cancelOrder,
  getPortfolioHistory,
  getMarketClock,
  getMarketCalendar,
  getAsset,
  getAssets,
  getBars,
  getQuotes,
  getTrades,
  calculatePortfolioMetrics
};
