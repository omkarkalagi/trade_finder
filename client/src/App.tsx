import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import './index.css';
import { AlpacaProvider } from './context/AlpacaContext';

function App() {
  useEffect(() => {
    // Apply dark theme to document
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  }, []);

  return (
    <AlpacaProvider>
      <div className="app-container dark min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
        {/* The Outlet component will render the matched child route */}
        <Outlet />
      </div>
    </AlpacaProvider>
  );
}

export default App;
