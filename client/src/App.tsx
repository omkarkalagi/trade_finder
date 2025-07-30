import { Routes, Route } from 'react-router-dom'; // Add this

function App() {
  return (
    <Routes> {/* Add Routes wrapper */}
      <Route path="/" element={<Dashboard />} />
      {/* Add other routes */}
    </Routes>
  );
}
