import React from 'react';
import { Search } from 'lucide-react';

interface CareSearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export const CareSearchBar: React.FC<CareSearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search size={20} className="text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search doctor, specialty, hospital..."
        className="w-full h-12 pl-11 pr-4 bg-white border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/30 focus:border-[#6D28D9] shadow-sm transition-all"
        aria-label="Search doctors"
      />
    </div>
  );
};