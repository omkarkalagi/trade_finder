import React from 'react';
import { useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import ProfileSection from './ProfileSection';
import SearchBar from './SearchBar';
import MarketStatusIndicator from './MarketStatusIndicator';

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
          <div className="hidden md:block w-64">
            <SearchBar />
          </div>

          {/* Market Status */}
          <div className="hidden lg:flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
            <MarketStatusIndicator />
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
