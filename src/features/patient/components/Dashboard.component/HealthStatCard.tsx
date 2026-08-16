
import React from 'react';

interface HealthStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
}

export const HealthStatCard: React.FC<HealthStatCardProps> = ({ icon, label, value, unit }) => {
  return (
    <div className="group bg-white rounded-3xl p-5 flex flex-col items-center justify-center border border-slate-200 shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_16px_50px_-12px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 cursor-pointer">
      
      {/* Icon scales up and lifts slightly on hover */}
      <div className="mb-2 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-0.5">
        {icon}
      </div>
      
      <span className="text-[11px] text-slate-500 font-semibold mb-1 whitespace-nowrap">
        {label}
      </span>
      
      <div className="flex items-baseline gap-0.5">
        {/* Value color changes to Indigo on hover for a premium feel */}
        <span className="text-lg font-bold text-[#1E293B] group-hover:text-indigo-600 transition-colors duration-300">
          {value}
        </span>
      </div>
      
      {unit ? (
        <span className="text-[10px] text-slate-400 font-medium">{unit}</span>
      ) : (
        <span className="text-[10px] text-transparent hidden">_</span>
      )}
      
    </div>
  );
};