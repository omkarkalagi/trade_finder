import React from 'react';
import {
  CogIcon,
  WrenchScrewdriverIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const Placeholder = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
            <CogIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Feature Coming Soon</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This feature is currently under development. Our team is working hard to bring you the best trading experience.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <WrenchScrewdriverIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">In Development</h3>
            <p className="text-sm text-gray-600">Feature is being built with latest technologies</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing Phase</h3>
            <p className="text-sm text-gray-600">Rigorous testing to ensure quality</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CogIcon className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Launch Ready</h3>
            <p className="text-sm text-gray-600">Will be available in next update</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Development Progress</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Frontend Development</span>
                <span className="text-gray-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Backend Integration</span>
                <span className="text-gray-600">60%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Testing & QA</span>
                <span className="text-gray-600">40%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Deployment</span>
                <span className="text-gray-600">20%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Coming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Advanced Analytics</h4>
                  <p className="text-sm text-gray-600">Comprehensive market analysis tools</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Real-time Data</h4>
                  <p className="text-sm text-gray-600">Live market data and updates</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Custom Alerts</h4>
                  <p className="text-sm text-gray-600">Personalized notification system</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Portfolio Tracking</h4>
                  <p className="text-sm text-gray-600">Advanced portfolio management</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Risk Management</h4>
                  <p className="text-sm text-gray-600">Comprehensive risk assessment</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Mobile App</h4>
                  <p className="text-sm text-gray-600">Trading on the go</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Have suggestions or want to be notified when this feature launches?
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Placeholder;
