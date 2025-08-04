import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './index.css';
import { AlpacaProvider } from './context/AlpacaContext';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Remove any dark theme classes
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }, []);

  return (
    <ErrorBoundary>
      <AlpacaProvider>
        <div className="app-container min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          
          {/* Main Content Area */}
          <div className="lg:ml-72">
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="fixed top-4 left-4 z-30 p-2 rounded-lg bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
                aria-label="Open navigation menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            {/* The Outlet component will render the matched child route */}
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </div>
      </AlpacaProvider>
    </ErrorBoundary>
  );
}

export default App;
