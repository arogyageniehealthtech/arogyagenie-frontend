import { MapPin, Edit2, Crosshair } from 'lucide-react';
import type { Location } from '../types/healthcare';

interface Props {
  radius: number;
  location: Location;
  onUseGPS: () => void;
  isGpsLoading: boolean;
}

export function HealthcareHeader({ radius, location, onUseGPS, isGpsLoading }: Props) {
  return (
    <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div className="flex gap-3">
        <div className="mt-1 shrink-0">
          <MapPin className="w-8 h-8 text-[#5B21B6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#14152B]">Nearest Healthcare Discovery</h1>
          <p className="text-sm text-gray-500 mt-1">
            Locate verified doctors, diagnostic centers, and medicine-stocked pharmacies within {radius} km.
          </p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#5B21B6]" />
          <span className="text-sm font-medium text-gray-700">{location.name}</span>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium">
          <Edit2 className="w-4 h-4" />
          Change
        </button>
        <button 
          onClick={onUseGPS}
          disabled={isGpsLoading}
          className="flex items-center gap-2 bg-[#5B21B6] text-white px-5 py-2 rounded-full shadow-sm hover:bg-[#4c1d95] transition-colors text-sm font-medium disabled:opacity-70"
        >
          <Crosshair className="w-4 h-4" />
          {isGpsLoading ? 'Locating...' : 'Use GPS'}
        </button>
      </div>
    </header>
  );
}