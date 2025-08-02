import { Outlet } from 'react-router-dom';
// Import other components as needed

function App() {
  return (
    <div>
      {/* You can add common layout elements here, like a header or sidebar */}
      <Outlet /> {/* This will render the matched child route component */}
    </div>
  );
}

export default App;
