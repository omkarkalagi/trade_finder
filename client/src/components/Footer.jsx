import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 py-4 mt-auto border-t border-gray-200 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Main footer content */}
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
          {/* Left side - Company info with enhanced styling */}
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span className="text-sm font-medium text-gray-600">With Love</span>
            <span className="text-red-500 text-lg animate-pulse">❤️</span>
            <span className="text-sm font-medium text-gray-600">from</span>
            <span className="font-bold text-sm bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Kalagi Group of Companies
            </span>
            <span className="text-xs text-gray-500">Since 2025</span>
          </div>

          {/* Right side - Status and copyright */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium text-green-600">Live</span>
            </div>
            <span className="text-xs text-gray-500">© {currentYear} Trade Finder By Omkar Kalagi</span>
          </div>
        </div>
      </div>

      {/* Decorative gradient bar */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"></div>
    </footer>
  );
};

export default Footer;
