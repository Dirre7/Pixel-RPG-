import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#020617', color: '#f87171', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h1 style={{ color: '#fbbf24', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>⚠️ Error en Crónicas Pixel RPG</h1>
          <pre style={{ background: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #ef4444', overflowX: 'auto', fontSize: '12px', color: '#fca5a5' }}>
            {this.state.error?.toString()}
            {'\n'}
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px', padding: '8px 16px', background: '#eab308', color: '#020617', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
          >
            🔄 Recargar Juego
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
