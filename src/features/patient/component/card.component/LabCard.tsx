import { Star, Microscope, ShieldCheck, Navigation, Eye, TestTube } from 'lucide-react';
import type { DiagnosticCentre } from '../../types/diagnostic';

interface LabCardProps {
  centre: DiagnosticCentre;
  onBook: () => void;
  onViewDetails?: () => void;
}

// Helper to safely format address whether it is a string or an object
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

  // Format distance to 2 decimal places safely
  const formattedDistance =
    centre.distanceKm != null && !isNaN(Number(centre.distanceKm))
      ? `${Number(centre.distanceKm).toFixed(2)} km away`
      : 'Nearby';

  const handleDirections = () => {
    const rawAddress = centre.address as any;
    const lat = centre.lat ?? (typeof rawAddress === 'object' ? rawAddress?.latitude : null);
    const lng = centre.lng ?? (typeof rawAddress === 'object' ? rawAddress?.longitude : null);

    if (lat != null && lng != null) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    } else if (displayAddress && displayAddress !== 'Address unavailable') {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(displayAddress)}`, '_blank');
    }
  };

  return (
    <div className="relative bg-blue-50/40 rounded-2xl border border-slate-200/90 shadow-[0_10px_25px_-5px_rgba(15,23,42,0.08),0_8px_10px_-6px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_35px_-10px_rgba(79,70,229,0.15)] hover:border-indigo-300 transition-all duration-300 w-full overflow-hidden flex flex-col group">
      {/* Top Section: Main Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-4">
        {/* Row 1: Avatar, Name/Address, and Details Button */}
        <div className="flex items-start justify-between gap-3">
          {/* Left: Avatar & Info */}
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-purple-50 border-2 border-purple-100 shadow-sm flex items-center justify-center text-purple-700">
                <Microscope className="w-8 h-8" />
              </div>
              {centre.verified && (
                <div
                  className="absolute -bottom-1 -right-1 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full p-0.5 border-2 border-white shadow-sm"
                  title="Verified Lab Centre"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex flex-col flex-1">
              <h3 className="text-base font-black text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition-colors">
                {centre.name}
              </h3>

              <p className="text-xs sm:text-sm font-bold text-purple-600 mt-0.5 truncate">
                {displayAddress}
              </p>

              <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1 truncate">
                <TestTube className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span className="truncate">
                  {testCount > 0 ? `${testCount}+ Tests Available` : 'Tests Available'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Details Button */}
          {onViewDetails && (
            <button
              onClick={onViewDetails}
              className="shrink-0 flex items-center gap-1 bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-xl border border-purple-200 shadow-sm text-xs font-bold transition-all cursor-pointer"
              title="View Full Details"
            >
              <Eye className="w-3.5 h-3.5 text-purple-600" />
              <span>Details</span>
            </button>
          )}
        </div>

        {/* Row 2: Stats Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs font-bold text-slate-700">
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{centre.rating ?? 0} ({centre.reviewCount ?? 0} Reviews)</span>
          </div>

          {/* Formatted Distance Pill */}
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm shrink-0">
            <span className="text-rose-500 font-bold">📍</span>
            <span>{formattedDistance}</span>
          </div>
        </div>
      </div>

      {/* Row 3: Action Buttons */}
      <div className="bg-slate-50/80 px-4 py-3 flex items-center gap-2.5 border-t border-slate-100">
        <button
          onClick={handleDirections}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 hover:border-slate-300 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-indigo-500" />
          Direction
        </button>
        <button
          onClick={onBook}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_16px_rgba(79,70,229,0.4)] transition-all active:scale-95 text-center cursor-pointer"
        >
          Book Lab Test
        </button>
      </div>
    </div>
  );
}