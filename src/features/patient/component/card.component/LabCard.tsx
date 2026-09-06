import { Star, Microscope, ShieldCheck, MapPin, Eye, TestTube } from 'lucide-react';
import type { DiagnosticCentre } from '../../types/diagnostic';

interface LabCardProps {
  centre: DiagnosticCentre;
  onBook: () => void;
  onViewDetails?: () => void;
}

function formatAddress(address: any): string {
  if (!address) return 'Address unavailable';
  if (typeof address === 'string') return address;

  const parts = [
    address.line1,
    address.line2,
    address.landmark,
    address.city,
    address.state,
    address.postalCode,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : 'Address unavailable';
}

export default function LabCard({ centre, onBook, onViewDetails }: LabCardProps) {
  const testCount = centre.availableTests?.length || 0;
  const displayAddress = formatAddress(centre.address);

  const formattedDistance =
    centre.distanceKm != null && !isNaN(Number(centre.distanceKm))
      ? `${Number(centre.distanceKm).toFixed(1)} km`
      : 'Nearby';

  return (
    <div className="relative bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#5B21B6]/40 transition-all duration-200 w-full overflow-hidden flex flex-col p-2.5 sm:p-3 group">
      
      {/* Top Section: Avatar + Info + Details Button */}
      <div className="flex items-start justify-between gap-2.5">
        
        {/* Left: Avatar & Info */}
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-purple-50 border border-purple-100/80 shadow-2xs flex items-center justify-center text-[#5B21B6]">
              <Microscope className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            {centre.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-2xs"
                title="Verified Lab Centre"
              >
                <ShieldCheck className="w-2.5 h-2.5" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight truncate group-hover:text-[#5B21B6] transition-colors">
              {centre.name}
            </h3>

            <p className="text-[11px] font-bold text-[#5B21B6] mt-0.5 truncate">
              {displayAddress}
            </p>

            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium mt-0.5 truncate">
              <TestTube className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">
                {testCount > 0 ? `${testCount}+ Tests Available` : 'Pathology & Diagnostic Scans'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Distance & Details */}
        <div className="flex flex-col items-end shrink-0 gap-1">
          <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-100/80">
            <MapPin className="w-2.5 h-2.5" />
            {formattedDistance}
          </span>

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
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-100/80">
            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
            {centre.rating ?? 4.8}
          </span>

          {centre.reviewCount != null && (
            <span className="inline-flex items-center bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded-md border border-slate-100">
              {centre.reviewCount} reviews
            </span>
          )}

          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-100/80">
            Home Sample
          </span>
        </div>

        {/* Book Lab Test Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBook();
          }}
          className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-linear-to-r from-[#5B21B6] to-indigo-600 hover:from-[#4c1d95] hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs hover:shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          Book Test
        </button>

      </div>

    </div>
  );
}