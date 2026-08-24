// src/features/dashboard/components/BottomNavigation.tsx
import React from 'react';
import { Home, Stethoscope, Heart, Activity, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const navItems = [
    { icon: <Home size={22} />, label: "Home", active: true },
    { icon: <Stethoscope size={22} />, label: "AI Health", active: false },
    { icon: <Heart size={22} />, label: "Care", active: false },
    { icon: <Activity size={22} />, label: "Health", active: false },
    { icon: <User size={22} />, label: "Profile", active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full lg:w-24 lg:h-screen lg:top-0 bg-white border-t lg:border-t-0 lg:border-r border-slate-100 flex lg:flex-col justify-around lg:justify-center items-center pb-safe pt-2 lg:pt-0 lg:gap-10 px-2 lg:px-0 z-50 rounded-t-3xl lg:rounded-none shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] lg:shadow-none h-20">
      {navItems.map((item, index) => (
        <button 
          key={index} 
          className={`flex flex-col items-center justify-center gap-1.5 w-16 lg:w-full transition-colors ${
            item.active ? 'text-[#4F46E5]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`${item.active ? 'opacity-100' : 'opacity-80'}`}>
            {React.cloneElement(item.icon, { 
              strokeWidth: item.active ? 2.5 : 2,
              className: item.active ? 'drop-shadow-sm' : ''
            })}
          </div>
          <span className={`text-[10px] ${item.active ? 'font-bold' : 'font-medium'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};