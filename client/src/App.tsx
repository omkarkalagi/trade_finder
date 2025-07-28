import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout             from './components/Layout';
import Loader             from './components/Loader';

// Dynamically import pages to reduce bundle size
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
import AlgoTrading        from './pages/AlgoTrading';
import AutoTrading        from './pages/AutoTrading';
import MarketChart        from './components/MarketChart';
import SectorAnalysis     from './components/SectorAnalysis';
import AIPredictionBot    from './components/AIPredictionBot';
import Placeholder        from './components/Placeholder';
import ErrorBoundary      from './components/ErrorBoundary';

function App() {
  console.log('App component rendering');

  return (
    <ErrorBoundary>
      <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
        <h1 style={{ color: 'red', fontSize: '24px' }}>TEST - If you see this, React is working!</h1>
        <Router>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route element={<Layout />}>
                <Route path="/dashboard"          element={<Dashboard />} />
                <Route path="/portfolio"          element={<Portfolio />} />
                <Route path="/algo-trading"       element={<AlgoTrading />} />
                <Route path="/auto-trading"       element={<AutoTrading />} />
                <Route path="/market-chart"       element={<MarketChart />} />
                <Route path="/sector-analysis"    element={<SectorAnalysis />} />
                <Route path="/ai-prediction-bot"  element={<AIPredictionBot />} />
                <Route path="/placeholder"        element={<Placeholder />} />
              </Route>

              {/* unknown paths → dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    </ErrorBoundary>
  );
}

export default App;
