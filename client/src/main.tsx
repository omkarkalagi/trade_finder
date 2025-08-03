import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import LoginPage from './components/LoginPage';
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

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <LoginPage /> }, // Redirect to login first
      { path: "dashboard", element: <Dashboard /> },
      { path: "market", element: <LiveMarket /> },
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
      { path: "*", element: <LoginPage /> }, // Fallback to login
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
    <RouterProvider router={router} />
  </React.StrictMode>
);
