import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import Dashboard from './components/Dashboard';
import LiveMarket from './components/LiveMarket';
import AutoTrading from './components/AutoTrading';
import AlgoTrading from './components/AlgoTrading';
import TradeDiscovery from './components/TradeDiscovery';
import StrategyBuilder from './components/StrategyBuilder';
import SocialTrading from './components/SocialTrading';
import StrategyLab from './components/StrategyLab';
import AlternativeData from './components/AlternativeData';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> }, // Default route
      { path: "dashboard", element: <Dashboard /> },
      { path: "market", element: <LiveMarket /> },
      { path: "auto-trading", element: <AutoTrading /> },
      { path: "algo-trading", element: <AlgoTrading /> },
      { path: "trade-discovery", element: <TradeDiscovery /> },
      { path: "strategy-builder", element: <StrategyBuilder /> },
      { path: "strategy-lab", element: <StrategyLab /> },
      { path: "social-trading", element: <SocialTrading /> },
      { path: "alternative-data", element: <AlternativeData /> },
      { path: "*", element: <Dashboard /> }, // Fallback route
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
