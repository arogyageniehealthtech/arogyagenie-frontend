import React from 'react';
import { Clock, MapPin, Building2, CalendarDays, Star, ShieldCheck, Navigation } from 'lucide-react';
import type { Doctor } from '../../types/doctor';

export default function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: () => void }) {
  const priceDisplay = doctor.consultationOptions.length > 1 
    ? `₹${Math.min(...doctor.consultationOptions.map(o => o.fee))} - ₹${Math.max(...doctor.consultationOptions.map(o => o.fee))}`
    : `₹${doctor.consultationOptions[0]?.fee || 0}`;

  return (
    /* Changed background to a soft, professional medical slate-blue tint */
    <div className="relative bg-[#F4F6F9] rounded-2xl border border-indigo-100 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-[0_10px_30px_-6px_rgba(99,102,241,0.15)] hover:border-indigo-300 transition-all duration-300 w-full overflow-hidden flex flex-col group">
      
      {/* Top Section: Main Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        
        {/* Row 1: Avatar, Name/Specialty, and Consultation Fee */}
        <div className="flex items-start justify-between gap-3">
          
          {/* Left: Avatar & Info */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-white border-2 border-white shadow-md">
                {doctor.image ? (
                  <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-indigo-700 font-extrabold text-2xl bg-indigo-50">
                    {doctor.name.replace('Dr. ', '').charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm" title="Verified Doctor">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="min-w-0 flex flex-col">
              <h3 className="text-base font-black text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition-colors">
                {doctor.name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-indigo-600 mt-0.5 truncate">
                {doctor.specialty}
              </p>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1 truncate">
                <Building2 className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate">{doctor.clinicName}</span>
              </div>
            </div>
          </div>

          {/* Right: Consultation Fee stacked nicely inside a solid white container */}
          <div className="text-right shrink-0 bg-white px-3 py-1.5 rounded-xl border border-indigo-100/60 shadow-sm">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Fee
            </span>
            <span className="text-base sm:text-lg font-black text-slate-900">
              {priceDisplay}
            </span>
          </div>

        </div>

        {/* Row 2: Stats Pills with crisp white backdrops */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5 bg-white text-blue-900 px-3 py-1.5 rounded-xl border border-indigo-100/60 shadow-sm shrink-0">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>{doctor.experienceYears} Yrs Exp</span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-white text-amber-900 px-3 py-1.5 rounded-xl border border-indigo-100/60 shadow-sm shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{doctor.reviewCount} Reviews</span>
          </div>

          <div className="flex items-center gap-1.5 bg-white text-rose-900 px-3 py-1.5 rounded-xl border border-indigo-100/60 shadow-sm shrink-0">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>{doctor.distanceKm} km</span>
          </div>
        </div>

      </div>

      {/* Row 3: Availability Ribbon */}
      <div className="bg-gradient-to-r from-emerald-100/80 via-teal-50 to-transparent border-t border-b border-emerald-200/60 px-4 py-2 flex items-center gap-2 text-xs font-bold text-emerald-900">
        <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
        <span className="truncate">Next Available: <span className="text-emerald-700 font-black">{doctor.nextAvailableSlot}</span></span>
      </div>

      {/* Row 4: Action Buttons with a solid white background footer */}
      <div className="bg-white/80 px-4 py-3 flex items-center gap-2.5 border-t border-indigo-100/50">
        <button className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all shadow-sm">
          <Navigation className="w-3.5 h-3.5 text-indigo-500" />
          Direction
        </button>
        <button 
          onClick={onBook} 
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.4)] transition-all active:scale-95"
        >
          Book Appointment
        </button>
      </div>

    </div>
  );
}