import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ preloadRoute }) => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/portfolio', label: 'Portfolio', icon: '💼' },
    { path: '/trade', label: 'Trade', icon: '💱' },
    { path: '/market', label: 'Market', icon: '📈' },
    { path: '/insights', label: 'Insights', icon: '🔍' },
    { path: '/activity', label: 'Activity', icon: '📝' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/algo-trading', label: 'Algo Trading', icon: '🤖' },
    { path: '/auto-trading', label: 'Auto Trading', icon: '🚀' }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-600 to-purple-800 text-white w-64 min-h-screen p-4">
      <div className="p-4 mb-8">
        <h1 className="text-2xl font-bold">Trade Finder</h1>
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
                onMouseEnter={() => preloadRoute(item.path.split('/')[1])}
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