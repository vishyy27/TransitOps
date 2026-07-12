import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 text-center">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-red-100">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong.</h1>
            <p className="text-sm text-slate-500 mb-6">
              A component crashed and caused the UI to break. Please refresh the page.
            </p>
            <p className="text-xs font-mono bg-red-50 text-red-600 p-3 rounded text-left overflow-auto max-h-32 mb-6">
              {this.state.error?.message}
            </p>
            <button
              className="px-6 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold shadow hover:bg-slate-800 transition"
              onClick={() => window.location.reload()}
            >
              Reload application
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
