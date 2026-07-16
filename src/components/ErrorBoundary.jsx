import { Component } from 'react';

/**
 * ErrorBoundary — catches rendering errors anywhere in the child tree.
 * Prevents the "dark blank screen" by showing a user-friendly fallback.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('[ErrorBoundary] Caught an error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack);
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const dev = import.meta.env.DEV;
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          <div className="max-w-lg w-full bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-8 text-center">
            {/* Brand header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-white font-semibold text-lg">MTXtrkr</span>
              <span className="text-slate-400 italic text-xs ml-1">MaintenX Tracker</span>
            </div>

            {/* Error icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-slate-400 text-sm mb-6">
              An unexpected error occurred. Our team has been notified.
            </p>

            {/* Error details (dev only) */}
            {dev && this.state.error && (
              <div className="mb-6 text-left">
                <details className="text-xs">
                  <summary className="text-slate-400 cursor-pointer hover:text-slate-300 mb-2">
                    Error details (dev only)
                  </summary>
                  <pre className="bg-slate-950 rounded-lg p-3 text-red-300 overflow-auto max-h-32 text-[11px] leading-tight whitespace-pre-wrap break-all">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack && (
                      <>
                        {'\n\nComponent Stack:'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              </div>
            )}

            {/* Error message (always visible) */}
            {this.state.error && (
              <div className="mb-6 bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                <p className="text-slate-300 text-xs font-mono">
                  {this.state.error?.message || 'Unknown error'}
                </p>
              </div>
            )}

            {/* Try Again button */}
            <button
              onClick={this.handleTryAgain}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Global error handler setup — call once at the top of the app.
 * Logs uncaught errors and unhandled promise rejections to console.
 */
export function setupGlobalErrorHandlers() {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('[Global onerror]', { message, source, lineno, colno, error });
    return false; // let default handler run
  };

  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Global unhandledrejection]', {
      reason: event.reason,
      stack: event.reason?.stack,
    });
  });
}