import React from 'react';

export default class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h2>🚨 Application Error</h2>
          <p><strong>Message:</strong> {this.state.error?.message}</p>
          <p><strong>Component:</strong> {this.state.errorInfo?.componentStack}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', marginTop: '20px' }}
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
