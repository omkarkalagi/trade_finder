import Dashboard from './components/Dashboard';
import LiveMarket from './components/LiveMarket';
import { Routes, Route } from 'react-router-dom';
// Import other components as needed

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
