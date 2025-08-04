import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-dark-900 via-dark-800 to-dark-950 text-white py-8 mt-auto border-t border-slate-700/30 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6">
        {/* Main footer content */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
          {/* Left side - Company info with enhanced styling */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-medium text-slate-300">With Love</span>
              <span className="text-red-400 text-2xl animate-pulse filter drop-shadow-lg">❤️</span>
              <span className="text-lg font-medium text-slate-300">from</span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="font-black text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
                Trade Finder Technologies
              </span>
              <span className="text-sm text-slate-400 font-medium">Since 2025</span>
            </div>
          </div>

          {/* Right side - Links and status */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
            {/* Navigation links */}
            <div className="flex items-center space-x-6">
              <a
                href="#privacy"
                className="text-slate-400 hover:text-blue-400 transition-all duration-300 text-sm font-medium hover:scale-105"
              >
                Privacy
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="#terms"
                className="text-slate-400 hover:text-purple-400 transition-all duration-300 text-sm font-medium hover:scale-105"
              >
                Terms
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="#support"
                className="text-slate-400 hover:text-pink-400 transition-all duration-300 text-sm font-medium hover:scale-105"
              >
                Support
              </a>
            </div>

            {/* Live status indicator */}
            <div className="flex items-center space-x-2 glass-light px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
              <span className="text-xs font-medium text-green-400">Live Markets</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-slate-400">
            <span>© {currentYear} Trade Finder. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="font-medium">Powered by Trade Finder Technologies</span>
          </div>

          {/* Social links or additional info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>⚡ Fast</span>
              <span>•</span>
              <span>📱 Mobile Ready</span>
            </div>
          </div>
        </div>

        {/* Additional branding */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 italic">
            "Empowering traders with intelligent insights and seamless execution"
          </p>
        </div>
      </div>

      {/* Enhanced decorative gradient bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80"></div>

      {/* Subtle glow effect */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-40"></div>
    </footer>
  );
};

export default Footer;
