import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Loader from './components/Loader';
import PropTypes from 'prop-types';
import MarketChart from './components/MarketChart';

// Lazy load all pages with prefetching
const Dashboard = lazy(() => import(/* webpackPrefetch: true */ './pages/Dashboard'));
const Portfolio = lazy(() => import(/* webpackPrefetch: true */ './pages/Portfolio'));
const Trade = lazy(() => import(/* webpackPrefetch: true */ './pages/Trade'));
const Market = lazy(() => import(/* webpackPrefetch: true */ './pages/Market'));
const Insights = lazy(() => import(/* webpackPrefetch: true */ './pages/Insights'));
const Activity = lazy(() => import(/* webpackPrefetch: true */ './pages/Activity'));
const Settings = lazy(() => import(/* webpackPrefetch: true */ './pages/Settings'));
const Login = lazy(() => import(/* webpackPrefetch: true */ './pages/Login'));
const AlgoTrading = lazy(() => import(/* webpackPrefetch: true */ './pages/AlgoTrading'));
const AutoTrading = lazy(() => import(/* webpackPrefetch: true */ './pages/AutoTrading'));
const Register = lazy(() => import(/* webpackPrefetch: true */ './pages/Register'));

// Preload routes on hover
const preloadRoute = (routeName) => {
  switch(routeName) {
    case 'dashboard': return import('./pages/Dashboard');
    case 'portfolio': return import('./pages/Portfolio');
    case 'trade': return import('./pages/Trade');
    case 'market': return import('./pages/Market');
    case 'insights': return import('./pages/Insights');
    case 'activity': return import('./pages/Activity');
    case 'settings': return import('./pages/Settings');
    case 'login': return import('./pages/Login');
    case 'algo': return import('./pages/AlgoTrading');
    case 'auto': return import('./pages/AutoTrading');
    case 'register': return import('./pages/Register');
    default: return Promise.resolve();
  }
};

export function App() {
  console.log('App component rendering'); // Add this

  return (
    // Remove the test div
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader fullscreen />}>
          <Routes>
            {/* Redirect root directly to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard route */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Other routes */}
            <Route element={<Layout />}>
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/algo-trading" element={<AlgoTrading />} />
              <Route path="/auto-trading" element={<AutoTrading />} />
              <Route path="/market-chart" element={<MarketChart />} />
              <Route path="/sector-analysis" element={<SectorAnalysis />} />
              <Route path="/ai-prediction-bot" element={<AIPredictionBot />} />
              <Route path="/placeholder" element={<Placeholder />} />
            </Route>

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

App.propTypes = {
  // Define your prop types here
};

export default App;
