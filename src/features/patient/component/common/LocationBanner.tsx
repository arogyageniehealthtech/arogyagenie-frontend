import React from 'react';
import { MapPin, Navigation, AlertTriangle, Loader2, Edit3 } from 'lucide-react';

interface LocationBannerProps {
  locationName?: string;
  isCustomLocation?: boolean;
  isLocating?: boolean;
  hasLocationError?: boolean;
  errorMessage?: string | null;
  radiusKm?: number;
  onRetryLocation: () => void;
  onChangeLocation: () => void;
  serviceCategory?: string;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({
  locationName = 'Your Current Location',
  isCustomLocation = false,
  isLocating = false,
  hasLocationError = false,
  errorMessage,
  radiusKm = 32,
  onRetryLocation,
  onChangeLocation,
  serviceCategory = 'healthcare services',
}) => {
  if (isLocating) {
    return (
      <div className="w-full bg-linear-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-100 rounded-xl p-3 sm:p-3.5 flex items-center justify-between shadow-xs mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center text-[#5B21B6] shrink-0">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Detecting your location...</p>
            <p className="text-[11px] text-slate-500">Retrieving coordinates to find {serviceCategory} within {radiusKm} KM</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasLocationError) {
    return (
      <div className="w-full bg-amber-50/90 border border-amber-200 rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-900">Location Access Disabled / Unavailable</p>
            <p className="text-[11px] text-amber-700">
              {errorMessage || `Enable GPS or set a custom location to see nearby ${serviceCategory} within ${radiusKm} KM.`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onRetryLocation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Retry GPS</span>
          </button>
          <button
            onClick={onChangeLocation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Set Location</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-linear-to-r from-purple-50/90 via-indigo-50/70 to-slate-50 border border-purple-100/90 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-2 shadow-xs mb-3">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-[#5B21B6] text-white flex items-center justify-center shrink-0 shadow-xs">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-extrabold text-slate-900 truncate">
              📍 {locationName}
            </span>
            {isCustomLocation ? (
              <span className="text-[10px] font-semibold bg-purple-100 text-[#5B21B6] px-2 py-0.5 rounded-full">
                Custom Location
              </span>
            ) : (
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                GPS Active
              </span>
            )}
          </div>
          <p className="text-[11px] font-medium text-slate-600 mt-0.5 truncate">
            Showing {serviceCategory} within <span className="font-bold text-[#5B21B6]">{radiusKm} KM</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onChangeLocation}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-purple-50 text-slate-700 hover:text-[#5B21B6] border border-slate-200 rounded-lg text-xs font-bold transition-all shadow-2xs"
          title="Change or refine location"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Change</span>
        </button>
      </div>
    </div>
  );
};
