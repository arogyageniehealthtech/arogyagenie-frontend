import React from 'react';
import { Filter } from 'lucide-react';

interface SpecialtyFiltersProps {
  selected: string;
  onChange: (specialty: string) => void;
}

export const SpecialtyFilters: React.FC<SpecialtyFiltersProps> = ({ selected, onChange }) => {
  const specialties = ["All", "Cardiologist", "Dermatologist", "Neurologist", "General Physician"];

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 overflow-x-auto scrollbar-hide flex gap-2 pb-1">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => onChange(spec)}
            className={`whitespace-nowrap px-5 py-2 text-sm font-medium rounded-full transition-all border ${
              selected === spec
                ? 'bg-linear-to-r from-[#6D28D9] to-[#7C3AED] text-white border-transparent shadow-[0_4px_12px_rgba(109,40,217,0.25)]'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>
      <button 
        className="shrink-0 w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
        aria-label="More filters"
      >
        <Filter size={18} />
      </button>
    </div>
  );
};