import { Outlet } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <div className="app-container">
      {/* The Outlet component will render the matched child route */}
      <Outlet />
    </div>
  );
}

export default App;
