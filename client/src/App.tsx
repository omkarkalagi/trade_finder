import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';
import { AlpacaProvider } from './context/AlpacaContext';

function App() {
  useEffect(() => {
    // Remove any dark theme classes
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }, []);

  return (
    <AlpacaProvider>
      <div className="app-container min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* The Outlet component will render the matched child route */}
        <Outlet />
      </div>
    </AlpacaProvider>
  );
}

export default App;
