import React, { Suspense, lazy } from 'react';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';
import RootRedirect from './components/RootRedirect';
import PropTypes from 'prop-types';

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

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<Loader fullscreen />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes - only accessible when authenticated */}
            <Route element={<Layout preloadRoute={preloadRoute} />}>
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* Add similar protection for all other private routes */}
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <Portfolio />
                  </ProtectedRoute>
                }
              />
              {/* ... other protected routes ... */}
            </Route>

            {/* Redirect root to login */}
            <Route path="/" element={<RootRedirect />} />

            {/* Redirect any unknown paths to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

App.propTypes = {
  // Define your prop types here
};
