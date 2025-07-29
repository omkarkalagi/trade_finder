import React from 'react';

const Placeholder = ({ title }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">{title} Page</h2>
        <p className="text-gray-500">This page is under development</p>
      </div>
    </div>
  );
};

export default Placeholder; 