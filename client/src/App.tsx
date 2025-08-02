import { Outlet } from 'react-router-dom';
import './index.css';
import { AlpacaProvider } from './context/AlpacaContext';

function App() {
  return (
    <AlpacaProvider>
      <div className="app-container">
        {/* The Outlet component will render the matched child route */}
        <Outlet />
      </div>
    </AlpacaProvider>
  );
}

export default App;
