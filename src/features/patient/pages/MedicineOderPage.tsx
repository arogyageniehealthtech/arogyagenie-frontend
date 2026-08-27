import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Stethoscope, 
  Building2, 
  Microscope, 
  User,
  LogOut,
  Bot,
  Menu, 
  X,
  Bell,
  FileText,
  ClipboardList,
  ShoppingBag,
  Calendar,
  Ambulance,
  Pill,
  CheckCheck,
  Trash2,
  Pill as PillIcon,
  AlertCircle,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { ROUTES } from '../../../constants/routes.constants';
import { useAppSelector } from '../../../store/hooks';
import { useAuth } from '../../../features/auth/hooks/useAuth';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'appointments' | 'orders' | 'reports' | 'alerts';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Appointment Confirmed',
    message: 'Your upcoming consultation with Dr. Arup Kumar is confirmed for tomorrow.',
    timestamp: '10m ago',
    category: 'appointments',
    read: false,
  },
  {
    id: 'n2',
    title: 'Medicine Request Accepted',
    message: 'Apollo Pharmacy accepted your order and is preparing it for dispatch.',
    timestamp: '1h ago',
    category: 'orders',
    read: false,
  },
  {
    id: 'n3',
    title: 'Lab Report Ready',
    message: 'Your CBC lab report from City Diagnostics is now available.',
    timestamp: 'Yesterday',
    category: 'reports',
    read: true,
  },
];

// Helper to generate initials from a name
const getInitials = (name?: string) => {
  if (!name) return "GU"; 
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

// Helper for notification icons and colors
const getNotificationStyles = (category: string) => {
  switch(category) {
    case 'appointments': return { icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600' };
    case 'orders': return { icon: PillIcon, bg: 'bg-emerald-50', text: 'text-emerald-600' };
    case 'reports': return { icon: Microscope, bg: 'bg-purple-50', text: 'text-purple-600' };
    default: return { icon: AlertCircle, bg: 'bg-orange-50', text: 'text-orange-600' };
  }
};

// --- HELPER: Dynamically get the page title based on the route ---
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

export default function PatientLayout() {
  const { user } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();

  // Hooks for routing
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navigation on AI Chat page
  const isAiChatPage = location.pathname === ROUTES.PATIENT.ASSISTANT;

  // States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  // State to manage expanding/collapsing the Medicine sub-menu in sidebar
  const [isMedicineOpen, setIsMedicineOpen] = useState(
    location.pathname.includes('medicine') || location.pathname.includes('medicine-orders')
  );

  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
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
    if (itemTo === ROUTES.PATIENT.DASHBOARD) {
      return location.pathname === itemTo;
    }
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans relative flex">

      {/* --- LEFT SIDEBAR --- */}
      {!isAiChatPage && (
        <>
          {/* Mobile Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          <aside 
            className={`fixed top-0 left-0 z-[70] h-full w-64 bg-[#13102F] shadow-xl border-r border-[#1e1a45] transform transition-transform duration-300 ease-in-out flex flex-col ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Sidebar Header (Logo) */}
            <div className="flex items-center justify-between px-5 h-20 border-b border-[#1e1a45] shrink-0">
              <div className="flex items-center gap-2.5">
                <img src="/LOGO.png" alt="ArogyaGenie Logo" className="h-7 w-7 object-contain brightness-0 invert" />
                <div className="flex flex-col justify-center">
                  <h1 className="lg:text-xl font-extrabold text-white leading-none tracking-wide">ArogyaGenie</h1>
                </div>
              </div>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 -mr-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sidebar Menu Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
              
              {/* Home */}
              <NavLink
                to={ROUTES.PATIENT.DASHBOARD}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.DASHBOARD) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Home size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.DASHBOARD) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.DASHBOARD) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Home</span>
              </NavLink>

              {/* Doctor */}
              <NavLink
                to={ROUTES.PATIENT.FINDDOCTOR}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.FINDDOCTOR) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Stethoscope size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.FINDDOCTOR) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.FINDDOCTOR) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Doctor</span>
              </NavLink>

              {/* Hospital */}
              <NavLink
                to={ROUTES.PATIENT.HOSPITAL}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.HOSPITAL) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Building2 size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.HOSPITAL) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.HOSPITAL) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Hospital</span>
              </NavLink>

              {/* Diagnostics */}
              <NavLink
                to={ROUTES.PATIENT.LAB}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.LAB) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Microscope size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.LAB) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.LAB) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Diagnostics</span>
              </NavLink>

              {/* --- MEDICINE ACCORDION WITH MEDICINE ORDER SUB-BRANCH --- */}
              <div>
                <button
                  onClick={() => setIsMedicineOpen(!isMedicineOpen)}
                  className={`group flex w-full items-center justify-between px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                    location.pathname.includes('medicine') || location.pathname.includes('medicine-orders')
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Pill size={18} strokeWidth={location.pathname.includes('medicine') ? 2.5 : 2} className={location.pathname.includes('medicine') ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                    <span className="truncate">Medicine</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isMedicineOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMedicineOpen && (
                  <div className="pl-9 pr-2 py-1 space-y-1">
                    {/* Pharmacy Delivery Hub Sub-item */}
                    <NavLink
                      to={ROUTES.PATIENT.MEDICINE}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                        location.pathname === ROUTES.PATIENT.MEDICINE
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      <span>Find Pharmacy</span>
                    </NavLink>

                    {/* Sub-branch: Medicine Order */}
                    <NavLink
                      to={ROUTES.PATIENT.MEDICINE_ORDERS}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.MEDICINE_ORDERS)
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                      <span>Medicine Order</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="my-4 border-t border-[#1e1a45]" />

              {/* Appointments */}
              <NavLink
                to={ROUTES.PATIENT.APPOINTMENTS}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.APPOINTMENTS) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Calendar size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.APPOINTMENTS) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.APPOINTMENTS) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Appointments</span>
              </NavLink>

              {/* Lab Reports */}
              <NavLink
                to={ROUTES.PATIENT.LAB_REPORTS}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.LAB_REPORTS) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <ClipboardList size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.LAB_REPORTS) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.LAB_REPORTS) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Lab Reports</span>
              </NavLink>

              {/* Prescriptions */}
              <NavLink
                to={ROUTES.PATIENT.PRESCRIBTION}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.PRESCRIBTION) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <FileText size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.PRESCRIBTION) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.PRESCRIBTION) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Prescriptions</span>
              </NavLink>

              {/* Ambulance */}
              <NavLink
                to={ROUTES.PATIENT.AMBULANCE}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.AMBULANCE) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Ambulance size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.AMBULANCE) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.AMBULANCE) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">Ambulance</span>
              </NavLink>

              {/* My Profile */}
              <NavLink
                to={ROUTES.PATIENT.PROFILE}
                onClick={() => setIsSidebarOpen(false)}
                className={`group flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isRouteActive(ROUTES.PATIENT.PROFILE) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <User size={18} strokeWidth={isRouteActive(ROUTES.PATIENT.PROFILE) ? 2.5 : 2} className={isRouteActive(ROUTES.PATIENT.PROFILE) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'} />
                <span className="truncate">My Profile</span>
              </NavLink>
            </div>

            {/* User Profile & Logout at Bottom */}
            <div className="p-3.5 border-t border-[#1e1a45] shrink-0">
              <div className="flex items-center gap-2.5 mb-3 px-1.5">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="h-9 w-9 rounded-full object-cover shrink-0 bg-slate-800"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full shrink-0 bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                    {getInitials(user ? `${user.firstName} ${user.lastName}` : undefined)}
                  </div>
                )}

                <div className="flex flex-col min-w-0">
                  <h2 className="text-xs font-bold text-white leading-tight truncate">
                    Hello, {user ? (user.firstName || user.email.split('@')[0]) : "Guest"}
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsSidebarOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs text-red-400 bg-transparent border border-red-900/50 hover:bg-red-500/10 hover:border-red-500/30 rounded-lg font-bold transition-all"
              >
                <LogOut size={14} strokeWidth={2.5} />
                Sign Out
              </button>
            </div>
          </aside>
        </>
      )}

      {/* --- MAIN LAYOUT WRAPPER --- */}
      <div className={`flex-1 flex flex-col min-w-0 ${!isAiChatPage ? 'lg:ml-64' : ''}`}>



        {/* MAIN CONTENT AREA */}
        <main className={`relative mx-auto w-full flex-1 ${isAiChatPage ? 'h-screen' : 'max-w-7xl p-3 lg:p-1'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}