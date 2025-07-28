import { useState, useEffect } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
}

const useMarketData = (symbols: string[]): MarketData[] => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);

  useEffect(() => {
    // Fetch logic here
  }, [symbols]);

  return marketData;
};

export default useMarketData;
