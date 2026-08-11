import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class DiagnosticErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in SecureVoteAI:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 font-sans">
          <div className="bg-red-950/40 border border-red-500/30 rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <h1 className="text-2xl font-black text-red-400 mb-2">Application Mount Crash Detected</h1>
            <p className="text-xs text-slate-400 mb-6">A JavaScript runtime error prevented the application from rendering.</p>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-x-auto font-mono text-xs text-red-300 space-y-2">
              <p className="font-bold">Error: {this.state.error?.message}</p>
              <pre className="opacity-80 whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global unhandled error diagnostics
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error("Global Error Caught:", message, error);
  };
  
  window.onunhandledrejection = (event) => {
    console.error("Unhandled Promise Rejection:", event.reason);
  };
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DiagnosticErrorBoundary>
      <App />
    </DiagnosticErrorBoundary>
  </React.StrictMode>
);
