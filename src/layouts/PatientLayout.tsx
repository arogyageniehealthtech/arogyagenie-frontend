import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'; // Updated to react-router-dom
import { 
  Home, 
  Stethoscope, 
  Building2, 
  Pill, 
  Phone, 
  User,
  LogOut, 
} from 'lucide-react';
import { ROUTES } from '../constants/routes.constants';
import { useAppSelector } from '../store/hooks';

export default function PatientLayout() {
  const { user } = useAppSelector((state) => state.auth);
  
  // Hooks for routing
  const location = useLocation();
  const navigate = useNavigate();
  
  // Keep this so the navbar hides when the user clicks the AI Chat Floating Action Button!
  const isAiChatPage = location.pathname === ROUTES.PATIENT.AI_CHAT;

  // State and Ref for Profile Dropdown
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside to close the dropdown
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileOpen((prev) => !prev);
  };

  // Nav items pointing to your integrated routes
  const navItems = [
    { icon: Home, label: "Home", to: ROUTES.PATIENT.DASHBOARD },
    { icon: Stethoscope, label: "Doctor", to: ROUTES.PATIENT.CARE },
    { icon: Building2, label: "Hospital", to: ROUTES.PATIENT.ALLHOSPITAL }, // Updated to new Hospital route
    { icon: Pill, label: "Medicine", to: ROUTES.PATIENT.MEDICINE_DELIVERY },
    { icon: Phone, label: "Ambulance", to: ROUTES.PATIENT.AMBULANCE },
  ];

  // Utility to check if a route is active (handles nested /hospitals/... routes)
  const isRouteActive = (itemTo: string) => {
    if (itemTo === ROUTES.PATIENT.DASHBOARD) {
      return location.pathname === itemTo;
    }
    return location.pathname.startsWith(itemTo);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* DESKTOP NAVIGATION */}
      {!isAiChatPage && (
        <nav className="sticky top-0 z-50 hidden h-20 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur-md lg:flex shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/LOGO.png" alt="ArogyaGenie Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-xl font-bold text-slate-900">ArogyaGenie</h1>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = isRouteActive(item.to);
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-[14px] px-4 py-2.5 text-sm font-semibold transition-all ${
                    isActive 
                      ? item.label === "Ambulance" 
                        ? 'bg-red-50 text-red-600'
                        : 'bg-indigo-50 text-[#4F46E5]' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={18} strokeWidth={2} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>

          {/* Profile Dropdown Section */}
          <div className="flex items-center gap-5" ref={menuContainerRef}>
            <div className="relative">
              {/* Trigger Button */}
              <button 
                onClick={toggleProfile}
                className="focus:outline-none rounded-full block"
                type="button"
              >
                <img 
                  src={user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"} 
                  alt="Profile" 
                  className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer" 
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 transform opacity-100 scale-100 transition-all duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-slate-100 mb-1 bg-slate-50/50 rounded-t-xl mt(-2)">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {
                      // user?.name ||
                       "Guest User"
                       }
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {
                      // user?.email || 
                      "guest@arogyagenie.com"
                      }
                    </p>
                  </div>
                  
                  {/* Navigation to Profile Page */}
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2.5 transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false); 
                      navigate(ROUTES.PATIENT.PROFILE); 
                    }}
                  >
                    <User size={18} />
                    My Profile
                  </button>
                  
                  {/* Logout Button */}
                  <button 
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Add your logout logic here later
                    }}
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* MOBILE NAVIGATION */}
      {!isAiChatPage && (
        <nav className="fixed bottom-0 left-0 z-50 flex h-20 w-full items-center justify-around rounded-t-3xl border-t border-slate-100 bg-white pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] lg:hidden">
          {navItems.map((item) => {
            const isActive = isRouteActive(item.to);
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`flex w-16 flex-col items-center justify-center gap-1.5 transition-colors ${
                  isActive 
                    ? item.label === "Ambulance" ? 'text-red-600' : 'text-[#4F46E5]' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <item.icon size={22} className={isActive ? "animate-pulse-once" : ""} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      )}

      {/* MAIN CONTENT AREA */}
      <main className={`relative mx-auto w-full ${isAiChatPage ? 'h-screen' : 'max-w-7xl pb-24 lg:pb-8 lg:pt-6'}`}>
        <Outlet />
      </main>
    </div>
  );
}