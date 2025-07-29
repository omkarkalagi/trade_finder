import React, { useState, useEffect } from 'react';
import LiveMarket from './LiveMarket';

const Dashboard = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [serverStatus, setServerStatus] = useState('unknown');

  useEffect(() => {
    // Check server status
    const checkServer = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🚀 AI Trading Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">Network: {isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              serverStatus === 'online' ? 'bg-green-500' :
              serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></span>
            <span className="text-sm">Server: {
              serverStatus === 'online' ? 'Online' :
              serverStatus === 'offline' ? 'Offline' : 'Checking...'
            }</span>
          </div>
        </div>
      </div>

      <LiveMarket />

      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Trading Insights</h2>
        <p className="text-gray-600">
          Real-time market data and AI-powered insights will appear here once fully integrated.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
