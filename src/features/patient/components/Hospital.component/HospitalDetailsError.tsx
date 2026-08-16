import React from "react";
import { AlertCircle } from "lucide-react";

interface HospitalDetailsErrorProps {
  onRetry: () => void;
}

export const HospitalDetailsError: React.FC<HospitalDetailsErrorProps> = ({ onRetry }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-[#14152B] mb-1">Unable to load hospital</h3>
      <p className="text-sm text-[#64748B] max-w-sm mb-5">
        We couldn't retrieve the hospital information right now. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="bg-purple-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-purple-800 transition"
      >
        Try Again
      </button>
    </div>
  );
};