import React, { useState, useEffect } from 'react';
import zerodhaService from '../services/zerodhaService';
import notificationService from '../services/notificationService';

const ProfileSection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [portfolioSummary, setPortfolioSummary] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Subscribe to Zerodha service updates
    const unsubscribe = zerodhaService.subscribe((data) => {
      setIsConnected(data.connected);
      setUserProfile(data.profile);
      if (data.connected) {
        setPortfolioSummary(zerodhaService.getPortfolioSummary());
      }
    });

    // Initial state
    setIsConnected(zerodhaService.isZerodhaConnected());
    setUserProfile(zerodhaService.getUserProfile());
    if (zerodhaService.isZerodhaConnected()) {
      setPortfolioSummary(zerodhaService.getPortfolioSummary());
    }

    return unsubscribe;
  }, []);

  const handleConnectZerodha = async () => {
    setIsConnecting(true);
    try {
      const result = await zerodhaService.connectToZerodha();
      if (result.success) {
        notificationService.notifySystem(result.message);
      } else {
        notificationService.notifySystem(result.message, 'high');
      }
    } catch (error) {
      notificationService.notifySystem('Connection failed: ' + error.message, 'high');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    zerodhaService.disconnect();
    setShowDropdown(false);
  };

  const handleSync = async () => {
    await zerodhaService.syncData();
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {/* Profile Avatar */}
        <div className={`relative h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
          isConnected
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-blue-500 to-purple-600'
        }`}>
          {isConnected && userProfile ? userProfile.user_name.charAt(0) : 'O'}

          {/* Connection Status Indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`}>
            {isConnected && <div className="w-full h-full bg-green-500 rounded-full animate-pulse"></div>}
          </div>
        </div>

        {/* Profile Info */}
        <div className="hidden md:block text-left">
          <div className="font-semibold text-gray-800">
            {isConnected && userProfile ? userProfile.user_name : 'Omkar D'}
          </div>
          <div className="text-sm text-gray-600">
            {isConnected ? 'Connected to Zerodha' : 'Not Connected'}
          </div>
        </div>

        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                isConnected
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {isConnected && userProfile ? userProfile.user_name.charAt(0) : 'O'}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {isConnected && userProfile ? userProfile.user_name : 'Omkar D'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isConnected && userProfile ? userProfile.email : 'omkardigambar4@gmail.com'}
                </p>
                <div className={`text-xs font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
                  {isConnected ? '🟢 Connected to Zerodha' : '⚪ Not Connected'}
                </div>
              </div>
            </div>
          </div>

          {/* Connection Section */}
          {!isConnected ? (
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-800 mb-3">Connect to Zerodha</h4>
              <p className="text-sm text-gray-600 mb-4">
                Connect your Zerodha account to sync your portfolio, positions, and enable real-time trading.
              </p>
              <button
                onClick={handleConnectZerodha}
                disabled={isConnecting}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  isConnecting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>🔗</span>
                    <span>Connect with Zerodha</span>
                  </div>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Portfolio Summary */}
              {portfolioSummary && (
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-800 mb-3">Portfolio Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-blue-600 font-medium">Total Value</div>
                      <div className="text-lg font-bold text-blue-800">₹{portfolioSummary.currentValue}</div>
                    </div>
                    <div className={`p-3 rounded-lg ${
                      parseFloat(portfolioSummary.totalPnL) >= 0 ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                      <div className={`font-medium ${
                        parseFloat(portfolioSummary.totalPnL) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        P&L
                      </div>
                      <div className={`text-lg font-bold ${
                        parseFloat(portfolioSummary.totalPnL) >= 0 ? 'text-green-800' : 'text-red-800'
                      }`}>
                        ₹{portfolioSummary.totalPnL} ({portfolioSummary.totalPnLPercentage}%)
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    {portfolioSummary.stockCount} stocks in portfolio
                  </div>
                </div>
              )}

              {/* Account Actions */}
              <div className="p-4">
                <div className="space-y-2">
                  <button
                    onClick={handleSync}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <span>🔄</span>
                    <span>Sync Data</span>
                  </button>

                  <button
                    onClick={() => setShowDropdown(false)}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <span>📊</span>
                    <span>View Full Portfolio</span>
                  </button>

                  <button
                    onClick={handleDisconnect}
                    className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <span>🔌</span>
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="p-3 bg-gray-50 rounded-b-xl">
            <div className="text-xs text-gray-500 text-center">
              Secure connection powered by Zerodha Kite API
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
