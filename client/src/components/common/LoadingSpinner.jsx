import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="loading-spinner"></div>
    <span>Processing...</span>
  </div>
);

export default LoadingSpinner; 