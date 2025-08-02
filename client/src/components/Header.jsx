import React from 'react';
import { useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import ProfileSection from './ProfileSection';

const Header = () => {
  const location = useLocation();

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
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-64">
            <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search stocks, sectors..."
              className="bg-transparent outline-none text-sm flex-1"
            />
          </div>

          {/* Market Status */}
          <div className="hidden lg:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700">Market Open</span>
          </div>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Profile Section */}
          <ProfileSection />
        </div>
      </div>
    </header>
  );
};

export default Header;
