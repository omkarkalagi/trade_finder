import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app.jsx';  // If you renamed to lowercase
import './index.css';
import './resolveExtensions.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
