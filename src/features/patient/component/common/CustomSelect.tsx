import  { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, type LucideIcon } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  icon?: LucideIcon;
  className?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder = "Select...", className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full h-full ${className}`} ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full bg-slate-50 border rounded-xl px-2.5 md:px-3 flex items-center justify-between text-xs transition-all focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 cursor-pointer ${
          isOpen 
            ? 'border-[#5B21B6] shadow-2xs ring-2 ring-[#5B21B6]/20 bg-white' 
            : 'border-slate-200 hover:border-[#5B21B6]/40 hover:bg-white'
        }`}
      >
        <span className={`block truncate text-left text-xs ${value && value !== placeholder ? 'text-[#13102F] font-bold' : 'text-slate-500 font-medium'}`}>
          {value || placeholder}
        </span>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ml-1 ${isOpen ? 'rotate-180 text-[#5B21B6]' : ''}`} 
        />
      </button>

      {/* Dropdown Menu (Internal Content) */}
      {isOpen && (
        <div className="absolute z-50 w-full min-w-40 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <ul className="max-h-56 overflow-y-auto py-1 custom-scrollbar">
            {options.map((option, index) => {
              const isSelected = value === option || (!value && option === placeholder);
              
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-purple-50 text-[#5B21B6] font-bold' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-[#5B21B6]'
                    }`}
                  >
                    <span className="truncate pr-2">{option}</span>
                    
                    {/* Checkmark for selected item */}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#5B21B6] shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}