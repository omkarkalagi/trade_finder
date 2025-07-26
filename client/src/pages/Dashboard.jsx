import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { connectToMarket } from '../services/marketService';
import MarketSummary from '../components/MarketSummary';
import TradingPanel from '../components/TradingPanel';
import PortfolioSummary from '../components/PortfolioSummary';
import TradingInsights from '../components/TradingInsights';
import MarketNews from '../components/MarketNews';
import Watchlist from '../components/Watchlist';
import Loader from '../components/Loader';

// Lazy load heavy components with preloading
const MarketChart = lazy(() => import('../components/MarketChart'));
const SectorAnalysis = lazy(() => import('../components/SectorAnalysis'));
const AITradingBot = lazy(() => import('../components/AITradingBot'));

// Preload components in background
const preloadComponents = () => {
  import('../components/MarketChart');
  import('../components/SectorAnalysis');
  import('../components/AITradingBot');
};

const Dashboard = () => {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Memoized data processing
  const processedData = useMemo(() => {
    return Object.values(marketData).map(stock => ({
      ...stock,
      changePercent: ((stock.price - stock.previousClose) / stock.previousClose) * 100
    }));
  }, [marketData]);

  // Efficient data handler
  const handleMarketData = useCallback((data) => {
    setMarketData(prev => {
      // Only update if data has changed
      const hasChanged = Object.keys(data).some(
        key => !prev[key] || prev[key].price !== data[key].price
      );
      
      return hasChanged ? { ...prev, ...data } : prev;
    });
    setLastUpdate(Date.now());
  }, []);

  useEffect(() => {
    // Preload components on initial render
    preloadComponents();
    
    const disconnect = connectToMarket(handleMarketData);
    
    // Initial data load
    const fetchInitialData = async () => {
      try {
        const response = await fetch('/api/market/data');
        const data = await response.json();
        setMarketData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load market data', error);
        setLoading(false);
      }
    };
    
    fetchInitialData();
    
    return () => disconnect();
  }, [handleMarketData]);

  // Virtualized rendering for large datasets
  const renderMarketOverview = () => {
    return (
      <div className="overflow-y-auto h-96">
        {processedData.slice(0, 50).map((stock, index) => (
          <div key={index} className="grid grid-cols-4 gap-4 py-2 border-b">
            <div className="font-medium">{stock.symbol}</div>
            <div className="text-right">₹{stock.price.toFixed(2)}</div>
            <div className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.change.toFixed(2)}
            </div>
            <div className={`text-right ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock.changePercent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <MarketSummary data={marketData} lastUpdate={lastUpdate} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<div className="bg-white rounded-xl shadow-md p-4 h-96 flex items-center justify-center"><Loader /></div>}>
            <MarketChart data={marketData} />
          </Suspense>
        </div>
        <div className="space-y-6">
          <TradingPanel />
          <Watchlist />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<div className="bg-white rounded-xl shadow-md p-4 h-96 flex items-center justify-center"><Loader /></div>}>
          <SectorAnalysis />
        </Suspense>
        <Suspense fallback={<div className="bg-white rounded-xl shadow-md p-4 h-96 flex items-center justify-center"><Loader /></div>}>
          <AITradingBot />
        </Suspense>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Market Overview</h2>
          {renderMarketOverview()}
        </div>
        <div>
          <PortfolioSummary />
        </div>
        <div>
          <TradingInsights />
        </div>
      </div>
      
      <div className="grid grid-cols-1">
        <MarketNews />
      </div>
    </div>
  );
};

export default React.memo(Dashboard); 