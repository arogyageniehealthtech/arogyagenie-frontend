import { useRouteError, useNavigate } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export function RouteErrorElement() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  const errorMessage = error?.message || error?.statusText || "An unexpected error occurred while loading this page.";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <div className="relative max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center z-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-200">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Application Error
        </h1>

        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          We encountered an issue rendering this view. Your session and saved medical data remain secure.
        </p>

        {import.meta.env.DEV && (
          <div className="mt-4 rounded-xl bg-slate-900 p-4 text-left border border-slate-800">
            <p className="text-[11px] font-mono text-red-400 break-words whitespace-pre-wrap">
              {errorMessage}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 bg-[#5B21B6] text-white py-3 px-5 rounded-xl font-bold text-sm shadow-sm hover:bg-purple-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 py-3 px-5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default RouteErrorElement;
