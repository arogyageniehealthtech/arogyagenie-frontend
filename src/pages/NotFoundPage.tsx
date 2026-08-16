
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";
import { ROUTES } from "../constants/routes.constants"; 

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-purple-200/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-md w-full bg-white rounded-4xl border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 text-center z-10">
        

        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4 relative">
            <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-20" />
            <SearchX className="w-10 h-10 text-[#5B21B6]" />
          </div>
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold tracking-widest rounded-full uppercase border border-red-100">
            Error 404
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#13102F] mb-3 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. 
        </p>

   
        <div className="flex flex-col gap-3 sm:gap-4">
          <button
            onClick={() => navigate(ROUTES.PATIENT.DASHBOARD || "/")}
            className="w-full flex items-center justify-center gap-2 bg-[#5B21B6] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-sm hover:bg-purple-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/50"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 bg-white text-[#13102F] border border-slate-200 py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
        
      </div>

   
      <div className="mt-8 text-center relative z-10">
        <p className="text-xs font-medium text-slate-400">
          Need help? <a href="/support" className="text-[#5B21B6] hover:underline">Contact ArogyaGenie Support</a>
        </p>
      </div>

    </div>
  );
}