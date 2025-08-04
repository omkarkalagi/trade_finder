import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import Logo from './Logo';
import MarketStatusIndicator from './MarketStatusIndicator';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const [isMobile, setIsMobile] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    { path: '/social-trading', label: 'Social Trading', icon: '👥', description: 'Follow Experts' },
    { path: '/risk-management', label: 'Risk Management', icon: '🛡️', description: 'Safety & Security' }
  ];

  const handleNavClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        bg-gradient-to-b from-dark-900 via-dark-800 to-dark-950
        text-white w-72 h-screen shadow-2xl border-r border-slate-700/30
        transform transition-transform duration-300 ease-in-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        lg:translate-x-0 overflow-hidden
      `}>
        {/* Mobile Close Button */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700/30">
          <Logo size="md" showText={true} />
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={handleNavClick}
                  className={({isActive}) =>
                    `group flex items-center p-3 rounded-xl transition-all duration-200 touch-manipulation ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                        : 'hover:bg-gray-100/80 hover:transform hover:scale-105 active:scale-95 text-gray-700'
                    }`
                  }
                >
                  <span className="mr-4 text-2xl group-hover:animate-bounce flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.label}</div>
                    <div className="text-xs text-gray-500 opacity-75 truncate hidden sm:block">{item.description}</div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Market Status - Hidden on small mobile screens */}
        <div className="p-4 mt-4 hidden sm:block">
          <div className="bg-white/90 rounded-xl p-4 border border-green-500/30 shadow-sm">
            <h3 className="text-sm font-semibold mb-3 flex items-center text-gray-800">
              <span className="mr-2">📈</span>
              Market Status
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">NIFTY 50</span>
                <span className="text-green-600 font-medium">+0.85%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SENSEX</span>
                <span className="text-green-600 font-medium">+1.12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bank NIFTY</span>
                <span className="text-red-400 font-medium">-0.23%</span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-600">Market</span>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    <span className="text-green-600 font-medium">Open</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Close</span>
                  <span className="text-gray-700 font-medium">3:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* User Profile Section */}
        <div className="p-4 mt-auto">
          <div className="glass-light rounded-xl p-4 border border-blue-500/20 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.phone ? user.phone.slice(-2) : 'U'}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-slate-200">
                    {user?.phone ? `+91 ${user.phone.slice(-10, -6)}****${user.phone.slice(-4)}` : 'User'}
                  </div>
                  <div className="text-xs text-slate-400">Verified Account</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 rounded-lg transition-all duration-200"
            >
              <span className="mr-2">🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Footer in Sidebar */}
        <div className="p-4 border-t border-slate-700/30">
          <div className="text-center text-xs text-slate-400">
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
    </>
  );
};

export default React.memo(Sidebar);
