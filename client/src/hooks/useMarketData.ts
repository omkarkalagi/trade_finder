import { useState, useEffect } from 'react';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marketRes, portfolioRes] = await Promise.all([
          fetch('/api/market'),
          fetch('/api/portfolio')
        ]);

        setMarketData(await marketRes.json());
        setPortfolioData(await portfolioRes.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time updates
    const ws = new WebSocket('wss://yourserver.com/live');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMarketData(prev => ({ ...prev, ...data.market }));
      setPortfolioData(prev => ({ ...prev, ...data.portfolio }));
    };

    return () => ws.close();
  }, []);

  return { marketData, portfolioData, isLoading };
};
