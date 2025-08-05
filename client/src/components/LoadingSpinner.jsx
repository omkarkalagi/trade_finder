import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', variant = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const variants = {
    primary: 'border-blue-500',
    secondary: 'border-purple-500',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    danger: 'border-red-500'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* Animated Spinner */}
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}>
          <div className={`absolute inset-0 border-4 ${variants[variant]} border-t-transparent rounded-full animate-spin`}></div>
        </div>

        {/* Pulsing center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse`}></div>
        </div>
      </div>

      {/* Loading text */}
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-white p-6 border border-gray-200 rounded-xl shadow-lg animate-pulse ${className}`}>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

// Skeleton loader for list items
export const SkeletonList = ({ items = 3, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 animate-pulse">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

// Full page loading overlay
export const LoadingOverlay = ({ text = 'Loading...', show = true }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg text-center">
        <LoadingSpinner size="xl" text={text} />
      </div>
    </div>
  );
};

export default LoadingSpinner;
