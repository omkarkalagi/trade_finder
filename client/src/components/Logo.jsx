import React from 'react';

const Logo = ({ size = 'md', showText = true, variant = 'default' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl',
    '2xl': 'text-5xl'
  };

  const subtextSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl'
  };

  return (
    <div className="flex items-center space-x-4 group">
      {/* Enhanced Logo SVG */}
      <div className={`${sizeClasses[size]} relative transform transition-all duration-300 group-hover:scale-110`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Glow Ring */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="url(#glowGradient)"
            strokeWidth="1"
            opacity="0.6"
            className="animate-pulse"
          />

          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="url(#logoGradient)"
            className="drop-shadow-2xl"
          />

          {/* Inner Circle for depth */}
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />

          {/* Animated Chart Lines */}
          <path
            d="M20 70 L35 55 L50 45 L65 30 L80 25"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
            filter="url(#glow)"
          />

          {/* Secondary trend line */}
          <path
            d="M15 75 L30 65 L45 60 L60 50 L75 45"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3,3"
          />

          {/* Enhanced Data Points */}
          <circle cx="35" cy="55" r="4" fill="white" className="animate-bounce-gentle" />
          <circle cx="50" cy="45" r="4" fill="white" className="animate-bounce-gentle" style={{animationDelay: '0.2s'}} />
          <circle cx="65" cy="30" r="4" fill="white" className="animate-bounce-gentle" style={{animationDelay: '0.4s'}} />

          {/* Inner glow for data points */}
          <circle cx="35" cy="55" r="2" fill="#3B82F6" />
          <circle cx="50" cy="45" r="2" fill="#8B5CF6" />
          <circle cx="65" cy="30" r="2" fill="#EC4899" />

          {/* Enhanced TF Letters */}
          <text
            x="50"
            y="88"
            textAnchor="middle"
            className="fill-white font-black"
            style={{ fontSize: '16px', fontFamily: 'Orbitron, monospace' }}
            filter="url(#textGlow)"
          >
            TF
          </text>

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="30%" stopColor="#8B5CF6" />
              <stop offset="70%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>
      </div>

      {/* Enhanced Text */}
      {showText && (
        <div className="flex flex-col space-y-1">
          <h1 className={`${textSizeClasses[size]} font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent tracking-tight leading-none`}
              style={{ fontFamily: 'Orbitron, Inter, sans-serif' }}>
            Trade Finder
          </h1>
          <p className={`${subtextSizeClasses[size]} text-white/70 font-medium tracking-wide -mt-1 transition-colors duration-300 group-hover:text-white/90`}
             style={{ fontFamily: 'Inter, sans-serif' }}>
            Smart Trading Platform
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;
