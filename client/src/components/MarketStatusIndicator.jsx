import React, { useState, useEffect } from 'react';
import marketStatusService from '../services/marketStatusService';

const MarketStatusIndicator = () => {
  const [marketStatus, setMarketStatus] = useState(marketStatusService.getMarketStatus());
  const [statusText, setStatusText] = useState(marketStatusService.getMarketStatusText());

  useEffect(() => {
    // Subscribe to market status updates
    const unsubscribe = marketStatusService.subscribe((status) => {
      setMarketStatus(status);
      setStatusText(marketStatusService.getMarketStatusText());
    });

    // Initial update
    setMarketStatus(marketStatusService.getMarketStatus());
    setStatusText(marketStatusService.getMarketStatusText());

    return unsubscribe;
  }, []);

  const getDisplayStatus = () => {
    if (marketStatus.isOpen) {
      return {
        status: 'Market Open',
        color: 'bg-green-400',
        textColor: 'text-green-400',
        icon: '🟢',
        description: 'Live Trading Active'
      };
    } else {
      const session = marketStatusService.getMarketSession();

      if (session.session === 'pre-market') {
        return {
          status: 'Pre-Market',
          color: 'bg-blue-400',
          textColor: 'text-blue-400',
          icon: '🔵',
          description: 'Opening Soon'
        };
      } else if (session.session === 'post-market') {
        return {
          status: 'After Hours',
          color: 'bg-red-400',
          textColor: 'text-red-400',
          icon: '🔴',
          description: 'Markets Closed'
        };
      } else {
        const now = new Date();
        const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
        const day = istTime.getDay();

        if (day === 0) {
          return {
            status: 'Holiday',
            color: 'bg-red-400',
            textColor: 'text-red-400',
            icon: '🔴',
            description: 'Sunday - Market Closed'
          };
        } else if (day === 6) {
          return {
            status: 'Weekend',
            color: 'bg-orange-400',
            textColor: 'text-orange-400',
            icon: '🟠',
            description: 'Saturday - Market Closed'
          };
        } else {
          return {
            status: 'Closed',
            color: 'bg-red-400',
            textColor: 'text-red-400',
            icon: '🔴',
            description: 'Markets Closed'
          };
        }
      }
    }
  };

  const displayStatus = getDisplayStatus();

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className={`w-2 h-2 ${displayStatus.color} rounded-full ${marketStatus.isOpen ? 'animate-pulse' : ''}`}></div>
        {marketStatus.isOpen && (
          <div className="absolute inset-0 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-50"></div>
        )}
      </div>
      <div className="flex items-center space-x-1">
        <span className={`${displayStatus.textColor} font-medium text-xs`}>
          {displayStatus.status}
        </span>
      </div>
    </div>


  );
};

export default MarketStatusIndicator;
