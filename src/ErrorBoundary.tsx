import {
  Component,
  type ErrorInfo,
  type ReactNode,
} from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to your monitoring service here
    console.error("ArogyaGenie Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#030A1C] px-6 font-sans">
          <div className="w-full max-w-md rounded-3xl bg-[#06112B] p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
            
            {/* Pulsing Error Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 animate-pulse">
              <span className="text-3xl text-red-500">!</span>
            </div>

            <h1 className="text-2xl font-bold text-white">
              System Disruption
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              ArogyaGenie encountered an unexpected issue. 
              Our recovery protocols are active.
            </p>

            {/* Error Details (Only visible in Development) */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-5 rounded-lg bg-[#081633] p-4 text-left border border-white/5">
                <summary className="cursor-pointer text-xs font-medium text-slate-400 hover:text-white">
                  Technical Details
                </summary>
                <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap text-[10px] text-red-400">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={this.handleReload}
                className="rounded-xl bg-[#6D28D9] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#7C3AED] hover:shadow-[0_0_15px_rgba(109,40,217,0.4)]"
              >
                Try Again
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}