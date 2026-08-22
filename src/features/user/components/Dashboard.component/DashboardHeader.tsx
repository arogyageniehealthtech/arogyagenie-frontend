import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAppSelector } from '../../../../store/hooks';

export const DashboardHeader: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  
  
  // const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  
  const menuContainerRef = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuContainerRef.current && 
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        // setIsNotificationsOpen(false);
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    // setIsNotificationsOpen((prev) => !prev);
    setIsProfileOpen(false); 
  };

  const toggleProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProfileOpen((prev) => !prev);
    console.log("sklmd")
    // setIsNotificationsOpen(false); 
  };

  return (
    <div className=" justify-between hidden lg:flex items-center py-2 relative z-30">
      {/* Brand Section */}
      <div className="flex items-center gap-3">
        <img 
          src="\LOGO.png" 
          alt="ArogyaGenie Logo" 
          className="h-10 w-10 object-contain" 
        />
        <div>
          <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">ArogyaGenie</h1>
          <p className="text-[11px] text-slate-500 font-medium">Your Health, Our Priority</p>
        </div>
      </div>

   
      <div className="flex items-center gap-3 relative" ref={menuContainerRef}>
        
       
        <button 
          onClick={toggleNotifications}
          className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
          type="button"
        >
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative">
         
          <button 
            onClick={toggleProfile}
            className="focus:outline-none rounded-full block"
            type="button"
          >
            <img 
              src={user?.profilePicture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"} 
              alt="User Profile" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm hover:ring-2 hover:ring-slate-200 transition-all cursor-pointer"
            />
            
           
          </button>

         
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50 transform opacity-100 scale-100 transition-all duration-200">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-slate-100 mb-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {/* {user?.name || */
                   "Guest User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || "guest@arogyagenie.com"}
                </p>
              </div>
              
           
              <button 
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2 transition-colors"
                onClick={() => {
                  console.log("Navigate to Profile");
                  setIsProfileOpen(false); // Close menu after clicking
                }}
              >
                <User size={16} />
                My Profile
              </button>
              
              
              <button 
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors mt-1"
                onClick={() => {
                  console.log("Trigger Logout");
                  setIsProfileOpen(false);
                }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};