import React from 'react';
import { MapPin } from 'lucide-react';

export const DoctorMap: React.FC = () => {
  return (
    <div className="relative w-full h-36 lg:h-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50" aria-label="Map showing doctor locations">
      {/* Fake Map Background using CSS Patterns */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />
      <div className="absolute inset-0 bg-linear-to-tr from-slate-100/50 to-transparent" />

      {/* Badge */}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-slate-100 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
        <MapPin size={12} className="text-teal-600" />
        <span className="text-[10px] font-bold text-teal-700">Within 32 km</span>
      </div>

      {/* Simulated Map Markers */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-[#EF4444] rounded-full rounded-br-none rotate-45 flex items-center justify-center shadow-lg border-2 border-white">
          <div className="w-2.5 h-2.5 bg-white rounded-full" />
        </div>
      </div>

      <div className="absolute top-1/4 left-1/2">
        <div className="w-8 h-8 bg-[#6D28D9] rounded-full rounded-br-none rotate-45 flex items-center justify-center shadow-lg border-2 border-white">
          <div className="w-2.5 h-2.5 bg-white rounded-full" />
        </div>
      </div>
      
      <div className="absolute bottom-1/4 right-1/3">
        <div className="w-8 h-8 bg-[#6D28D9] rounded-full rounded-br-none rotate-45 flex items-center justify-center shadow-lg border-2 border-white">
          <div className="w-2.5 h-2.5 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
};