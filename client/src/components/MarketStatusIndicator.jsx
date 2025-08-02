import React, { useState, useEffect } from 'react';

const MarketStatusIndicator = () => {
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // Check if market is open (Monday to Friday, 9:15 AM to 3:30 PM IST)
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentTimeInMinutes = hours * 60 + minutes;

      // Market hours: 9:15 AM (555 minutes) to 3:30 PM (930 minutes)
      const marketOpen = 9 * 60 + 15; // 9:15 AM
      const marketClose = 15 * 60 + 30; // 3:30 PM

      // Market is open Monday to Friday (1-5) during trading hours
      const isOpen = day >= 1 && day <= 5 &&
                   currentTimeInMinutes >= marketOpen &&
                   currentTimeInMinutes <= marketClose;

      setIsMarketOpen(isOpen);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getMarketStatus = () => {
    if (isMarketOpen) {
      return {
        status: 'Market Open',
        color: 'bg-green-500',
        textColor: 'text-green-400'
      };
    } else {
      const day = currentTime.getDay();
      if (day === 0 || day === 6) {
        return {
          status: 'Weekend - Market Closed',
          color: 'bg-orange-500',
          textColor: 'text-orange-400'
        };
      } else {
        return {
          status: 'Market Closed',
          color: 'bg-red-500',
          textColor: 'text-red-400'
        };
      }
    }
  };

  const marketStatus = getMarketStatus();

  return (
    <div>
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 ${marketStatus.color} rounded-full ${isMarketOpen ? 'animate-pulse' : ''}`}></div>
        <span className={marketStatus.textColor}>{marketStatus.status}</span>
      </div>
      <div className="mt-1">
        <div className="text-gray-400">09:15 AM - 03:30 PM IST</div>
        <div className="text-gray-500 text-xs mt-1">
          {currentTime.toLocaleTimeString('en-IN')}
        </div>
      </div>
    </div>
  );
};

export default MarketStatusIndicator;
