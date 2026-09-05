import React from 'react';
import { MapPinOff, Navigation, Search } from 'lucide-react';

interface EmptyNearbyHealthcareProps {
  title?: string;
  message?: string;
  radiusKm?: number;
  serviceName?: string;
  onResetSearch?: () => void;
  onChangeLocation?: () => void;
  hasActiveFilters?: boolean;
}

export const EmptyNearbyHealthcare: React.FC<EmptyNearbyHealthcareProps> = ({
  radiusKm = 32,
  serviceName = 'healthcare providers',
  message,
  onResetSearch,
  onChangeLocation,
  hasActiveFilters = false,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-xs my-4">
      <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5B21B6] mb-4 shadow-xs">
        <MapPinOff className="w-8 h-8" />
      </div>

      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5">
        No nearby {serviceName} found
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
        {message || `No nearby ${serviceName} were found within ${radiusKm} KM of your location.`}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {hasActiveFilters && onResetSearch && (
          <button
            onClick={onResetSearch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
        {onChangeLocation && (
          <button
            onClick={onChangeLocation}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B21B6] hover:bg-[#4C1D95] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Set Custom Location</span>
          </button>
        )}
      </div>
    </div>
  );
};
