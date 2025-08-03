import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import LiveMarket from './components/LiveMarket';
import AutoTrading from './components/AutoTrading';
import AlgoTrading from './components/AlgoTrading';
import TradeDiscovery from './components/TradeDiscovery';
import StrategyBuilder from './components/StrategyBuilder';
import SocialTrading from './components/SocialTrading';
import StrategyLab from './components/StrategyLab';
import AlternativeData from './components/AlternativeData';
import PortfolioAnalytics from './components/PortfolioAnalytics';
import CommunityEducation from './components/CommunityEducation';
import SectorScope from './components/SectorScope';
import MarketNewsPage from './components/MarketNewsPage';
import News from './components/News';
import RiskManagement from './components/RiskManagement';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> }, // Default to dashboard when authenticated
      { path: "dashboard", element: <Dashboard /> },
      { path: "market", element: <LiveMarket /> },
      { path: "market-news", element: <MarketNewsPage /> },
      { path: "news", element: <News /> },
      { path: "sector-scope", element: <SectorScope /> },
      { path: "auto-trading", element: <AutoTrading /> },
      { path: "algo-trading", element: <AlgoTrading /> },
      { path: "trade-discovery", element: <TradeDiscovery /> },
      { path: "strategy-builder", element: <StrategyBuilder /> },
      { path: "strategy-lab", element: <StrategyLab /> },
      { path: "social-trading", element: <SocialTrading /> },
      { path: "alternative-data", element: <AlternativeData /> },
      { path: "portfolio-analytics", element: <PortfolioAnalytics /> },
      { path: "community-education", element: <CommunityEducation /> },
      { path: "risk-management", element: <RiskManagement /> },
      { path: "*", element: <Dashboard /> }, // Fallback to dashboard
    ],
  },
], {
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
