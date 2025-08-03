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
        color: 'bg-green-400',
        textColor: 'text-green-400',
        icon: '🟢',
        description: 'Live Trading Active'
      };
    } else {
      const day = currentTime.getDay();
      if (day === 0 || day === 6) {
        return {
          status: 'Weekend',
          color: 'bg-orange-400',
          textColor: 'text-orange-400',
          icon: '🟠',
          description: 'Markets Closed'
        };
      } else {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();
        const currentTimeInMinutes = hours * 60 + minutes;
        const marketOpen = 9 * 60 + 15; // 9:15 AM

        if (currentTimeInMinutes < marketOpen) {
          return {
            status: 'Pre-Market',
            color: 'bg-blue-400',
            textColor: 'text-blue-400',
            icon: '🔵',
            description: 'Opening Soon'
          };
        } else {
          return {
            status: 'After Hours',
            color: 'bg-red-400',
            textColor: 'text-red-400',
            icon: '🔴',
            description: 'Markets Closed'
          };
        }
      }
    }
  };

  const marketStatus = getMarketStatus();

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className={`w-3 h-3 ${marketStatus.color} rounded-full ${isMarketOpen ? 'animate-pulse' : ''}`}></div>
          {isMarketOpen && (
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
          )}
        </div>
        <div className="flex-1">
          <div className={`${marketStatus.textColor} font-semibold text-sm`}>
            {marketStatus.icon} {marketStatus.status}
          </div>
          <div className="text-slate-500 text-xs">
            {marketStatus.description}
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-400 space-y-1">
        <div className="flex justify-between">
          <span>Trading Hours:</span>
          <span>09:15 AM - 03:30 PM IST</span>
        </div>
        <div className="flex justify-between">
          <span>Current Time:</span>
          <span className="font-mono">
            {currentTime.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketStatusIndicator;
