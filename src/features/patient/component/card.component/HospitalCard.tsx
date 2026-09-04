import React from 'react';
import { Star, Building2, CalendarDays, ShieldCheck, Navigation, Eye } from 'lucide-react';
import type { Hospital } from '../../types/hospital';

interface HospitalCardProps {
  hospital: Hospital;
  onBook: () => void;
  onViewDetails?: () => void;
}

// Extracted small reusable component for Stats Pills to keep the main JSX clean
const Badge = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-2 py-1 rounded-lg border border-slate-200/80 shadow-sm shrink-0 text-[11px] font-bold">
    {children}
  </div>
);

export default function HospitalCard({ hospital, onBook, onViewDetails }: HospitalCardProps) {
  return (
    <div className="relative bg-blue-50/40 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300 w-full overflow-hidden flex flex-col group">
      
      {/* Top Section */}
      <div className="p-3 flex flex-col gap-2.5">
        
        {/* Row 1: Header */}
        <div className="flex items-start justify-between gap-2">
          
          {/* Avatar & Info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="relative shrink-0">
              {/* Scaled down avatar for compactness */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-purple-50 border-2 border-purple-100 shadow-sm flex items-center justify-center text-purple-700 font-extrabold text-xl">
                {hospital.image ? (
                  <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{hospital.name.charAt(0)}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm" title="Verified">
                <ShieldCheck className="w-3 h-3" />
              </div>
            </div>

            <div className="min-w-0 flex flex-col flex-1">
              <h3 className="text-xs font-black text-slate-900 leading-tight truncate group-hover:text-indigo-600 transition-colors">
                {hospital.name}
              </h3>
              <p className="text-[11px] font-bold text-purple-600 mt-0.5 truncate">
                {hospital.facilityType}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                {/* <Building2 className="w-3 h-3 shrink-0 text-slate-400" /> */}
                 <Badge>
            <span className="text-rose-500 font-bold">📍</span>
            <span>{hospital.distanceKm} km</span>
          </Badge>
                {/* <span className="truncate">📍. {hospital.distanceKm}</span> */}
              </div>
            </div>
          </div>

          {/* Details Button */}
          {onViewDetails && (
            <button 
              onClick={onViewDetails}
              className="shrink-0 flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-2 py-1.5 rounded-lg border border-purple-200 shadow-sm text-[11px] font-bold transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>Details</span>
            </button>
          )}
        </div>

        {/* Row 2: Stats Pills */}
        {/* <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          <Badge>
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{hospital.rating} ({hospital.reviewCount})</span>
          </Badge>
          <Badge>
            <span className="text-rose-500 font-bold">📍</span>
            <span>{hospital.distanceKm} km</span>
          </Badge>
        </div> */}
      </div>

      {/* Row 3: Emergency Ribbon (Tighter padding) */}
      {/* <div className="bg-linear-to-r from-emerald-50 via-teal-50/40 to-transparent border-t border-b border-emerald-100 px-3 py-1.5 flex items-center gap-1.5 text-[11px] font-bold text-emerald-900">
        <CalendarDays className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="truncate">Emergency Care: <span className="text-emerald-700 font-black">24/7 Available</span></span>
      </div> */}

      {/* Row 4: Action Buttons (Tighter padding) */}
      <div className="bg-slate-50/80 px-3 py-2 flex items-center gap-2 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] sm:text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-all shadow-sm">
          <Navigation className="w-3.5 h-3.5 text-indigo-500" />
          Direction
        </button>
        <button 
          onClick={onBook} 
          className="flex-1 px-3 py-2 text-[11px] sm:text-xs font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 text-center"
        >
          Book Bed
        </button>
      </div>

    </div>
  );
}