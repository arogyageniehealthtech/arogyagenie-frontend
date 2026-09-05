import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Stethoscope, 
  Building2, 
  Microscope, 
  User,
  LogOut,
  Menu, 
  Bell,
  Pill,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { ROUTES } from '../constants/routes.constants';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import type { NotificationItem } from '../types/Notification.types';
import { INITIAL_NOTIFICATIONS } from '../data/notification.data';
import { logoutUser } from "../store/slices/authSlice";

const getInitials = (name?: string) => {
  if (!name) return "GU"; 
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getCategoryLabel = (category: string) => {
  switch(category) {
    case 'appointments': return 'Appointment';
    case 'orders': return 'Pharmacy';
    case 'reports': return 'Diagnostic';
    default: return 'Notice';
  }
};

const getPageTitle = (pathname: string) => {
  const path = pathname.toLowerCase();
  if (path.includes('doctor')) return 'Nearest Doctor Discovery';
  if (path.includes('hospital')) return 'Nearest Hospital Discovery';
  if (path.includes('lab') || path.includes('diagnostic')) return 'Nearest Diagnostics Discovery';
  if (path.includes('medicine-order')) return 'Medicines Order';
  if (path.includes('medicine')) return 'Medicine Delivery';
  if (path.includes('appointment')) return 'My Appointments';
  if (path.includes('prescription')) return 'My Prescriptions';
  if (path.includes('ambulance')) return 'Ambulance Services';
  if (path.includes('profile')) return 'My Profile';
  if (path.includes('notification')) return 'Notifications';
  if (path.includes('patient/cart_item')) return 'Cart & Fulfillment Checkout';
  return 'Patient Dashboard';
};

const getBottomNavItems = () => [
  { to: ROUTES.PATIENT.DASHBOARD, icon: Home, label: 'Home' },
  { to: ROUTES.PATIENT.FINDDOCTOR, icon: Stethoscope, label: 'Doctor' },
  { to: ROUTES.PATIENT.HOSPITAL, icon: Building2, label: 'Hospital' },
  { to: ROUTES.PATIENT.LAB, icon: Microscope, label: 'Lab' },
  { to: ROUTES.PATIENT.MEDICINE, icon: Pill, label: 'Medicine' },
];

export default function PatientLayout() {
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAiChatPage = location.pathname === ROUTES.PATIENT.ASSISTANT;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); 
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  const [isDoctorOpen, setIsDoctorOpen] = useState(
    location.pathname.includes('doctor') || location.pathname.includes('appointment') || location.pathname.includes('prescription')
  );
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(
    location.pathname.includes('lab') || location.pathname.includes('diagnostic')
  );
  const [isMedicineOpen, setIsMedicineOpen] = useState(
    location.pathname.includes('medicine') || location.pathname.includes('medicine-orders')
  );

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isRouteActive = (itemTo: string) => {
    if (itemTo === ROUTES.PATIENT.DASHBOARD) return location.pathname === itemTo;
    return location.pathname.startsWith(itemTo);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(item => item.id === id ? { ...item, read: true } : item));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(item => ({ ...item, read: true })));
  };

  const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter(item => item.id !== id));
  };

  const bottomNavItems = getBottomNavItems();

  const handleSignOut = async () => {
    setIsSidebarOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout API failed, forcing local cleanup:", error);
    } finally {
      navigate(ROUTES.AUTH.LOGIN, { replace: true });
    }
  };

  const handleProfileRedirect = () => {
    setIsSidebarOpen(false);
    navigate(ROUTES.PATIENT.PROFILE);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative flex">

      {/* --- LEFT SIDEBAR --- */}
      {!isAiChatPage && (
        <>
          <div 
            className={`fixed inset-0 z-60 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ease-in-out ${
              isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />

          <aside 
            className={`fixed top-0 left-0 z-70 h-full bg-[#13102F] shadow-2xl border-r border-[#1e1a45] transform transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) will-change-transform flex flex-col ${
              isSidebarOpen 
                ? 'translate-x-0 w-64' 
                : `-translate-x-full lg:translate-x-0 ${isSidebarCollapsed ? 'lg:w-[72px]' : 'w-64'}`
            }`}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-start'} px-3 sm:px-5 h-14 sm:h-20 border-b border-[#1e1a45] shrink-0`}>
              <div className="flex items-center gap-2 min-w-0">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0 ${isSidebarCollapsed ? '' : '-ml-2'}`}
                  title="Toggle Sidebar"
                >
                  <Menu size={20} />
                </button>
                
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                  title="Close sidebar"
                >
                  <Menu size={20} />
                </button>

                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-2 min-w-0">
                    <img src="/LOGO.png" alt="ArogyaGenie Logo" className="h-6 sm:h-7 w-6 sm:w-7 object-contain brightness-0 invert" />
                    <div className="flex flex-col justify-center min-w-0">
                      <h1 className="text-base sm:text-xl font-extrabold text-white leading-none tracking-wide truncate">ArogyaGenie</h1>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-3 py-3 sm:py-4 space-y-0.5 sm:space-y-1">
              <NavLink
                to={ROUTES.PATIENT.DASHBOARD}
                onClick={() => setIsSidebarOpen(false)}
                className={`group w-full transition-all font-semibold flex ${
                  isSidebarCollapsed
                    ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                    : 'items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                } ${
                  isRouteActive(ROUTES.PATIENT.DASHBOARD) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Home size={isSidebarCollapsed ? 22 : 16} strokeWidth={isRouteActive(ROUTES.PATIENT.DASHBOARD) ? 2.5 : 2} className={`shrink-0 ${isRouteActive(ROUTES.PATIENT.DASHBOARD) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className={isSidebarCollapsed ? 'truncate w-full text-center' : 'truncate'}>Home</span>
              </NavLink>

              <div>
                <button
                  onClick={() => {
                    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                    else setIsDoctorOpen(!isDoctorOpen);
                  }}
                  className={`group w-full transition-all font-semibold flex ${
                    isSidebarCollapsed
                      ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                      : 'items-center justify-between px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                  } ${
                    location.pathname.includes('doctor') || location.pathname.includes('appointment') || location.pathname.includes('prescription')
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isSidebarCollapsed ? (
                    <>
                      <Stethoscope size={22} strokeWidth={location.pathname.includes('doctor') ? 2.5 : 2} className={`shrink-0 ${location.pathname.includes('doctor') ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span className="truncate w-full text-center">Doctor</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Stethoscope size={16} strokeWidth={location.pathname.includes('doctor') ? 2.5 : 2} className={`shrink-0 ${location.pathname.includes('doctor') ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                        <span className="truncate">Doctor</span>
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${isDoctorOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {!isSidebarCollapsed && isDoctorOpen && (
                  <div className="pl-6 sm:pl-9 pr-1 sm:pr-2 py-1 space-y-0.5 sm:space-y-1">
                    <NavLink
                      to={ROUTES.PATIENT.FINDDOCTOR}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        location.pathname === ROUTES.PATIENT.FINDDOCTOR ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Find Doctor</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.APPOINTMENTS}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.APPOINTMENTS) ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Appointments</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.PRESCRIBTION}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.PRESCRIBTION) ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Prescriptions</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <NavLink
                to={ROUTES.PATIENT.HOSPITAL}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full transition-all font-semibold ${
                  isSidebarCollapsed
                    ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                    : 'items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                } ${
                  isRouteActive(ROUTES.PATIENT.HOSPITAL) ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Building2 size={isSidebarCollapsed ? 22 : 16} strokeWidth={isRouteActive(ROUTES.PATIENT.HOSPITAL) ? 2.5 : 2} className={`shrink-0 ${location.pathname.startsWith(ROUTES.PATIENT.HOSPITAL) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className={isSidebarCollapsed ? 'truncate w-full text-center' : 'truncate'}>Hospital</span>
              </NavLink>

              <div>
                <button
                  onClick={() => {
                    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                    else setIsDiagnosticsOpen(!isDiagnosticsOpen);
                  }}
                  className={`group w-full transition-all font-semibold flex ${
                    isSidebarCollapsed
                      ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                      : 'items-center justify-between px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                  } ${
                    location.pathname.includes('lab') || location.pathname.includes('diagnostic') ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isSidebarCollapsed ? (
                    <>
                      <Microscope size={22} strokeWidth={location.pathname.includes('lab') ? 2.5 : 2} className={`shrink-0 ${location.pathname.includes('lab') ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span className="truncate w-full text-center">Diagnostics</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Microscope size={16} strokeWidth={location.pathname.includes('lab') ? 2.5 : 2} className={`shrink-0 ${location.pathname.includes('lab') ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                        <span className="truncate">Diagnostics</span>
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${isDiagnosticsOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {!isSidebarCollapsed && isDiagnosticsOpen && (
                  <div className="pl-6 sm:pl-9 pr-1 sm:pr-2 py-1 space-y-0.5 sm:space-y-1">
                    <NavLink
                      to={ROUTES.PATIENT.LAB}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        location.pathname === ROUTES.PATIENT.LAB ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Find Diagnostics</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.LAB_REPORTS}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.LAB_REPORTS) ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Lab Report</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => {
                    if (isSidebarCollapsed) setIsSidebarCollapsed(false);
                    else setIsMedicineOpen(!isMedicineOpen);
                  }}
                  className={`group w-full transition-all font-semibold flex ${
                    isSidebarCollapsed
                      ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                      : 'items-center justify-between px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                  } ${
                    location.pathname.includes('medicine') || location.pathname.includes('medicine-orders') ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isSidebarCollapsed ? (
                    <>
                      <Pill size={22} strokeWidth={location.pathname.includes('medicine') ? 2.5 : 2} className={`shrink-0 ${location.pathname.includes('medicine') ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                      <span className="truncate w-full text-center">Medicine</span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <Pill size={16} strokeWidth={location.pathname.includes('medicine') ? 2.5 : 2} className={`shrink-0 ${location.pathname.includes('medicine') ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                        <span className="truncate">Medicine</span>
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-200 shrink-0 ${isMedicineOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>

                {!isSidebarCollapsed && isMedicineOpen && (
                  <div className="pl-6 sm:pl-9 pr-1 sm:pr-2 py-1 space-y-0.5 sm:space-y-1">
                    <NavLink
                      to={ROUTES.PATIENT.MEDICINE}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        location.pathname === ROUTES.PATIENT.MEDICINE ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Find Pharmacy</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.MEDICINE_ORDERS}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.MEDICINE_ORDERS) ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Medicine Order</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="sm:hidden pt-1">
                <div className="my-2 border-t border-[#1e1a45]" />
                <NavLink
                  to={ROUTES.PATIENT.PROFILE}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`group w-full transition-all font-semibold flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs ${
                    isRouteActive(ROUTES.PATIENT.PROFILE) ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <User size={16} strokeWidth={isRouteActive(ROUTES.PATIENT.PROFILE) ? 2.5 : 2} className={`shrink-0 ${isRouteActive(ROUTES.PATIENT.PROFILE) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                  <span className="truncate">My Profile</span>
                </NavLink>
              </div>
            </div>

            <div className={`p-2 sm:p-3.5 border-t border-[#1e1a45] shrink-0 ${isSidebarCollapsed ? 'flex flex-col items-center gap-3' : ''}`}>
              {isSidebarCollapsed ? (
                <>
                  <button 
                    onClick={handleProfileRedirect}
                    className="focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full transition-transform active:scale-95"
                    title="View Profile"
                  >
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover shrink-0 bg-slate-800 ring-1 ring-white/20 hover:ring-indigo-400 transition-all" />
                    ) : (
                      <div className="h-8 w-8 rounded-full shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-inner transition-colors">
                        {getInitials(user ? `${user.firstName} ${user.lastName}` : undefined)}
                      </div>
                    )}
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="p-2 w-full text-white bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-500/40 rounded-lg flex justify-center transition-all shadow-sm shadow-red-950/40"
                    title="Sign Out"
                  >
                    <LogOut size={16} strokeWidth={2.5} />
                  </button>
                </>
              ) : (
                <>
                  <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3 px-1">
                    <button 
                      onClick={handleProfileRedirect}
                      className="cursor-pointer focus:outline-none rounded-full transition-transform active:scale-95 group/user"
                      title="View Profile"
                    >
                      {user?.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-7 sm:h-9 w-7 sm:w-9 rounded-full object-cover shrink-0 bg-slate-800 ring-1 ring-white/20 group-hover/user:ring-indigo-400 transition-all" />
                      ) : (
                        <div className="h-7 sm:h-9 w-7 sm:w-9 rounded-full shrink-0 bg-indigo-500 group-hover/user:bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-inner transition-colors">
                          {getInitials(user ? `${user.firstName} ${user.lastName}` : undefined)}
                        </div>
                      )}
                    </button>

                    <div onClick={handleProfileRedirect} className="flex flex-col min-w-0 cursor-pointer group/name">
                      <h2 className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate group-hover/name:text-indigo-300 transition-colors">
                        Hi, {user ? (user.firstName || user.email.split('@')[0]) : "Guest"}
                      </h2>
                      <span className="text-[9px] text-slate-400 group-hover/name:text-slate-300">View Profile</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 text-xs text-white bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-500/40 rounded-lg font-bold transition-all shadow-sm shadow-red-950/40"
                  >
                    <LogOut size={14} strokeWidth={2.5} />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* --- MAIN LAYOUT WRAPPER --- */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isAiChatPage ? (isSidebarCollapsed ? 'lg:ml-18' : 'lg:ml-64') : ''}`}>

        {/* --- TOP NAVIGATION BAR --- */}
        {!isAiChatPage && (
          <header className="sticky top-0 z-50 flex h-14 sm:h-16 lg:h-20 w-full items-center justify-between border-b border-[#1e1a45] lg:border-slate-200 bg-[#13102F] lg:bg-white/90 px-3 sm:px-4 lg:px-8 backdrop-blur-md shadow-sm gap-3">

            {/* Left Side: Mobile Menu Button + Brand */}
            <div className="flex items-center gap-2 sm:gap-3 z-10 min-w-0">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                title="Open navigation menu"
              >
                <Menu size={20} />
              </button>

              <div className={`${isSidebarCollapsed ? 'flex' : 'flex lg:hidden'} items-center gap-2 min-w-0`}>
                <NavLink to={ROUTES.PATIENT.DASHBOARD} className="flex items-center gap-2 min-w-0">
                  <img src="/LOGO.png" alt="ArogyaGenie Logo" className="h-6 sm:h-7 lg:h-8 w-6 sm:w-7 lg:w-8 object-contain brightness-0 invert lg:brightness-100 lg:invert-0" />
                  <span className="text-base sm:text-lg lg:text-xl font-extrabold text-white lg:text-[#13102F] leading-none tracking-wide truncate">
                    ArogyaGenie
                  </span>
                </NavLink>
              </div>
            </div>

            {/* Center: Title & Location */}
            <div className={`hidden lg:flex flex-col items-start justify-center gap-0.5 min-w-0 mr-auto ${isSidebarCollapsed ? 'pl-6 border-l border-slate-200' : 'pl-0'}`}>
              <h2 className="text-2xl lg:text-3xl text-blue-800 font-bold tracking-tight leading-none truncate">
                {getPageTitle(location.pathname)}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium pl-0.5">
                <MapPin size={14} className="text-indigo-600 shrink-0" />
                <span className="leading-tight">Khardaha, WB</span>
              </div>
            </div>

            {/* Right Side: Bell & Profile */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0 z-10">
              
              {/* --- PROPERLY ALIGNED NOTIFICATION DROPDOWN --- */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative p-2 rounded-xl sm:rounded-full transition-all duration-200 min-h-10 min-w-10 sm:min-h-11 sm:min-w-11 flex items-center justify-center shrink-0 ${
                    isNotificationOpen 
                      ? 'bg-indigo-500/20 text-indigo-300 ring-2 ring-indigo-500/40 lg:bg-indigo-50 lg:text-indigo-600 lg:ring-indigo-200' 
                      : 'text-slate-300 hover:bg-white/10 lg:text-slate-600 lg:hover:bg-slate-100'
                  }`}
                  title="Notifications"
                >
                  <Bell size={18} strokeWidth={2.2} className={isNotificationOpen ? 'fill-indigo-400/20 lg:fill-indigo-100' : ''} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 ring-2 ring-[#13102F] lg:ring-white"></span>
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <>
                    <div 
                      className="fixed inset-0 bg-slate-950/20 sm:hidden z-40" 
                      onClick={() => setIsNotificationOpen(false)}
                    />

                    {/* Perfectly anchored & aligned dropdown */}
                    <div className="absolute -right-8 sm:right-0 top-full mt-2 w-72 sm:w-80 max-w-[calc(100vw-1.5rem)] bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden text-left flex flex-col max-h-[50vh] sm:max-h-[340px] animate-in fade-in duration-100">
                      
                      {/* Centered & Slightly Enlarged Notification Header */}
                      <div className="bg-[#13102F] px-3 py-2.5 shrink-0 flex items-center justify-center border-b border-[#1e1a45]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-white tracking-wide">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white leading-none">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Notification Items - Properly Top-Aligned */}
                      <div className="overflow-y-auto custom-scrollbar divide-y divide-slate-100 bg-white">
                        {notifications.length === 0 ? (
                          <div className="py-6 px-4 text-center">
                            <p className="text-slate-600 text-xs font-medium">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div 
                              key={item.id}
                              onClick={() => handleMarkAsRead(item.id)}
                              className={`group relative py-2 px-3 flex items-start justify-between gap-2.5 cursor-pointer transition-colors ${
                                item.read ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/90 hover:bg-slate-100/80'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                                    {getCategoryLabel(item.category)}
                                  </span>
                                  <span className="text-[9px] text-slate-400 shrink-0">{item.timestamp}</span>
                                </div>

                                <h4 className={`text-[11px] leading-snug truncate ${item.read ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>
                                  {item.title}
                                </h4>

                                <p className="text-[10px] text-slate-500 leading-snug truncate mt-0.5">
                                  {item.message}
                                </p>
                              </div>

                              <div className="flex flex-col items-end justify-between self-stretch shrink-0 py-0.5">
                                {!item.read ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />
                                ) : (
                                  <span className="h-1.5 w-1.5" />
                                )}
                                <button 
                                  onClick={(e) => handleDeleteNotification(item.id, e)}
                                  className="text-[9px] text-slate-400 hover:text-rose-600 p-0.5 rounded transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
                                  title="Delete"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0 text-[10px] text-slate-600">
                        {unreadCount > 0 ? (
                          <button 
                            onClick={handleMarkAllAsRead}
                            className="font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                          >
                            Mark all read
                          </button>
                        ) : (
                          <span className="text-slate-400">All read</span>
                        )}

                        <button 
                          onClick={() => {
                            setIsNotificationOpen(false);
                            navigate('/patient/notifications');
                          }}
                          className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                          View all →
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile Profile Image */}
              <button 
                onClick={() => navigate(ROUTES.PATIENT.PROFILE)}
                className="lg:hidden flex items-center cursor-pointer rounded-full active:scale-95 transition-transform"
                title="View Profile"
              >
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="h-8 w-8 rounded-full object-cover shrink-0 ring-2 ring-indigo-400/40 bg-slate-800" />
                ) : (
                  <div className="h-8 w-8 rounded-full shrink-0 bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    {getInitials(user ? `${user.firstName} ${user.lastName}` : undefined)}
                  </div>
                )}
              </button>
            </div>
          </header>
        )}

        {/* MAIN CONTENT AREA */}
        <main className={`relative mx-auto w-full flex-1 ${isAiChatPage ? 'h-screen' : 'max-w-7xl p-2 sm:p-3 lg:p-4 pb-20 sm:pb-3 lg:pb-4'}`}>
          <Outlet />
        </main>
      </div>

      {/* --- MOBILE-ONLY BOTTOM TAB BAR --- */}
      {!isAiChatPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-80 sm:hidden bg-[#13102F] border-t border-[#1e1a45] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.35)]">
          <div className="flex items-stretch justify-between px-1">
            {bottomNavItems.map((item) => {
              const active = isRouteActive(item.to);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0"
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} className={`shrink-0 ${active ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`text-[9px] font-semibold truncate max-w-full ${active ? 'text-indigo-400' : 'text-slate-400'}`}>
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}