// import React, { useState, useRef, useEffect } from 'react';
// import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
// import { 
//   Home, 
//   Stethoscope, 
//   Building2, 
//   Microscope, 
//   User,
//   LogOut,
//   Menu, 
//   X,
//   Bell,
//   Calendar,
//   Ambulance,
//   Pill,
//   CheckCheck,
//   Trash2,
//   Pill as PillIcon,
//   AlertCircle,
//   MapPin
// } from 'lucide-react';
// import { ROUTES } from '../constants/routes.constants';
// import { useAppSelector, useAppDispatch } from '../store/hooks';
// import type { NotificationItem } from '../types/Notification.types';
// import { INITIAL_NOTIFICATIONS } from '../data/notification.data';
// import { logoutUser } from "../store/slices/authSlice";

// const getInitials = (name?: string) => {
//   if (!name) return "GU"; 
//   const words = name.trim().split(/\s+/);
//   if (words.length >= 2) {
//     return (words[0][0] + words[1][0]).toUpperCase();
//   }
//   return name.slice(0, 2).toUpperCase();
// };

// const getNotificationStyles = (category: string) => {
//   switch(category) {
//     case 'appointments': return { icon: Calendar, bg: 'bg-indigo-50', text: 'text-[#13102F]' };
//     case 'orders': return { icon: PillIcon, bg: 'bg-indigo-50', text: 'text-[#13102F]' };
//     case 'reports': return { icon: Microscope, bg: 'bg-indigo-50', text: 'text-[#13102F]' };
//     default: return { icon: AlertCircle, bg: 'bg-indigo-50', text: 'text-[#13102F]' };
//   }
// };

// const getPageTitle = (pathname: string) => {
//   const path = pathname.toLowerCase();
  
//   if (path.includes('doctor')) return 'Nearest Doctor Discovery';
//   if (path.includes('hospital')) return 'Nearest Hospital Discovery';
//   if (path.includes('lab') || path.includes('diagnostic')) return 'Nearest Diagnostics Discovery';
//   if (path.includes('medicine-order')) return 'Medicines Order';
//   if (path.includes('medicine')) return 'Medicine Delivery';
//   if (path.includes('appointment')) return 'My Appointments';
//   if (path.includes('prescription')) return 'My Prescriptions';
//   if (path.includes('ambulance')) return 'Ambulance Services';
//   if (path.includes('profile')) return 'My Profile';
//   if (path.includes('notification')) return 'Notifications';
//   if (path.includes('patient/cart_item')) return 'Cart & Fulfillment Checkout';
  
//   return 'Patient Dashboard';
// };

// const getBottomNavItems = () => [
//   { to: ROUTES.PATIENT.DASHBOARD, icon: Home, label: 'Home' },
//   { to: ROUTES.PATIENT.FINDDOCTOR, icon: Stethoscope, label: 'Doctor' },
//   { to: ROUTES.PATIENT.HOSPITAL, icon: Building2, label: 'Hospital' },
//   { to: ROUTES.PATIENT.LAB, icon: Microscope, label: 'Lab' },
//   { to: ROUTES.PATIENT.MEDICINE, icon: Pill, label: 'Medicine' },
// ];

// export default function PatientLayout() {
//   const { user } = useAppSelector((state) => state.auth);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();

//   const isAiChatPage = location.pathname === ROUTES.PATIENT.ASSISTANT;

//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
//   const notificationRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
//         setIsNotificationOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const isRouteActive = (itemTo: string) => {
//     if (itemTo === ROUTES.PATIENT.DASHBOARD) {
//       return location.pathname === itemTo;
//     }
//     return location.pathname.startsWith(itemTo);
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const handleMarkAsRead = (id: string) => {
//     setNotifications(notifications.map(item => item.id === id ? { ...item, read: true } : item));
//   };

//   const handleMarkAllAsRead = () => {
//     setNotifications(notifications.map(item => ({ ...item, read: true })));
//   };

//   const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setNotifications(notifications.filter(item => item.id !== id));
//   };

//   const bottomNavItems = getBottomNavItems();

//   const handleSignOut = async () => {
//     setIsSidebarOpen(false);
//     try {
//       await dispatch(logoutUser()).unwrap();
//     } catch (error) {
//       console.error("Logout API failed, forcing local cleanup:", error);
//     } finally {
//       navigate(ROUTES.AUTH.LOGIN, { replace: true });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans relative flex z-0">

//       {/* --- LEFT SIDEBAR (#13102F Theme) --- */}
//       {!isAiChatPage && (
//         <>
//           {/* Mobile/Tablet Overlay */}
//           {isSidebarOpen && (
//             <div 
//               className="fixed inset-0 z-[90] bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
//               onClick={() => setIsSidebarOpen(false)}
//             />
//           )}
//           {/* Sidebar container */}
//           <aside 
//             className={`fixed top-0 left-0 z-[100] h-full bg-[#13102F] transform transition-transform duration-300 ease-in-out flex flex-col w-[60px] shadow-lg ${
//               isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//             }`}
//           >
//             {/* Sidebar Header with Logo at the Top-Left Corner */}
//             <div className="flex items-center justify-center h-14 shrink-0 border-b border-indigo-950/60 px-1">
//               <NavLink 
//                 to={ROUTES.PATIENT.DASHBOARD} 
//                 onClick={() => setIsSidebarOpen(false)}
//                 className="flex items-center justify-center group"
//                 title="ArogyaGenie Home"
//               >
//                 <img src="/LOGO.png" alt="ArogyaGenie Logo" className="h-7 w-7 object-contain shrink-0 transition-transform group-hover:scale-105" />
//               </NavLink>
//             </div>

//             {/* Sidebar Menu Items */}
//             <div className="flex-1 overflow-visible px-1 py-3 space-y-1">
              
//               {/* Home */}
//               <NavLink
//                 to={ROUTES.PATIENT.DASHBOARD}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={`group w-full transition-all duration-200 active:scale-95 font-semibold flex flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg ${
//                   isRouteActive(ROUTES.PATIENT.DASHBOARD) 
//                     ? 'text-white bg-[#1e1947] shadow-inner' 
//                     : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/40'
//                 }`}
//               >
//                 <Home size={22} strokeWidth={isRouteActive(ROUTES.PATIENT.DASHBOARD) ? 2.5 : 2} className="shrink-0" />
//                 <span className="truncate w-full text-center">Home</span>
//               </NavLink>

//               {/* DOCTOR POPUP */}
//               <div className="relative group/navitem z-[999]">
//                 <div className={`group w-full cursor-pointer transition-all duration-200 active:scale-95 font-semibold flex flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg ${
//                   location.pathname.includes('doctor') || location.pathname.includes('appointment') || location.pathname.includes('prescription')
//                     ? 'text-white bg-[#1e1947] shadow-inner' 
//                     : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/40'
//                 }`}>
//                   <Stethoscope size={22} strokeWidth={location.pathname.includes('doctor') || location.pathname.includes('appointment') || location.pathname.includes('prescription') ? 2.5 : 2} className="shrink-0" />
//                   <span className="truncate w-full text-center">Doctor</span>
//                 </div>
//                 {/* Pop-up menu */}
//                 <div className="hidden group-hover/navitem:block absolute left-full top-0 ml-2 bg-[#13102F] rounded-xl shadow-[8px_0_20px_rgba(0,0,0,0.3)] w-48 z-[9999] p-1.5 space-y-0.5 border border-indigo-950">
//                   <div className="px-2.5 py-2 mb-1 border-b border-indigo-950/60">
//                     <span className="text-xs font-bold text-white">Doctor</span>
//                   </div>
//                   <NavLink to={ROUTES.PATIENT.FINDDOCTOR} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 active:scale-95 ${location.pathname === ROUTES.PATIENT.FINDDOCTOR ? 'text-white bg-[#1e1947]' : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'}`}>
//                     <span className="truncate">Find Doctor</span>
//                   </NavLink>
//                   <NavLink to={ROUTES.PATIENT.APPOINTMENTS} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 active:scale-95 ${isRouteActive(ROUTES.PATIENT.APPOINTMENTS) ? 'text-white bg-[#1e1947]' : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'}`}>
//                     <span className="truncate">Appointments</span>
//                   </NavLink>
//                   <NavLink to={ROUTES.PATIENT.PRESCRIBTION} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 active:scale-95 ${isRouteActive(ROUTES.PATIENT.PRESCRIBTION) ? 'text-white bg-[#1e1947]' : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'}`}>
//                     <span className="truncate">Prescriptions</span>
//                   </NavLink>
//                 </div>
//               </div>

//               {/* HOSPITAL */}
//               <NavLink
//                 to={ROUTES.PATIENT.HOSPITAL}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={`group hidden sm:flex w-full transition-all duration-200 active:scale-95 font-semibold flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg ${
//                   isRouteActive(ROUTES.PATIENT.HOSPITAL) 
//                     ? 'text-white bg-[#1e1947] shadow-inner' 
//                     : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/40'
//                 }`}
//               >
//                 <Building2 size={22} strokeWidth={isRouteActive(ROUTES.PATIENT.HOSPITAL) ? 2.5 : 2} className="shrink-0" />
//                 <span className="truncate w-full text-center">Hospital</span>
//               </NavLink>

//               {/* DIAGNOSTICS POPUP */}
//               <div className="relative group/navitem z-[999]">
//                 <div className={`group w-full cursor-pointer transition-all duration-200 active:scale-95 font-semibold flex flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg ${
//                   location.pathname.includes('lab') || location.pathname.includes('diagnostic') 
//                     ? 'text-white bg-[#1e1947] shadow-inner' 
//                     : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/40'
//                 }`}>
//                   <Microscope size={22} strokeWidth={location.pathname.includes('lab') || location.pathname.includes('diagnostic') ? 2.5 : 2} className="shrink-0" />
//                   <span className="truncate w-full text-center">Diagnostics</span>
//                 </div>
//                 {/* Pop-up menu */}
//                 <div className="hidden group-hover/navitem:block absolute left-full top-0 ml-2 bg-[#13102F] rounded-xl shadow-[8px_0_20px_rgba(0,0,0,0.3)] w-48 z-[9999] p-1.5 space-y-0.5 border border-indigo-950">
//                   <div className="px-2.5 py-2 mb-1 border-b border-indigo-950/60">
//                     <span className="text-xs font-bold text-white">Diagnostics</span>
//                   </div>
//                   <NavLink to={ROUTES.PATIENT.LAB} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 active:scale-95 ${location.pathname === ROUTES.PATIENT.LAB ? 'text-white bg-[#1e1947]' : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'}`}>
//                     <span className="truncate">Find Diagnostics</span>
//                   </NavLink>
//                   <NavLink to={ROUTES.PATIENT.LAB_REPORTS} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 active:scale-95 ${isRouteActive(ROUTES.PATIENT.LAB_REPORTS) ? 'text-white bg-[#1e1947]' : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'}`}>
//                     <span className="truncate">Lab Report</span>
//                   </NavLink>
//                 </div>
//               </div>

//               {/* MEDICINE POPUP */}
//               <div className="relative group/navitem z-[999]">
//                 <div className={`group w-full cursor-pointer transition-all duration-200 active:scale-95 font-semibold flex flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg ${
//                   location.pathname.includes('medicine') || location.pathname.includes('medicine-orders')
//                     ? 'text-white bg-[#1e1947] shadow-inner' 
//                     : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/40'
//                 }`}>
//                   <Pill size={22} strokeWidth={location.pathname.includes('medicine') || location.pathname.includes('medicine-orders') ? 2.5 : 2} className="shrink-0" />
//                   <span className="truncate w-full text-center">Medicine</span>
//                 </div>
//                 {/* Pop-up menu */}
//                 <div className="hidden group-hover/navitem:block absolute left-full top-0 ml-2 bg-[#13102F] rounded-xl shadow-[8px_0_20px_rgba(0,0,0,0.3)] w-48 z-[9999] p-1.5 space-y-0.5 border border-indigo-950">
//                   <div className="px-2.5 py-2 mb-1 border-b border-indigo-950/60">
//                     <span className="text-xs font-bold text-white">Medicine</span>
//                   </div>
//                   <NavLink to={ROUTES.PATIENT.MEDICINE} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 active:scale-95 ${location.pathname === ROUTES.PATIENT.MEDICINE ? 'text-white bg-[#1e1947]' : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'}`}>
//                     <span className="truncate">Find Pharmacy</span>
//                   </NavLink>
//                   <NavLink to={ROUTES.PATIENT.MEDICINE_ORDERS} className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 active:scale-95 ${isRouteActive(ROUTES.PATIENT.MEDICINE_ORDERS) ? 'text-white bg-[#1e1947]' : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'}`}>
//                     <span className="truncate">Medicine Order</span>
//                   </NavLink>
//                 </div>
//               </div>

//               {/* Ambulance */}
//               <NavLink
//                 to={ROUTES.PATIENT.AMBULANCE}
//                 onClick={() => setIsSidebarOpen(false)}
//                 className={`group w-full transition-all duration-200 active:scale-95 font-semibold flex flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg ${
//                   isRouteActive(ROUTES.PATIENT.AMBULANCE) 
//                     ? 'text-white bg-[#1e1947] shadow-inner' 
//                     : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/40'
//                 }`}
//               >
//                 <Ambulance size={22} strokeWidth={isRouteActive(ROUTES.PATIENT.AMBULANCE) ? 2.5 : 2} className="shrink-0" />
//                 <span className="truncate w-full text-center">Ambulance</span>
//               </NavLink>
//             </div>
//           </aside>
//         </>
//       )}

//       {/* --- MAIN LAYOUT WRAPPER --- */}
//       <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isAiChatPage ? 'lg:ml-[60px]' : ''}`}>

//         {/* --- TOP NAVIGATION BAR (#13102F Theme) --- */}
//         {!isAiChatPage && (
//           <header className="sticky top-0 z-[80] flex h-14 sm:h-16 w-full items-center justify-between bg-[#13102F] pl-0 pr-2.5 sm:pr-5 lg:pr-8 gap-2 shadow-md">

//             {/* Left Side: Brand Name completely flushed to the absolute edge of the navbar */}
//             <div className="flex items-center z-10 min-w-0">
//               <NavLink to={ROUTES.PATIENT.DASHBOARD} className="flex items-center min-w-0 group pl-2 sm:pl-3 lg:pl-4">
//                 <h1 className="text-base sm:text-xl lg:text-2xl font-black tracking-tight truncate flex items-center leading-none">
//                   <span className="text-white">Arogya</span>
//                   <span className="text-indigo-400 font-extrabold italic ml-1">Genie</span>
//                 </h1>
//               </NavLink>
//             </div>

//             {/* --- NAVBAR TITLE & LOCATION BADGE --- */}
//             <div className="hidden md:flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 px-4">
//               <h2 className="text-lg lg:text-xl text-white font-bold tracking-tight leading-none truncate">
//                 {getPageTitle(location.pathname)}
//               </h2>
//               <div className="flex items-center gap-1 text-indigo-200/70 text-[11px] font-medium pl-0.5">
//                 <MapPin size={12} className="text-indigo-300 shrink-0" />
//                 <span className="leading-tight">Khardaha, WB</span>
//               </div>
//             </div>

//             {/* RIGHT SIDE: Notification Bell & User Profile */}
//             <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">

//               {/* Notification Bell */}
//               <div className="relative pointer-events-auto flex items-center" ref={notificationRef}>
//                 <button 
//                   onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                   className={`relative p-2 rounded-lg sm:rounded-full transition-all active:scale-95 h-9 sm:h-10 w-9 sm:w-10 flex items-center justify-center shrink-0 ${
//                     isNotificationOpen 
//                       ? 'text-white bg-[#1e1947]' 
//                       : 'text-indigo-200/70 hover:text-white hover:bg-[#1e1947]/50'
//                   }`}
//                   title="Notifications"
//                 >
//                   <Bell size={18} strokeWidth={2} className={isNotificationOpen ? 'fill-indigo-200/50' : ''} />
//                   {unreadCount > 0 && (
//                     <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-[#13102F] shrink-0"></span>
//                   )}
//                 </button>

//                 {/* --- NOTIFICATION DROPDOWN --- */}
//                 {isNotificationOpen && (
//                   <div className="absolute right-0 mt-2 sm:mt-4 top-full w-screen sm:w-85 md:w-105 bg-white rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 origin-top-right text-left max-h-[70vh] sm:max-h-none flex flex-col mx-2 sm:mx-0">
//                     {/* Header */}
//                     <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between bg-white z-10 relative shadow-[0_1px_0_0_rgba(0,0,0,0.03)] shrink-0">
//                       <h3 className="text-base sm:text-[17px] font-bold text-slate-900 flex items-center gap-2 truncate">
//                         Notifications
//                         {unreadCount > 0 && (
//                           <span className="bg-indigo-50 text-[#13102F] text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0">
//                             {unreadCount}
//                           </span>
//                         )}
//                       </h3>
//                       {unreadCount > 0 && (
//                         <button 
//                           onClick={handleMarkAllAsRead}
//                           className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-[#13102F] transition-colors flex items-center gap-1 shrink-0 ml-2 active:scale-95"
//                         >
//                           <CheckCheck size={12}  /> 
//                           <span className="hidden sm:inline">Mark all</span>
//                         </button>
//                       )}
//                     </div>

//                     {/* Notification List */}
//                     <div className="max-h-[calc(70vh-120px)] sm:max-h-95 overflow-y-auto custom-scrollbar bg-slate-50/30">
//                       {notifications.length === 0 ? (
//                         <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center">
//                           <div className="w-12 sm:w-16 h-12 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-2 sm:mb-3">
//                             <Bell size={24} />
//                           </div>
//                           <p className="text-slate-500 font-medium text-xs sm:text-sm">You're all caught up!</p>
//                           <p className="text-slate-400 text-[10px] sm:text-xs mt-1">No new notifications.</p>
//                         </div>
//                       ) : (
//                         <div className="flex flex-col">
//                           {notifications.map(item => {
//                             const { icon: CategoryIcon, bg, text } = getNotificationStyles(item.category);

//                             return (
//                               <div 
//                                 key={item.id}
//                                 onClick={() => handleMarkAsRead(item.id)}
//                                 className={`relative group cursor-pointer transition-all border-b border-slate-100/60 last:border-0 ${
//                                   item.read ? 'bg-white hover:bg-slate-50/80' : 'bg-slate-50/50 hover:bg-slate-100/50'
//                                 }`}
//                               >
//                                 {!item.read && (
//                                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-400 rounded-r-full"></div>
//                                 )}

//                                 <div className="p-3 sm:p-4 pl-4 sm:pl-5 flex gap-3 sm:gap-4">
//                                   <div className={`w-9 sm:w-11 h-9 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white ${bg} ${text} ${item.read ? 'opacity-60' : 'opacity-100'}`}>
//                                     <CategoryIcon size={16}  />
//                                   </div>

//                                   <div className={`flex-1 min-w-0 pr-4 sm:pr-6 ${item.read ? 'opacity-70' : 'opacity-100'}`}>
//                                     <div className="flex items-start justify-between gap-2 mb-1">
//                                       <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
//                                         {item.title}
//                                       </h4>
//                                       <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 shrink-0 whitespace-nowrap mt-0.5">
//                                         {item.timestamp}
//                                       </span>
//                                     </div>
//                                     <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">
//                                       {item.message}
//                                     </p>
//                                   </div>
//                                 </div>

//                                 <button 
//                                   onClick={(e) => handleDeleteNotification(item.id, e)}
//                                   className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 bg-white rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 shrink-0 active:scale-75"
//                                   title="Delete notification"
//                                 >
//                                   <Trash2 size={12} />
//                                 </button>
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}
//                     </div>

//                     {/* Footer */}
//                     <div className="p-2 sm:p-3 border-t border-slate-100 bg-white relative z-10 shadow-[0_-1px_0_0_rgba(0,0,0,0.03)] shrink-0">
//                       <button 
//                         onClick={() => {
//                           setIsNotificationOpen(false);
//                           navigate('/patient/notifications');
//                         }}
//                         className="w-full py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold text-slate-600 hover:text-[#13102F] hover:bg-slate-100 rounded-lg sm:rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
//                       >
//                         View all activity
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Top Right Profile Button - Image Only */}
//               <div className="flex items-center ml-1 sm:ml-2 pl-2 sm:pl-3">
//                 <NavLink
//                   to={ROUTES.PATIENT.PROFILE}
//                   className="group flex items-center justify-center p-1 rounded-full hover:opacity-80 transition-opacity active:scale-95"
//                   title="My Profile"
//                 >
//                   {user?.profilePicture ? (
//                     <img 
//                       src={user.profilePicture} 
//                       alt="Profile" 
//                       className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover shrink-0 bg-[#1e1947]"
//                     />
//                   ) : (
//                     <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full shrink-0 bg-[#1e1947] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-inner">
//                       {getInitials(user ? `${user.firstName} ${user.lastName}` : undefined)}
//                     </div>
//                   )}
//                 </NavLink>
//               </div>

//             </div>
//           </header>
//         )}

//         {/* MAIN CONTENT AREA - With padding for child components */}
//         <main className={`relative mx-auto w-full flex-1 p-3 sm:p-4 lg:p-6 ${isAiChatPage ? 'h-screen p-0' : 'pb-16 sm:pb-4'}`}>
//           <Outlet />
//         </main>
//       </div>

//       {/* --- MOBILE-ONLY BOTTOM TAB BAR --- */}
//       {!isAiChatPage && (
//         <nav className="fixed bottom-0 left-0 right-0 z-[80] sm:hidden bg-white border-t border-slate-200 shadow-sm">
//           <div className="flex items-stretch justify-between px-0.5">
//             {bottomNavItems.map((item) => {
//               const active = isRouteActive(item.to);
//               const Icon = item.icon;
//               return (
//                 <NavLink
//                   key={item.to}
//                   to={item.to}
//                   className="group flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0 active:scale-95 transition-transform"
//                 >
//                   <Icon
//                     size={20}
//                     strokeWidth={active ? 2.5 : 2}
//                     className={`shrink-0 ${active ? 'text-[#13102F]' : 'text-slate-400 group-hover:text-[#13102F]'}`}
//                   />
//                   <span className={`text-[9px] font-semibold truncate max-w-full ${active ? 'text-[#13102F]' : 'text-slate-400 group-hover:text-[#13102F]'}`}>
//                     {item.label}
//                   </span>
//                 </NavLink>
//               );
//             })}
//           </div>
//         </nav>
//       )}
//     </div>
//   );
// }





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
import { ROUTES } from '../constants/routes.constants';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useAuth } from '../features/auth/hooks/useAuth';
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

const getNotificationStyles = (category: string) => {
  switch(category) {
    case 'appointments': return { icon: Calendar, bg: 'bg-blue-50', text: 'text-blue-600' };
    case 'orders': return { icon: PillIcon, bg: 'bg-emerald-50', text: 'text-emerald-600' };
    case 'reports': return { icon: Microscope, bg: 'bg-purple-50', text: 'text-purple-600' };
    default: return { icon: AlertCircle, bg: 'bg-orange-50', text: 'text-orange-600' };
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
  { to: ROUTES.PATIENT.PROFILE, icon: User, label: 'Profile' },
];

export default function PatientLayout() {
  const { user } = useAppSelector((state) => state.auth);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAiChatPage = location.pathname === ROUTES.PATIENT.ASSISTANT || location.pathname === "/assistant";

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

  return (
    <div className={`font-sans relative flex ${isAiChatPage ? 'min-h-[100dvh] h-[100dvh] bg-[#060819] overflow-hidden' : 'min-h-screen bg-[#F8FAFC]'}`}>

      {/* --- LEFT SIDEBAR --- */}
      {!isAiChatPage && (
        <>
          {/* Mobile/Tablet Overlay */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          <aside 
            className={`fixed top-0 left-0 z-70 h-full bg-[#13102F] shadow-xl border-r border-[#1e1a45] transform transition-all duration-300 ease-in-out flex flex-col ${
              isSidebarOpen ? 'translate-x-0 w-56 sm:w-64' : `-translate-x-full lg:translate-x-0 ${isSidebarCollapsed ? 'lg:w-[72px]' : 'w-56 sm:w-64'}`
            }`}
          >
            {/* Sidebar Header */}
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 sm:px-5 h-14 sm:h-20 border-b border-[#1e1a45] shrink-0`}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className={`hidden lg:flex p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0 ${isSidebarCollapsed ? '' : '-ml-2'}`}
                  title="Toggle Sidebar"
                >
                  <Menu size={20} />
                </button>
                {!isSidebarCollapsed && (
                  <>
                    <img src="/LOGO.png" alt="ArogyaGenie Logo" className="h-6 sm:h-7 w-6 sm:w-7 object-contain brightness-0 invert" />
                    <div className="flex flex-col justify-center min-w-0">
                      <h1 className="text-base sm:text-xl font-extrabold text-white leading-none tracking-wide truncate">ArogyaGenie</h1>
                    </div>
                  </>
                )}
              </div>
              {!isSidebarCollapsed && (
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-1.5 -mr-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Sidebar Menu Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-3 py-3 sm:py-4 space-y-0.5 sm:space-y-1">
              
              {/* Home */}
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

              {/* DOCTOR ACCORDION */}
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
                      className={`hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        location.pathname === ROUTES.PATIENT.FINDDOCTOR
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Find Doctor</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.APPOINTMENTS}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.APPOINTMENTS)
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Appointments</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.PRESCRIBTION}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.PRESCRIBTION)
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Prescriptions</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* HOSPITAL */}
              <NavLink
                to={ROUTES.PATIENT.HOSPITAL}
                onClick={() => setIsSidebarOpen(false)}
                className={`group hidden sm:flex w-full transition-all font-semibold ${
                  isSidebarCollapsed
                    ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                    : 'items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                } ${
                  isRouteActive(ROUTES.PATIENT.HOSPITAL) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Building2 size={isSidebarCollapsed ? 22 : 16} strokeWidth={isRouteActive(ROUTES.PATIENT.HOSPITAL) ? 2.5 : 2} className={`shrink-0 ${isRouteActive(ROUTES.PATIENT.HOSPITAL) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className={isSidebarCollapsed ? 'truncate w-full text-center' : 'truncate'}>Hospital</span>
              </NavLink>

              {/* DIAGNOSTICS ACCORDION */}
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
                    location.pathname.includes('lab') || location.pathname.includes('diagnostic') 
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
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
                      className={`hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        location.pathname === ROUTES.PATIENT.LAB
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Find Diagnostics</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.LAB_REPORTS}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.LAB_REPORTS)
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Lab Report</span>
                    </NavLink>
                  </div>
                )}
              </div>

              {/* MEDICINE ACCORDION */}
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
                    location.pathname.includes('medicine') || location.pathname.includes('medicine-orders')
                      ? 'bg-indigo-500/20 text-indigo-400' 
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
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
                      className={`hidden sm:flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        location.pathname === ROUTES.PATIENT.MEDICINE
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Find Pharmacy</span>
                    </NavLink>

                    <NavLink
                      to={ROUTES.PATIENT.MEDICINE_ORDERS}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-[11px] sm:text-xs font-semibold transition-all ${
                        isRouteActive(ROUTES.PATIENT.MEDICINE_ORDERS)
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                      <span className="truncate">Medicine Order</span>
                    </NavLink>
                  </div>
                )}
              </div>

              <div className="my-2 sm:my-4 border-t border-[#1e1a45]" />

              {/* Ambulance */}
              <NavLink
                to={ROUTES.PATIENT.AMBULANCE}
                onClick={() => setIsSidebarOpen(false)}
                className={`group w-full transition-all font-semibold flex ${
                  isSidebarCollapsed
                    ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                    : 'items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                } ${
                  isRouteActive(ROUTES.PATIENT.AMBULANCE) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Ambulance size={isSidebarCollapsed ? 22 : 16} strokeWidth={isRouteActive(ROUTES.PATIENT.AMBULANCE) ? 2.5 : 2} className={`shrink-0 ${isRouteActive(ROUTES.PATIENT.AMBULANCE) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className={isSidebarCollapsed ? 'truncate w-full text-center' : 'truncate'}>Ambulance</span>
              </NavLink>

              {/* My Profile */}
              <NavLink
                to={ROUTES.PATIENT.PROFILE}
                onClick={() => setIsSidebarOpen(false)}
                className={`group hidden sm:flex w-full transition-all font-semibold ${
                  isSidebarCollapsed
                    ? 'flex-col items-center justify-center py-3 px-1 gap-1 text-[10px] rounded-lg'
                    : 'items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm'
                } ${
                  isRouteActive(ROUTES.PATIENT.PROFILE) 
                    ? 'bg-indigo-500/20 text-indigo-400' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <User size={isSidebarCollapsed ? 22 : 16} strokeWidth={isRouteActive(ROUTES.PATIENT.PROFILE) ? 2.5 : 2} className={`shrink-0 ${isRouteActive(ROUTES.PATIENT.PROFILE) ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                <span className={isSidebarCollapsed ? 'truncate w-full text-center' : 'truncate'}>My Profile</span>
              </NavLink>
            </div>

            {/* User Profile & Logout at Bottom */}
            <div className={`p-2 sm:p-3.5 border-t border-[#1e1a45] shrink-0 ${isSidebarCollapsed ? 'flex flex-col items-center gap-3' : ''}`}>
              {isSidebarCollapsed ? (
                <>
                  {user?.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover shrink-0 bg-slate-800"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full shrink-0 bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-inner">
                      {getInitials(user ? `${user.firstName} ${user.lastName}` : undefined)}
                    </div>
                  )}
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
                  <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3 px-1">
                    {user?.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="h-7 sm:h-9 w-7 sm:w-9 rounded-full object-cover shrink-0 bg-slate-800"
                      />
                    ) : (
                      <div className="h-7 sm:h-9 w-7 sm:w-9 rounded-full shrink-0 bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-inner">
                        {getInitials(user ? `${user.firstName} ${user.lastName}` : undefined)}
                      </div>
                    )}

                    <div className="flex flex-col min-w-0">
                      <h2 className="text-[10px] sm:text-xs font-bold text-white leading-tight truncate">
                        Hi, {user ? (user.firstName || user.email.split('@')[0]) : "Guest"}
                      </h2>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-white bg-red-600 hover:bg-red-700 active:bg-red-800 border border-red-500/40 rounded-lg sm:rounded-lg font-bold transition-all shadow-sm shadow-red-950/40"
                  >
                    <LogOut size={12} strokeWidth={2.5} />
                    <span className="hidden sm:inline">Sign Out</span>
                    <span className="sm:hidden">Logout</span>
                  </button>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* --- MAIN LAYOUT WRAPPER --- */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isAiChatPage ? (isSidebarCollapsed ? 'lg:ml-[72px]' : 'lg:ml-64') : ''}`}>

        {/* --- TOP NAVIGATION BAR --- */}
        {!isAiChatPage && (
          <header className="sticky top-0 z-50 flex h-14 sm:h-16 lg:h-20 w-full items-center justify-between border-b border-[#1e1a45] lg:border-slate-200 bg-[#13102F] lg:bg-white/90 px-3 sm:px-4 lg:px-8 backdrop-blur-md shadow-sm gap-3">

            {/* Left Side: Mobile Menu Toggle & Brand Logo/Name */}
            <div className="flex items-center gap-2 sm:gap-3 lg:hidden z-10 min-w-0">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
                title="Open navigation menu"
              >
                <Menu size={20} />
              </button>
              
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <img src="/LOGO.png" alt="ArogyaGenie Logo" className="h-6 sm:h-7 w-6 sm:w-7 object-contain brightness-0 invert shrink-0" />
                <h1 className="text-sm sm:text-base font-bold text-white tracking-wide truncate">ArogyaGenie</h1>
              </div>
            </div>

            {/* --- NAVBAR TITLE & LOCATION BADGE (Desktop Only) --- */}
            <div className="hidden lg:flex flex-col items-start justify-center gap-0.5 min-w-0">
              <h2 className="text-2xl lg:text-3xl text-blue-800 font-bold tracking-tight leading-none truncate">
                {getPageTitle(location.pathname)}
              </h2>

              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium pl-0.5">
                <MapPin size={14} className="text-indigo-600 shrink-0" />
                <span className="leading-tight">Khardaha, WB</span>
              </div>
            </div>

            {/* RIGHT SIDE: Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0 z-10">
              <button 
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 768) {
                    navigate(ROUTES.PATIENT.ASSISTANT);
                  } else {
                    window.dispatchEvent(new Event('open-ai-assistant'));
                  }
                }}
                className="p-2 text-white bg-white/10 hover:bg-white/20 lg:text-indigo-600 lg:bg-indigo-50 lg:hover:bg-indigo-100 rounded-lg sm:rounded-full transition-colors flex items-center gap-2 px-2 sm:px-3 lg:px-4 min-h-11 min-w-11 justify-center sm:justify-start shrink-0 cursor-pointer"
                title="Chat with AI Health Assistant"
              >
                <Bot size={20} className="shrink-0" />
                <span className="text-xs sm:text-sm font-bold hidden sm:block text-white lg:text-indigo-600">AI Assistant</span>
              </button>

              {/* Notification Bell */}
              <div className="relative pointer-events-auto" ref={notificationRef}>
                <button 
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className={`relative p-2 rounded-lg sm:rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center shrink-0 ${
                    isNotificationOpen 
                      ? 'bg-indigo-500/20 text-indigo-300 lg:bg-indigo-50 lg:text-indigo-600' 
                      : 'text-slate-300 hover:bg-white/10 lg:text-slate-500 lg:hover:bg-slate-100'
                  }`}
                  title="Notifications"
                >
                  <Bell size={18} strokeWidth={2} className={isNotificationOpen ? 'fill-indigo-400/20 lg:fill-indigo-100' : ''} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 border border-[#13102F] lg:border-white shrink-0"></span>
                  )}
                </button>

                {/* --- NOTIFICATION DROPDOWN --- */}
                {isNotificationOpen && (
                  <div className="absolute right-0 mt-2 sm:mt-4 w-screen sm:w-85 md:w-105 bg-white rounded-2xl sm:rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100/80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 origin-top-right text-left max-h-[70vh] sm:max-h-none flex flex-col mx-2 sm:mx-0">
                    {/* Header */}
                    <div className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between bg-white z-10 relative shadow-[0_1px_0_0_rgba(0,0,0,0.03)] shrink-0">
                      <h3 className="text-base sm:text-[17px] font-bold text-slate-900 flex items-center gap-2 truncate">
                        Notifications
                        {unreadCount > 0 && (
                          <span className="bg-indigo-100 text-indigo-700 text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold shrink-0">
                            {unreadCount}
                          </span>
                        )}
                      </h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllAsRead}
                          className="text-[10px] sm:text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 shrink-0 ml-2"
                        >
                          <CheckCheck size={12}  /> 
                          <span className="hidden sm:inline">Mark all</span>
                        </button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-[calc(70vh-120px)] sm:max-h-95 overflow-y-auto custom-scrollbar bg-slate-50/30">
                      {notifications.length === 0 ? (
                        <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center">
                          <div className="w-12 sm:w-16 h-12 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-2 sm:mb-3">
                            <Bell size={24} />
                          </div>
                          <p className="text-slate-500 font-medium text-xs sm:text-sm">You're all caught up!</p>
                          <p className="text-slate-400 text-[10px] sm:text-xs mt-1">No new notifications.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {notifications.map(item => {
                            const { icon: CategoryIcon, bg, text } = getNotificationStyles(item.category);

                            return (
                              <div 
                                key={item.id}
                                onClick={() => handleMarkAsRead(item.id)}
                                className={`relative group cursor-pointer transition-all border-b border-slate-100/60 last:border-0 ${
                                  item.read ? 'bg-white hover:bg-slate-50/80' : 'bg-indigo-50/20 hover:bg-indigo-50/50'
                                }`}
                              >
                                {!item.read && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>
                                )}

                                <div className="p-3 sm:p-4 pl-4 sm:pl-5 flex gap-3 sm:gap-4">
                                  <div className={`w-9 sm:w-11 h-9 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white ${bg} ${text} ${item.read ? 'opacity-60' : 'opacity-100'}`}>
                                    <CategoryIcon size={16}  />
                                  </div>

                                  <div className={`flex-1 min-w-0 pr-4 sm:pr-6 ${item.read ? 'opacity-70' : 'opacity-100'}`}>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-tight">
                                        {item.title}
                                      </h4>
                                      <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 shrink-0 whitespace-nowrap mt-0.5">
                                        {item.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">
                                      {item.message}
                                    </p>
                                  </div>
                                </div>

                                <button 
                                  onClick={(e) => handleDeleteNotification(item.id, e)}
                                  className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-4 w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 bg-white rounded-full shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200 shrink-0"
                                  title="Delete notification"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-2 sm:p-3 border-t border-slate-100 bg-white relative z-10 shadow-[0_-1px_0_0_rgba(0,0,0,0.03)] shrink-0">
                      <button 
                        onClick={() => {
                          setIsNotificationOpen(false);
                          navigate('/patient/notifications');
                        }}
                        className="w-full py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg sm:rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        View all activity
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
        )}

        {/* MAIN CONTENT AREA */}
        <main className={`relative mx-auto w-full flex-1 ${isAiChatPage ? 'h-[100dvh] max-w-none p-0 overflow-hidden' : 'max-w-7xl p-2 sm:p-3 lg:p-4 pb-20 sm:pb-3 lg:pb-4'}`}>
          <Outlet />
        </main>
      </div>

      {/* --- MOBILE-ONLY BOTTOM TAB BAR --- */}
      {!isAiChatPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-80 sm:hidden bg-[#13102F] border-t border-[#1e1a45] shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.35)]">
          <div className="flex items-stretch justify-between px-0.5">
            {bottomNavItems.map((item) => {
              const active = isRouteActive(item.to);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0"
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.5 : 2}
                    className={`shrink-0 ${active ? 'text-indigo-400' : 'text-slate-400'}`}
                  />
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