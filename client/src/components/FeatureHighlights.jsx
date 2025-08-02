import React from 'react';
import { Link } from 'react-router-dom';

export default function FeatureHighlights() {
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
      title: 'Strategy Builder',
      description: 'Create, backtest, and deploy custom trading strategies without coding',
      icon: '⚙️',
      path: '/strategy-builder',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'bg-purple-100 text-purple-600'
    },
    {
      id: 3,
      title: 'Strategy Lab',
      description: 'Test strategies against historical data with AI-enhanced simulations',
      icon: '🧪',
      path: '/strategy-lab',
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 4,
      title: 'Alternative Data',
      description: 'Access unique insights from sentiment analysis, insider trading, and more',
      icon: '📊',
      path: '/alternative-data',
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 5,
      title: 'Social Trading',
      description: 'Copy trades from top-performing traders and share your own strategies',
      icon: '👥',
      path: '/social-trading',
      color: 'bg-green-50 border-green-200',
      iconColor: 'bg-green-100 text-green-600'
    }
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Feature Highlights</h2>
      <div className="space-y-3">
        {features.map(feature => (
          <div key={feature.id} className={`p-4 rounded-lg border ${feature.color}`}>
            <div className="flex items-start">
              <div className={`flex-shrink-0 h-10 w-10 rounded-full ${feature.iconColor} flex items-center justify-center text-xl`}>
                {feature.icon}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                <Link to={feature.path} className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                  Explore {feature.title} →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
