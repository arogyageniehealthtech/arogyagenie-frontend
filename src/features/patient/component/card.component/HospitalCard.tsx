import { Star, ShieldCheck, MapPin, Eye, Building2 } from 'lucide-react';
import type { Hospital } from '../../types/hospital';

interface HospitalCardProps {
  hospital: Hospital;
  onBook: () => void;
  onViewDetails?: () => void;
}

export default function HospitalCard({ hospital, onBook, onViewDetails }: HospitalCardProps) {
  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#5B21B6]/40 transition-all duration-200 w-full overflow-hidden flex flex-col p-2.5 sm:p-3 group">
      
      {/* Top Section: Avatar + Info + Details Button */}
      <div className="flex items-start justify-between gap-2.5">
        
        {/* Left: Avatar & Info */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-indigo-50 border border-indigo-100/80 shadow-2xs flex items-center justify-center">
              {hospital.image ? (
                <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-5 h-5 text-[#5B21B6]" />
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-2xs" title="Verified Hospital">
              <ShieldCheck className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate group-hover:text-[#5B21B6] transition-colors">
              {hospital.name}
            </h3>
            
            <p className="text-[11px] font-bold text-[#5B21B6] mt-0.5 truncate">
              {hospital.facilityType || "Super Specialty Hospital"}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mt-0.5 truncate">
              <span className="truncate">
                {hospital.departments?.length ? `${hospital.departments.length} Departments` : 'Multi-department Care'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Distance & Details */}
        <div className="flex flex-col items-end shrink-0 gap-1">
          {hospital.distanceKm !== undefined && (
            <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100/80">
              <MapPin className="w-2.5 h-2.5" />
              {hospital.distanceKm} km
            </span>
          )}

          {onViewDetails && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-600 hover:text-[#5B21B6] bg-slate-50 hover:bg-purple-50 px-1.5 py-0.5 rounded-md border border-slate-200/80 transition-colors cursor-pointer"
            >
              <Eye className="w-2.5 h-2.5" />
              <span>Info</span>
            </button>
          )}
        </div>

      </div>

      {/* Bottom Row: Stats & Action Button */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100/80">
        
        {/* Badges / Highlights */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide shrink-0 text-[10px] font-bold">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-100/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            24/7 Care
          </span>

          {hospital.establishedYear && (
            <span className="inline-flex items-center bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md border border-slate-100">
              Est. {hospital.establishedYear}
            </span>
          )}

          {hospital.rating && (
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-100/80">
              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
              {hospital.rating}
            </span>
          )}
        </div>

        {/* Book Bed Button */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onBook();
          }}
          className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          Book Bed
        </button>

      </div>

    </div>
  );
}