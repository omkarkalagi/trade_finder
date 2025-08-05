import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FeatureHighlights() {
  const [showAll, setShowAll] = useState(false);
  const features = [
    {
      id: 1,
      title: 'Trade Discovery',
      description: 'Find trading opportunities with customizable scanners and AI pattern recognition',
      icon: '🔍',
      path: '/trade-discovery',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      title: 'Portfolio Analytics',
      description: 'Track performance, assess risk, and optimize your investment portfolio',
      icon: '📈',
      path: '/portfolio-analytics',
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'bg-teal-100 text-teal-600'
    },
    {
      id: 3,
      title: 'Strategy Builder',
      description: 'Create, backtest, and deploy custom trading strategies without coding',
      icon: '⚙️',
      path: '/strategy-builder',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      title: 'Strategy Lab',
      description: 'Test strategies against historical data with AI-enhanced simulations',
      icon: '🧪',
      path: '/strategy-lab',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 5,
      title: 'Alternative Data',
      description: 'Access unique insights from sentiment analysis, insider trading, and more',
      icon: '📊',
      path: '/alternative-data',
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 6,
      title: 'Community & Education',
      description: 'Learn from experts, share knowledge, and access premium trading strategies',
      icon: '👥',
      path: '/community-education',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'bg-orange-100 text-orange-600'
    },
    {
      id: 7,
      title: 'Social Trading',
      description: 'Copy trades from top-performing traders and share your own strategies',
      icon: '👥',
      path: '/social-trading',
      color: 'bg-green-50 border-green-200',
      iconColor: 'bg-green-100 text-green-600'
    }
  ];

  const displayedFeatures = showAll ? features : features.slice(0, 3);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>✨</span>
        Feature Highlights
      </h2>
      <div className="space-y-3">
        {displayedFeatures.map(feature => (
          <div key={feature.id} className={`p-4 rounded-lg border ${feature.color} hover:shadow-md transition-all duration-200`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 h-10 w-10 rounded-full ${feature.iconColor} flex items-center justify-center text-xl`} style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
                {feature.icon}
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                <Link to={feature.path} className="text-blue-600 text-sm hover:underline mt-2 inline-block hover:text-blue-700 transition-colors">
                  Explore {feature.title} →
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* View More/Less Button */}
        {features.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <span className="mr-2" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
              {showAll ? '📤' : '📥'}
            </span>
            {showAll ? `Show Less` : `View More (${features.length - 3} more)`}
          </button>
        )}
      </div>
    </div>
  );
}
