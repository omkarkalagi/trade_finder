import React from 'react';
import { NavLink } from "react-router-dom";
import Logo from './Logo';
import MarketStatusIndicator from './MarketStatusIndicator';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊', description: 'Overview & Analytics' },
    { path: '/market', label: 'Live Market', icon: '📈', description: 'Real-time Data' },
    { path: '/sector-scope', label: 'Sector Scope', icon: '🎯', description: 'Sector Analysis' },
    { path: '/portfolio-analytics', label: 'Portfolio Analytics', icon: '💼', description: 'Performance Tracking' },
    { path: '/trade-discovery', label: 'Trade Discovery', icon: '🔍', description: 'Find Opportunities' },
    { path: '/strategy-builder', label: 'Strategy Builder', icon: '⚙️', description: 'Build Strategies' },
    { path: '/strategy-lab', label: 'Strategy Lab', icon: '🧪', description: 'Test & Optimize' },
    { path: '/alternative-data', label: 'Alternative Data', icon: '📊', description: 'Advanced Insights' },
    { path: '/community-education', label: 'Community & Education', icon: '👥', description: 'Learn & Share' },
    { path: '/algo-trading', label: 'Algo Trading', icon: '🤖', description: 'Automated Strategies' },
    { path: '/auto-trading', label: 'Auto Trading', icon: '🚀', description: 'Smart Execution' },
    { path: '/social-trading', label: 'Social Trading', icon: '👥', description: 'Follow Experts' }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white w-72 min-h-screen shadow-2xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-purple-800/30">
        <Logo size="md" showText={true} />
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({isActive}) =>
                  `group flex items-center p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'hover:bg-white/10 hover:transform hover:scale-105'
                  }`
                }
              >
                <span className="mr-4 text-2xl group-hover:animate-bounce">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-300 opacity-75">{item.description}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Market Status */}
      <div className="p-4 mt-4">
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 border border-green-500/30">
          <h3 className="text-sm font-semibold mb-3 flex items-center">
            <span className="mr-2">📈</span>
            Market Status
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-300">NIFTY 50</span>
              <span className="text-green-400 font-medium">+0.85%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">SENSEX</span>
              <span className="text-green-400 font-medium">+1.12%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Bank NIFTY</span>
              <span className="text-red-400 font-medium">-0.23%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Hours */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
          <h3 className="text-sm font-semibold mb-2 flex items-center">
            <span className="mr-2">🕒</span>
            Trading Hours
          </h3>
          <div className="text-xs text-gray-300">
            <MarketStatusIndicator />
          </div>
        </div>
      </div>

      {/* Footer in Sidebar */}
      <div className="p-4 mt-auto">
        <div className="text-center text-xs text-gray-400 border-t border-purple-800/30 pt-4">
          <div className="mb-2">
            <span className="font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Trade Finder v2.0
            </span>
          </div>
          <div className="opacity-75">
            Powered by Kalagi Technologies
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
