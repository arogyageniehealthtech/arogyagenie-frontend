import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface LocationSelectorProps {
  location: string;
  onChange: (loc: string) => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({ location, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const locations = ["New York, USA", "Los Angeles, USA", "Chicago, USA", "Mumbai, India", "Delhi, India"];

  return (
    <div className="relative z-20 w-full md:w-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-transparent rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        aria-label="Select location"
      >
        <MapPin size={18} className="text-slate-500" />
        <span className="text-sm font-semibold text-slate-800">{location}</span>
        <ChevronDown size={16} className="text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-4 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2">
          {locations.map((loc) => (
            <button
              key={loc}
              onClick={() => { onChange(loc); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${location === loc ? 'text-[#6D28D9] font-medium bg-purple-50' : 'text-slate-600'}`}
            >
              {loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};