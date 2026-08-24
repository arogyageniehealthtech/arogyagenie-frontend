import { MapPin,  Star, Store, Truck } from 'lucide-react';
import type { Pharmacy } from '../../types/pharmacy';

export default function PharmacyCard({ pharmacy, onOrder }: { pharmacy: Pharmacy; onOrder: () => void }) {
  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/50 rounded-xl shadow-sm hover:shadow-md hover:border-[#5B21B6]/50 transition-all duration-300 w-4/5 overflow-hidden group relative">
      
      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10">
        
        {/* --- TOP: Pharmacy Info --- */}
        <div className="p-3 flex flex-row gap-6">
          
          {/* Avatar / Store Icon */}
          <div className="relative shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full p-0.5 bg-linear-to-br from-[#5B21B6]/30 to-transparent">
              {pharmacy.image ? (
                <img 
                  src={pharmacy.image} 
                  alt={pharmacy.name} 
                  className="w-full h-full rounded-full object-cover border border-white bg-white shadow-sm"
                />
              ) : (
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#5B21B6] border border-white shadow-sm">
                  <Store className="w-6 h-6" />
                </div>
              )}
            </div>
            {/* Open Status Indicator */}
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${pharmacy.status ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-[#13102F] leading-tight group-hover:text-[#5B21B6] transition-colors truncate">
                  {pharmacy.name}
                </h3>
                <div className="inline-block mt-1 px-1.5 py-0.5 bg-white/70 text-[#5B21B6] rounded text-[9px] sm:text-[10px] font-bold tracking-wide shadow-sm">
                  {pharmacy.category[0] || 'General Pharmacy'}
                </div>
              </div>
              
              {/* Distance Badge */}
              <span className="shrink-0 flex items-center gap-1 bg-white/80 border border-white/50 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold text-slate-700 shadow-sm">
                <MapPin className="w-2.5 h-2.5 text-[#5B21B6]" /> {pharmacy.distance} km
              </span>
            </div>
            
            {/* Stats Row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] text-slate-800 font-medium">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 
                <span className="font-bold">{pharmacy.rating}</span>
                <span className="text-slate-600">({pharmacy.reviewCount})</span>
              </span>
              <span className="w-0.5 h-0.5 rounded-full bg-slate-400 hidden sm:block"></span>
              
              <span className="flex items-center gap-1 truncate max-w-35 sm:max-w-50">
                <MapPin className="w-3 h-3 text-slate-600" /> {pharmacy.address}
              </span>
            </div>
          
            <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-700 mt-1.5 truncate">
              <Truck className="w-2.5 h-2.5 shrink-0" /> 
              <span className="truncate">Home Delivery: {pharmacy.deliveryTimeMinutes} mins</span>
            </div>
          </div>
        </div>
        
        {/* --- BOTTOM: Action Footer (Transparent Glass) --- */}
        <div className="bg-white/20 px-3 py-2.5 border-t border-white/30 flex flex-row items-center justify-between gap-3">
          
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-baseline gap-1">
              <p className="font-medium text-slate-800 text-xs sm:text-sm leading-none">
                {pharmacy.status ? 'Open Now' : 'Closed'}
              </p>
              <p className="text-[9px] text-slate-700 font-medium hidden sm:block">• Closes {pharmacy.closingTime}</p>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex gap-2 shrink-0">
            <button className="px-8 py-2.5 text-[10px] sm:text-[11px] font-medium text-slate-700 bg-white/80 border border-white hover:bg-white rounded-lg transition-all shadow-sm">
              Call
            </button>
            <button 
              onClick={onOrder} 
              className="px-8 py-2.5 text-[10px] sm:text-[11px] font-medium text-white bg-[#5B21B6] hover:bg-[#4c1d95] rounded-lg shadow-sm hover:shadow transition-all active:scale-95"
            >
              Order Meds
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}