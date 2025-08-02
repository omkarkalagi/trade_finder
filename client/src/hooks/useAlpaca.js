import { useState, useEffect, useCallback } from 'react';
import * as alpacaService from '../services/alpacaService';

export const useAlpaca = () => {
  const [account, setAccount] = useState(null);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [portfolioHistory, setPortfolioHistory] = useState(null);
  const [marketClock, setMarketClock] = useState(null);
  const [loading, setLoading] = useState({
    account: false,
    positions: false,
    orders: false,
    portfolioHistory: false,
    marketClock: false
  });
  const [error, setError] = useState({
    account: null,
    positions: null,
    orders: null,
    portfolioHistory: null,
    marketClock: null
  });
  const [portfolioMetrics, setPortfolioMetrics] = useState(null);

  // Fetch account information
  const fetchAccount = useCallback(async () => {
    setLoading(prev => ({ ...prev, account: true }));
    setError(prev => ({ ...prev, account: null }));

    try {
      const accountData = await alpacaService.getAccount();
      setAccount(accountData);
      return accountData;
    } catch (err) {
      setError(prev => ({ ...prev, account: err.message || 'Failed to fetch account information' }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, account: false }));
    }
  }, []);

  // Fetch positions
  const fetchPositions = useCallback(async () => {
    setLoading(prev => ({ ...prev, positions: true }));
    setError(prev => ({ ...prev, positions: null }));

    try {
      const positionsData = await alpacaService.getPositions();
      setPositions(positionsData);
      return positionsData;
    } catch (err) {
      setError(prev => ({ ...prev, positions: err.message || 'Failed to fetch positions' }));
      return [];
    } finally {
      setLoading(prev => ({ ...prev, positions: false }));
    }
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async (status = 'all', limit = 100) => {
    setLoading(prev => ({ ...prev, orders: true }));
    setError(prev => ({ ...prev, orders: null }));

    try {
      const ordersData = await alpacaService.getOrders(status, limit);
      setOrders(ordersData);
      return ordersData;
    } catch (err) {
      setError(prev => ({ ...prev, orders: err.message || 'Failed to fetch orders' }));
      return [];
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }, []);

  // Fetch portfolio history
  const fetchPortfolioHistory = useCallback(async (period = '1M', timeframe = '1D') => {
    setLoading(prev => ({ ...prev, portfolioHistory: true }));
    setError(prev => ({ ...prev, portfolioHistory: null }));

    try {
      const historyData = await alpacaService.getPortfolioHistory(period, timeframe);
      setPortfolioHistory(historyData);
      return historyData;
    } catch (err) {
      setError(prev => ({ ...prev, portfolioHistory: err.message || 'Failed to fetch portfolio history' }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, portfolioHistory: false }));
    }
  }, []);

  // Fetch market clock
  const fetchMarketClock = useCallback(async () => {
    setLoading(prev => ({ ...prev, marketClock: true }));
    setError(prev => ({ ...prev, marketClock: null }));

    try {
      const clockData = await alpacaService.getMarketClock();
      setMarketClock(clockData);
      return clockData;
    } catch (err) {
      setError(prev => ({ ...prev, marketClock: err.message || 'Failed to fetch market clock' }));
      return null;
    } finally {
      setLoading(prev => ({ ...prev, marketClock: false }));
    }
  }, []);

  // Place an order
  const placeOrder = useCallback(async (orderParams) => {
    try {
      const result = await alpacaService.placeOrder(orderParams);
      // Refresh orders after placing a new one
      fetchOrders();
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchOrders]);

  // Cancel an order
  const cancelOrder = useCallback(async (orderId) => {
    try {
      const result = await alpacaService.cancelOrder(orderId);
      // Refresh orders after canceling
      fetchOrders();
      return result;
    } catch (err) {
      throw err;
    }
  }, [fetchOrders]);

  // Calculate portfolio metrics
  const calculateMetrics = useCallback(() => {
    if (account && positions.length > 0) {
      const metrics = alpacaService.calculatePortfolioMetrics(account, positions);
      setPortfolioMetrics(metrics);
      return metrics;
    }
    return null;
  }, [account, positions]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    const accountData = await fetchAccount();
    const positionsData = await fetchPositions();
    await fetchOrders();
    await fetchPortfolioHistory();
    await fetchMarketClock();

    if (accountData && positionsData) {
      calculateMetrics();
    }
  }, [fetchAccount, fetchPositions, fetchOrders, fetchPortfolioHistory, fetchMarketClock, calculateMetrics]);

  // Initialize data on component mount
  useEffect(() => {
    fetchAllData();

    // Set up a refresh interval (every 60 seconds)
    const intervalId = setInterval(() => {
      fetchAllData();
    }, 60000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [fetchAllData]);

  return {
    account,
    positions,
    orders,
    portfolioHistory,
    marketClock,
    portfolioMetrics,
    loading,
    error,
    fetchAccount,
    fetchPositions,
    fetchOrders,
    fetchPortfolioHistory,
    fetchMarketClock,
    fetchAllData,
    placeOrder,
    cancelOrder,
    calculateMetrics
  };
};

export default useAlpaca;
