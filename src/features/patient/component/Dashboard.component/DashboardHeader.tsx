import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';
import { useAppSelector } from '../../../../store/hooks';
import { useAuth } from '../../../../features/auth/hooks/useAuth';
import { ROUTES } from '../../../../constants/routes.constants';

const getInitials = (name?: string) => {
  if (!name) return 'GU';
  const words = name.trim().split(/\s+/);
  return words.length >= 2
    ? (words[0][0] + words[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

export const DashboardHeader: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0]
    : 'Guest User';

  return (
    <header className="flex items-center justify-between py-2 sm:py-2.5 w-full relative z-30">
      {/* Brand Section */}
      <div 
        onClick={() => navigate(ROUTES.PATIENT.DASHBOARD)}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer min-w-0"
      >
        <img 
          src="/LOGO.png" 
          alt="ArogyaGenie Logo" 
          className="h-7 w-7 sm:h-8 sm:w-8 object-contain shrink-0" 
        />
        <div className="min-w-0 leading-none">
          <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">
            ArogyaGenie
          </h1>
          <p className="text-[10px] text-slate-400 font-medium hidden sm:block truncate mt-0.5">
            Your Health, Our Priority
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 relative shrink-0" ref={menuContainerRef}>
        {/* Notifications Quick-Link */}
        <button 
          onClick={() => navigate('/patient/notifications')}
          className="relative p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
          type="button"
          title="Notifications"
        >
          <Bell size={18} className="sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Profile Avatar & Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="focus:outline-none rounded-full block active:scale-95 transition-transform"
            type="button"
            title="Account Menu"
          >
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-slate-200 hover:ring-indigo-400 transition-all cursor-pointer"
              />
            ) : (
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-xs transition-colors cursor-pointer">
                {getInitials(fullName)}
              </div>
            )}
          </button>

          {/* Compact Profile Popover */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 text-left animate-in fade-in duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {fullName}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {user?.email || 'guest@arogyagenie.com'}
                </p>
              </div>

              <div className="py-1">
                <button 
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate(ROUTES.PATIENT.PROFILE);
                  }}
                >
                  <User size={14} className="text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button 
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                  }}
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};