import React from 'react';

const Logo = ({ size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Logo SVG */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#logoGradient)"
            className="drop-shadow-lg"
          />

          {/* Chart Lines */}
          <path
            d="M20 70 L35 55 L50 45 L65 30 L80 25"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          />

          {/* Data Points */}
          <circle cx="35" cy="55" r="3" fill="white" />
          <circle cx="50" cy="45" r="3" fill="white" />
          <circle cx="65" cy="30" r="3" fill="white" />

          {/* TF Letters */}
          <text
            x="50"
            y="85"
            textAnchor="middle"
            className="fill-white font-bold text-sm"
            style={{ fontSize: '14px' }}
          >
            TF
          </text>

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent`}>
            Trade Finder
          </h1>
          <p className="text-xs text-gray-500 italic font-light -mt-1">
            By Omkar Kalagi
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
