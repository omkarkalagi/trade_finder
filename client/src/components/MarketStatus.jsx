import React, { useState, useEffect } from 'react';
import marketStatusService from '../services/marketStatusService';

const MarketStatus = ({ compact = false }) => {
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

  if (compact) {
    return (
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
        marketStatus.isOpen
          ? 'bg-green-100 text-green-600 border border-green-200'
          : 'bg-red-100 text-red-600 border border-red-200'
      }`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${
          marketStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
        }`}></span>
        <span>{statusText.text}</span>
      </div>
    );
  }

  return (
    <div className="glass light-card p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <span className="mr-2">📊</span>
          Market Status
        </h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
          marketStatus.isOpen
            ? 'bg-green-100 text-green-600 border border-green-200'
            : 'bg-red-100 text-red-600 border border-red-200'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            marketStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          <span>{statusText.text}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span className={`text-sm font-medium ${
            marketStatus.isOpen ? 'text-green-600' : 'text-red-600'
          }`}>
            {statusText.icon} {statusText.text}
          </span>
        </div>

        {/* Time Information */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {marketStatus.isOpen ? 'Closes in' : 'Opens in'}
          </span>
          <span className="text-sm font-medium text-gray-800">
            {statusText.subtext}
          </span>
        </div>

        {/* Current Time */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Current Time (IST)</span>
          <span className="text-sm font-medium text-gray-800">
            {marketStatus.currentTime.toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>

        {/* Market Hours */}
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Market Hours (IST)</div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Monday - Friday</span>
            <span className="text-gray-800">9:15 AM - 3:30 PM</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600">Weekend</span>
            <span className="text-red-600">Closed</span>
          </div>
        </div>

        {/* Next Session */}
        {!marketStatus.isOpen && (
          <div className="pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-500 mb-2">Next Trading Session</div>
            <div className="text-sm text-gray-800">
              {marketStatus.nextOpen?.toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })} at 9:15 AM
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketStatus;
