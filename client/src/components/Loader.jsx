import React from 'react';

const Loader = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    gray: 'border-gray-500'
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 ${colorClasses[color]} border-opacity-50`}></div>
    </div>
  );
};

export default Loader; 