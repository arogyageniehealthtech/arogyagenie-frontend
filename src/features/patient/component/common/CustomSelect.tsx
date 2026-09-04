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

export default function CustomSelect({ value, onChange, options, placeholder = "Select..." }: CustomSelectProps) {
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
    <div className="relative w-full h-full" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-full min-h-11 bg-white/70 border rounded-xl px-2.5 md:px-4 flex items-center justify-between text-xs md:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#5B21B6]/20 ${
          isOpen 
            ? 'border-[#5B21B6] shadow-sm ring-2 ring-[#5B21B6]/20' 
            : 'border-gray-200 hover:border-[#5B21B6]/40'
        }`}
      >
        <span className={`block truncate ${value && value !== placeholder ? 'text-[#13102F] font-semibold' : 'text-gray-500'}`}>
          {value || placeholder}
        </span>
        <ChevronDown 
          className={`w-3 h-3 md:w-4 md:h-4 text-gray-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#5B21B6]' : ''}`} 
        />
      </button>

      {/* Dropdown Menu (Internal Content) */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-60 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {options.map((option, index) => {
              const isSelected = value === option || (!value && option === placeholder);
              
              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-3 py-2.5 md:px-4 md:py-3 text-xs md:text-sm flex items-center justify-between transition-colors ${
                      isSelected 
                        ? 'bg-[#5B21B6]/10 text-[#5B21B6] font-semibold' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-[#13102F]'
                    }`}
                  >
                    <span className="truncate pr-2">{option}</span>
                    
                    {/* Checkmark for selected item */}
                    {isSelected && (
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-[#5B21B6] shrink-0" />
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