import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import LiveMarket from './components/LiveMarket';
// Import other components

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/market" element={<LiveMarket />} />
      {/* Add other routes */}
    </Routes>
  );
}

export default App;
