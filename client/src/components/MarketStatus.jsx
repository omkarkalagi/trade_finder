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
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
      }`}>
        <span className={`w-2 h-2 rounded-full animate-pulse ${
          marketStatus.isOpen ? 'bg-green-400' : 'bg-red-400'
        }`}></span>
        <span>{statusText.text}</span>
      </div>
    );
  }

  return (
    <div className="glass dark-card p-4 rounded-xl border border-slate-700/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center">
          <span className="mr-2">📊</span>
          Market Status
        </h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
          marketStatus.isOpen
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${
            marketStatus.isOpen ? 'bg-green-400' : 'bg-red-400'
          }`}></span>
          <span>{statusText.text}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Status</span>
          <span className={`text-sm font-medium ${
            marketStatus.isOpen ? 'text-green-400' : 'text-red-400'
          }`}>
            {statusText.icon} {statusText.text}
          </span>
        </div>

        {/* Time Information */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">
            {marketStatus.isOpen ? 'Closes in' : 'Opens in'}
          </span>
          <span className="text-sm font-medium text-slate-200">
            {statusText.subtext}
          </span>
        </div>

        {/* Current Time */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Current Time (IST)</span>
          <span className="text-sm font-medium text-slate-200">
            {marketStatus.currentTime.toLocaleTimeString('en-IN', {
              timeZone: 'Asia/Kolkata',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </div>

        {/* Market Hours */}
        <div className="pt-3 border-t border-slate-700/30">
          <div className="text-xs text-slate-500 mb-2">Market Hours (IST)</div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Monday - Friday</span>
            <span className="text-slate-200">9:15 AM - 3:30 PM</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-slate-400">Weekend</span>
            <span className="text-red-400">Closed</span>
          </div>
        </div>

        {/* Next Session */}
        {!marketStatus.isOpen && (
          <div className="pt-3 border-t border-slate-700/30">
            <div className="text-xs text-slate-500 mb-2">Next Trading Session</div>
            <div className="text-sm text-slate-200">
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
