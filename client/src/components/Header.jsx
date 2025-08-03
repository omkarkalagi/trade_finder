import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import ProfileSection from './ProfileSection';
import SearchBar from './SearchBar';
import MarketStatusIndicator from './MarketStatusIndicator';
import Logo from './Logo';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Get the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('market')) return 'Live Market';
    if (path.includes('algo-trading')) return 'Algorithmic Trading';
    if (path.includes('auto-trading')) return 'Automated Trading';
    if (path.includes('sector-scope')) return 'Sector Scope';
    if (path.includes('portfolio-analytics')) return 'Portfolio Analytics';
    if (path.includes('trade-discovery')) return 'Trade Discovery';
    if (path.includes('strategy-builder')) return 'Strategy Builder';
    if (path.includes('strategy-lab')) return 'Strategy Lab';
    if (path.includes('social-trading')) return 'Social Trading';
    if (path.includes('alternative-data')) return 'Alternative Data';
    if (path.includes('community-education')) return 'Community & Education';
    return 'Dashboard';
  };

  return (
    <>
      <header className="bg-gradient-to-r from-white via-gray-50 to-white shadow-xl border-b border-gray-200/50 sticky top-0 z-30 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 lg:px-6 py-4">
          {/* Left side - Mobile menu + Title */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg bg-gray-100/80 hover:bg-gray-200/80 transition-colors touch-manipulation"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Mobile Logo - Only show on mobile */}
            <div className="lg:hidden">
              <Logo size="sm" showText={false} />
            </div>

            {/* Page Title - Hidden on small mobile */}
            <div className="hidden sm:block">
              {getPageTitle() === 'Dashboard' ? (
                <div className="flex flex-col">
                  <h1 className="text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                      style={{ fontFamily: 'Brush Script MT, cursive' }}>
                    Trade Finder by Omkar Kalagi
                  </h1>
                  <p className="text-3xl lg:text-5xl font-bold text-gray-800 mt-1">
                    DASHBOARD
                  </p>
                </div>
              ) : (
                <h1 className="text-3xl lg:text-5xl font-bold text-gray-800">
                  {getPageTitle().toUpperCase()}
                </h1>
              )}
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors touch-manipulation"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Desktop Search Bar */}
            <div className="hidden md:block w-48 lg:w-64">
              <SearchBar />
            </div>

            {/* Market Status - Desktop only */}
            <div className="hidden xl:flex items-center space-x-2 glass-light px-3 py-2 rounded-full border border-green-500/20">
              <MarketStatusIndicator />
            </div>

            {/* Notification Bell */}
            <div className="hidden sm:block">
              <NotificationBell />
            </div>

            {/* Profile Section */}
            <ProfileSection />
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-4 border-t border-slate-700/30">
            <SearchBar />
          </div>
        )}
      </header>

      {/* Mobile Market Status Bar */}
      <div className="lg:hidden bg-gradient-to-r from-dark-800 to-dark-900 px-4 py-2 border-b border-slate-700/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span className="text-slate-400">NIFTY</span>
              <span className="text-green-400 font-medium">+0.85%</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-slate-400">SENSEX</span>
              <span className="text-green-400 font-medium">+1.12%</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-400 font-medium">Live</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
