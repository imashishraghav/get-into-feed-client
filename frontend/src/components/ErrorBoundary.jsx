import React from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, we log without leaking sensitive credentials
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <section className="min-h-[380px] py-16 px-4 sm:px-6 flex items-center justify-center bg-slate-50 text-slate-900">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-space">
                Something didn’t load right
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                An unexpected display issue occurred in this section. Our systems have logged it.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
