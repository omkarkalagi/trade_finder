import React, { useState, useEffect } from 'react';
import PageLayout from './PageLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import riskManagementService from '../services/riskManagementService';
import securityService from '../services/securityService';

const RiskManagement = () => {
  const [riskMetrics, setRiskMetrics] = useState(null);
  const [riskSettings, setRiskSettings] = useState(null);
  const [securityStatus, setSecurityStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load initial data
    setRiskMetrics(riskManagementService.getRiskMetrics());
    setRiskSettings(riskManagementService.riskSettings);
    setSecurityStatus(securityService.getSecurityStatus());
    setAlerts(riskManagementService.getAlerts());

    // Set up real-time updates
    const interval = setInterval(() => {
      setRiskMetrics(riskManagementService.getRiskMetrics());
      setAlerts(riskManagementService.getAlerts());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSettingsUpdate = (newSettings) => {
    riskManagementService.updateSettings(newSettings);
    setRiskSettings({ ...riskSettings, ...newSettings });
  };

  const handleEmergencyStop = () => {
    if (window.confirm('Are you sure you want to activate emergency stop? This will halt all trading activities.')) {
      riskManagementService.emergencyStop();
    }
  };

  const handleResumeTrading = () => {
    if (window.confirm('Are you sure you want to resume trading?')) {
      riskManagementService.resumeTrading();
    }
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'High': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'Critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'stop_loss': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'take_profit': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  if (!riskMetrics || !riskSettings || !securityStatus) {
    return (
      <PageLayout title="🛡️ Risk Management" subtitle="Comprehensive risk management and security dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="🛡️ Risk Management" subtitle="Comprehensive risk management and security dashboard">
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'settings', name: 'Settings', icon: '⚙️' },
            { id: 'alerts', name: 'Alerts', icon: '🚨' },
            { id: 'security', name: 'Security', icon: '🔒' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Risk Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Daily P&L</h3>
                  <span className="text-2xl">💰</span>
                </div>
                <div className={`text-2xl font-bold ${riskMetrics.dailyPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{riskMetrics.dailyPnl.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {riskMetrics.dailyTrades} trades today
                </p>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Win Rate</h3>
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {riskMetrics.winRate}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Avg: ₹{riskMetrics.avgTrade}/trade
                </p>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Risk Level</h3>
                  <span className="text-2xl">⚡</span>
                </div>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(riskMetrics.riskLevel)}`}>
                  {riskMetrics.riskLevel}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Max DD: ₹{riskMetrics.maxDrawdown.toLocaleString()}
                </p>
              </div>

              <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Remaining Limit</h3>
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  ₹{riskMetrics.remainingDailyLoss.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Daily loss limit
                </p>
              </div>
            </div>

            {/* Emergency Controls */}
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">🚨</span>
                Emergency Controls
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={handleEmergencyStop}
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  🛑 Emergency Stop
                </button>
                <button
                  onClick={handleResumeTrading}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
                >
                  ✅ Resume Trading
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Emergency stop will immediately halt all trading activities and close open positions.
              </p>
            </div>

            {/* Recent Alerts */}
            <div className="glass dark-card p-6 border border-slate-700/30 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center">
                <span className="mr-2">🔔</span>
                Recent Alerts
              </h3>
              <div className="space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{alert.message}</span>
                      <span className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <p className="text-slate-400 text-center py-4">No recent alerts</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="glass dark-card p-6 border border-slate-700/30 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center">
                <span className="mr-2">⚙️</span>
                Risk Management Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Max Daily Loss (₹)
                  </label>
                  <input
                    type="number"
                    value={riskSettings.maxDailyLoss}
                    onChange={(e) => handleSettingsUpdate({ maxDailyLoss: parseInt(e.target.value) })}
                    className="dark-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Max Position Size (₹)
                  </label>
                  <input
                    type="number"
                    value={riskSettings.maxPositionSize}
                    onChange={(e) => handleSettingsUpdate({ maxPositionSize: parseInt(e.target.value) })}
                    className="dark-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Stop Loss Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={riskSettings.stopLossPercentage * 100}
                    onChange={(e) => handleSettingsUpdate({ stopLossPercentage: parseFloat(e.target.value) / 100 })}
                    className="dark-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Take Profit Percentage (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={riskSettings.takeProfitPercentage * 100}
                    onChange={(e) => handleSettingsUpdate({ takeProfitPercentage: parseFloat(e.target.value) / 100 })}
                    className="dark-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Max Open Positions
                  </label>
                  <input
                    type="number"
                    value={riskSettings.maxOpenPositions}
                    onChange={(e) => handleSettingsUpdate({ maxOpenPositions: parseInt(e.target.value) })}
                    className="dark-input w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Risk-Reward Ratio
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={riskSettings.riskRewardRatio}
                    onChange={(e) => handleSettingsUpdate({ riskRewardRatio: parseFloat(e.target.value) })}
                    className="dark-input w-full"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Auto Stop Loss</span>
                  <button
                    onClick={() => handleSettingsUpdate({ autoStopLossEnabled: !riskSettings.autoStopLossEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      riskSettings.autoStopLossEnabled ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        riskSettings.autoStopLossEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Emergency Stop</span>
                  <button
                    onClick={() => handleSettingsUpdate({ emergencyStopEnabled: !riskSettings.emergencyStopEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      riskSettings.emergencyStopEnabled ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        riskSettings.emergencyStopEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Position Sizing</span>
                  <button
                    onClick={() => handleSettingsUpdate({ positionSizingEnabled: !riskSettings.positionSizingEnabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      riskSettings.positionSizingEnabled ? 'bg-blue-500' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        riskSettings.positionSizingEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <div className="glass dark-card p-6 border border-slate-700/30 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                  <span className="mr-2">🚨</span>
                  Risk Alerts
                </h3>
                <button
                  onClick={() => {
                    riskManagementService.clearAlerts();
                    setAlerts([]);
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{alert.message}</h4>
                        <p className="text-sm opacity-75 mt-1">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getAlertColor(alert.type)}`}>
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold text-slate-300 mb-2">No Alerts</h3>
                    <p className="text-slate-500">Your trading is within safe parameters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="glass dark-card p-6 border border-slate-700/30 rounded-xl">
              <h3 className="text-lg font-semibold text-slate-100 mb-6 flex items-center">
                <span className="mr-2">🔒</span>
                Security Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Authentication Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      securityStatus.isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {securityStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Session Valid</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      securityStatus.sessionValid ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {securityStatus.sessionValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Device Trusted</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      securityStatus.deviceTrusted ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {securityStatus.deviceTrusted ? 'Trusted' : 'New Device'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-300">Security Level</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getRiskLevelColor(securityStatus.securityLevel)}`}>
                      {securityStatus.securityLevel}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium text-slate-200 mb-2">Last Activity</h4>
                    <p className="text-slate-400">
                      {securityStatus.lastActivity ?
                        securityStatus.lastActivity.toLocaleString() :
                        'No recent activity'
                      }
                    </p>
                  </div>

                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <h4 className="font-medium text-slate-200 mb-2">Security Features</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Two-Factor Auth</span>
                        <span className={`text-sm ${securityStatus.twoFactorEnabled ? 'text-green-400' : 'text-red-400'}`}>
                          {securityStatus.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Data Encryption</span>
                        <span className="text-sm text-green-400">Enabled</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">Auto Logout</span>
                        <span className="text-sm text-green-400">Enabled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default RiskManagement;
