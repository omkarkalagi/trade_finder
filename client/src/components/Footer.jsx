import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-6 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left side - Company info */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-lg">Made with</span>
            <span className="text-red-500 text-xl animate-pulse">❤️</span>
            <span className="text-lg">from</span>
            <span className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent text-xl">
              Kalagi Group of Companies
            </span>
          </div>

          {/* Right side - Year and links */}
          <div className="flex items-center space-x-6">
            <span className="text-gray-300">Since 2025</span>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy
              </a>
              <span className="text-gray-500">•</span>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms
              </a>
              <span className="text-gray-500">•</span>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
              >
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <div className="mb-2 md:mb-0">
              <span>© 2025 Trade Finder. All rights reserved.</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Powered by Kalagi Technologies</span>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs">Live Markets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
};

export default Footer;
