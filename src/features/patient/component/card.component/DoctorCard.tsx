import { Clock, MapPin, Building2, CalendarDays, Star, ShieldCheck, Navigation } from 'lucide-react';
import type { Doctor } from '../../types/doctor';

export default function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: () => void }) {
  const priceDisplay = doctor.consultationOptions.length > 1 
    ? `₹${Math.min(...doctor.consultationOptions.map(o => o.fee))} - ₹${Math.max(...doctor.consultationOptions.map(o => o.fee))}`
    : `₹${doctor.consultationOptions[0]?.fee || 0}`;

  return (
    <div className="relative bg-[#F4F6F9] rounded-xl sm:rounded-2xl border border-indigo-100 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_30px_-6px_rgba(99,102,241,0.15)] hover:border-indigo-300 transition-all duration-300 w-full overflow-hidden flex flex-col group">
      
      {/* Top Section: Main Content - Mobile optimized */}
      <div className="p-3 sm:p-4 md:p-5 flex flex-col gap-3 sm:gap-4">
        
        {/* Row 1: Avatar, Name/Specialty, and Consultation Fee */}
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          
          {/* Left: Avatar & Info */}
          <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-lg sm:rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-700 font-extrabold text-xl sm:text-2xl bg-indigo-50">
                    {doctor.name.replace('Dr. ', '').charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm" title="Verified Doctor">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition-colors">
                {doctor.name}
              </h3>
              <p className="text-xs font-bold text-indigo-600 mt-0.5 truncate">
                {doctor.specialty}
              </p>
              <div className="flex items-center gap-0.5 text-xs text-slate-500 font-medium mt-1 truncate">
                <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="truncate">{doctor.clinicName}</span>
              </div>
            </div>
          </div>

          {/* Right: Consultation Fee - Compact on mobile */}
          <div className="text-right shrink-0 bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-indigo-100/60 shadow-sm">
            <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Fee
            </span>
            <span className="text-xs sm:text-lg font-black text-slate-900 line-clamp-1">
              {priceDisplay}
            </span>
          </div>

        </div>

        {/* Row 2: Stats Pills - Horizontal scroll on mobile */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1 bg-white text-blue-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-indigo-100/60 shadow-sm shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500 shrink-0" />
            <span className="text-xs">{doctor.experienceYears} Yrs</span>
          </div>
          
          <div className="flex items-center gap-1 bg-white text-amber-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-indigo-100/60 shadow-sm shrink-0">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 fill-amber-500 shrink-0" />
            <span className="text-xs">{doctor.reviewCount}</span>
          </div>

          <div className="flex items-center gap-1 bg-white text-rose-900 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-indigo-100/60 shadow-sm shrink-0">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-rose-500 shrink-0" />
            <span className="text-xs">{doctor.distanceKm} km</span>
          </div>
        </div>

      </div>

      {/* Row 3: Availability Ribbon - Responsive height */}
      <div className="bg-linear-to-r from-emerald-100/80 via-teal-50 to-transparent border-t border-b border-emerald-200/60 px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 text-xs font-bold text-emerald-900 min-h-10 sm:min-h-auto">
        <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
        <span className="truncate text-xs">Next: <span className="text-emerald-700 font-black">{doctor.nextAvailableSlot}</span></span>
      </div>

      {/* Row 4: Action Buttons - Stacked on mobile */}
      <div className="bg-white/80 px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col sm:flex-row items-stretch gap-2 border-t border-indigo-100/50">
        <button className="flex-1 flex items-center justify-center gap-1 px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg sm:rounded-xl transition-all shadow-sm">
          <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 shrink-0" />
          <span className="hidden sm:inline">Direction</span>
          <span className="sm:hidden">Map</span>
        </button>
        <button 
          onClick={onBook} 
          className="flex-1 px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-lg sm:rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.4)] transition-all active:scale-95"
        >
          Book Now
        </button>
      </div>

    </div>
  );
}
