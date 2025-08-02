import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();

  // Get the current page title based on the path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'NSE Dashboard';
    if (path.includes('market')) return 'NSE Live Market';
    if (path.includes('algo-trading')) return 'NSE Algorithmic Trading';
    if (path.includes('auto-trading')) return 'NSE Automated Trading';
    return 'NSE Dashboard';
  };

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              T
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:inline">Trader</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
