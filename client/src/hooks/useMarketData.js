import { useState, useEffect, useRef } from 'react';

export default function useMarketData() {
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);
  const workerRef = useRef(null);
  
  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('../workers/dataProcessor.worker.js', import.meta.url));
    
    const handleWorkerMessage = (event) => {
      if (event.data.type === 'marketDataProcessed') {
        setMarketData(event.data.data);
        setLoading(false);
      }
    };
    
    workerRef.current.addEventListener('message', handleWorkerMessage);
    
    // Fetch initial data
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market/data');
        const rawData = await response.json();
        
        // Send to worker for processing
        workerRef.current.postMessage({
          type: 'processMarketData',
          data: rawData
        });
      } catch (error) {
        console.error('Failed to load market data', error);
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Cleanup
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);
  
  return { marketData, loading };
} 