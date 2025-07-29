import React from 'react';

const Placeholder = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="mb-6">
            <span className="text-6xl">🔧</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Under Construction</h1>
          <p className="text-lg text-gray-600 mb-8">
            This feature is currently being developed. Please check back soon!
          </p>
          <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Coming Soon</h2>
            <p className="text-gray-600 text-sm">
              Our team is working hard to bring you this amazing feature.
              Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
