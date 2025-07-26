import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Preconnect to critical domains
const preconnectDomains = [
  'https://api.tradefinder.com',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://api.zerodha.com'
];

preconnectDomains.forEach(domain => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = domain;
  link.crossOrigin = 'true';
  document.head.appendChild(link);
});

// Preload critical assets
const preloadAssets = [
  { href: '/static/css/main.chunk.css', as: 'style' },
  { href: '/static/js/main.chunk.js', as: 'script' },
  { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', as: 'style' }
];

preloadAssets.forEach(asset => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = asset.href;
  link.as = asset.as;
  document.head.appendChild(link);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 