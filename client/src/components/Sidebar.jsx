import React from 'react';
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/market', label: 'NSE Market', icon: '📈' },
    { path: '/trade-discovery', label: 'Trade Discovery', icon: '🔍' },
    { path: '/strategy-builder', label: 'Strategy Builder', icon: '⚙️' },
    { path: '/strategy-lab', label: 'Strategy Lab', icon: '🧪' },
    { path: '/alternative-data', label: 'Alternative Data', icon: '📊' },
    { path: '/algo-trading', label: 'NSE Algo Trading', icon: '🤖' },
    { path: '/auto-trading', label: 'NSE Auto Trading', icon: '🚀' },
    { path: '/social-trading', label: 'Social Trading', icon: '👥' }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-600 to-purple-800 text-white w-64 min-h-screen p-4">
      <div className="p-4 mb-8">
        <h1 className="text-2xl font-bold">NSE Trade Finder</h1>
        <p className="text-xs text-blue-200 mt-1">Indian Market Analytics</p>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({isActive}) =>
                  `flex items-center p-3 rounded-lg transition ${
                    isActive
                      ? 'bg-white text-purple-800'
                      : 'hover:bg-purple-700'
                  }`
                }
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default React.memo(Sidebar);
