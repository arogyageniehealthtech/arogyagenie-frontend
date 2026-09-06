import { Clock, MapPin, Building2, Star, ShieldCheck, CalendarDays } from 'lucide-react';
import type { Doctor } from '../../types/doctor';

export default function DoctorCard({ doctor, onBook }: { doctor: Doctor; onBook: () => void }) {
  const priceDisplay = doctor.facilityAffiliations?.[0]?.consultationFee
    ? `₹${doctor.facilityAffiliations[0].consultationFee}`
    : "N/A";
  
  const specialtyName = doctor.specializations?.map(s => s.specialization?.name || s.specialization).filter(Boolean).join(", ") || "General Physician";

  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#5B21B6]/40 transition-all duration-200 w-full overflow-hidden flex flex-col p-2.5 sm:p-3 group">
      
      {/* Main Top Row: Avatar + Doctor Info + Consultation Fee */}
      <div className="flex items-start justify-between gap-2.5">
        
        {/* Left: Avatar & Info */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-purple-50 border border-purple-100/80 shadow-2xs flex items-center justify-center">
              {doctor.image ? (
                <img src={doctor.image} alt={doctor.firstName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#5B21B6] font-black text-sm sm:text-base">
                  {doctor.firstName?.replace('Dr. ', '').charAt(0) || 'D'}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-2xs" title="Verified Doctor">
              <ShieldCheck className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Text Details */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate group-hover:text-[#5B21B6] transition-colors">
              {doctor.firstName?.startsWith('Dr.') ? `${doctor.firstName} ${doctor.lastName || ''}` : `Dr. ${doctor.firstName} ${doctor.lastName || ''}`}
            </h3>
            
            <p className="text-[11px] font-bold text-[#5B21B6] mt-0.5 truncate">
              {specialtyName}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mt-0.5 truncate">
              <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{doctor.clinicName || "Associated Healthcare Center"}</span>
            </div>
          </div>
        </div>

        {/* Right: Fee & Rating Badge */}
        <div className="flex flex-col items-end shrink-0 gap-0.5">
          <div className="bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 text-right">
            <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block leading-none">
              Fee
            </span>
            <span className="text-xs font-black text-slate-900 leading-tight">
              {priceDisplay}
            </span>
          </div>

          {doctor.distanceKm != null && (
            <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5 mt-0.5">
              <MapPin className="w-2.5 h-2.5" />
              {doctor.distanceKm} km
            </span>
          )}
        </div>

      </div>

      {/* Bottom Row: Stats & Action Button */}
      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-100/80">
        
        {/* Pills / Quick Info */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide shrink-0 text-[10px] font-bold">
          {doctor.experienceYears != null && doctor.experienceYears > 0 && (
            <span className="inline-flex items-center gap-1 bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded-md border border-slate-100">
              <Clock className="w-2.5 h-2.5 text-blue-500" />
              {doctor.experienceYears}y exp
            </span>
          )}

          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-100/80">
            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
            {doctor.rating ?? 4.8}
          </span>

          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-100/80">
            <CalendarDays className="w-2.5 h-2.5 text-emerald-600" />
            <span className="truncate max-w-20 sm:max-w-none">{doctor.nextAvailableSlot || "Today"}</span>
          </span>
        </div>

        {/* Book Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook();
          }}
          className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          Book Now
        </button>

      </div>

    </div>
  );
}
