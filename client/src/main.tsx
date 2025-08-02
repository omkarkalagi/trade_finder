import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import './index.css';
import Dashboard from './components/Dashboard';
import LiveMarket from './components/LiveMarket';
import AutoTrading from './components/AutoTrading';
import AlgoTrading from './components/AlgoTrading';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "market", element: <LiveMarket /> },
      { path: "auto-trading", element: <AutoTrading /> },
      { path: "algo-trading", element: <AlgoTrading /> },
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
