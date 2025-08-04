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
    <div className="bg-white/90 rounded-lg p-3 border border-gray-200/50 shadow-sm">
      <div className="flex items-center space-x-3 mb-3">
        <div className="relative">
          <div className={`w-3 h-3 ${displayStatus.color} rounded-full ${marketStatus.isOpen ? 'animate-pulse' : ''}`}></div>
          {marketStatus.isOpen && (
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
          )}
        </div>
        <div className="flex-1">
          <div className={`${displayStatus.textColor} font-semibold text-sm`}>
            {displayStatus.icon} {displayStatus.status}
          </div>
          <div className="text-gray-500 text-xs">
            {displayStatus.description}
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-600 space-y-1">
        <div className="flex justify-between">
          <span>Trading Hours:</span>
          <span className="font-medium">09:15 AM - 03:30 PM IST</span>
        </div>
        <div className="flex justify-between">
          <span>Current Time:</span>
          <span className="font-mono font-medium">
            {marketStatus.currentTime.toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>
        {statusText.subtext && (
          <div className="flex justify-between">
            <span>Next:</span>
            <span className="text-gray-700 font-medium">{statusText.subtext}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketStatusIndicator;
