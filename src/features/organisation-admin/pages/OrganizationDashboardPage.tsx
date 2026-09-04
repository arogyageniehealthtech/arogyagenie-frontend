// import { useState, useEffect, useRef } from 'react';
// import { 
//   Activity, Building2, Users, Settings, ShieldCheck, 
//   Menu, X, Bell, LogOut, MapPin, CheckCheck, Loader2 
// } from 'lucide-react';
// import OverviewTab from '../components/OverviewTab';
// import FacilitiesTab from '../components/FacilitiesTab';
// import StaffTab from '../components/StaffTab';
// import { MOCK_FACILITIES, MOCK_EMPLOYEES } from '../data/orgAdmin.mock';

// export default function OrganizationDashboardPage({ 
//   organizationId = 'org-1', 
//   orgName = 'Apex Healthcare' 
// }: { 
//   organizationId?: string; 
//   orgName?: string; 
// }) {
//   const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FACILITIES' | 'STAFF'>('OVERVIEW');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const notificationRef = useRef<HTMLDivElement>(null);

//   // Data States
//   const [loading, setLoading] = useState(true);
//   const [facilities, setFacilities] = useState(MOCK_FACILITIES);
//   const [employees, setEmployees] = useState(MOCK_EMPLOYEES);

//   useEffect(() => {
//     // Simulate initial data load
//     const timer = setTimeout(() => {
//       setFacilities(MOCK_FACILITIES);
//       setEmployees(MOCK_EMPLOYEES);
//       setLoading(false);
//     }, 600);
//     return () => clearTimeout(timer);
//   }, []);

//   const [notifications, setNotifications] = useState([
//     { id: '1', title: 'New Facility Verification', message: 'Apex Pharmacy Plus requires drug license upload.', read: false, timestamp: '10m ago' }
//   ]);
//   const unreadCount = notifications.filter(n => !n.read).length;

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
//         setIsNotificationOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const NAV_ITEMS = [
//     { id: 'OVERVIEW', label: 'Dashboard Overview', icon: Activity },
//     { id: 'FACILITIES', label: 'Facilities Matrix', icon: Building2 },
//     { id: 'STAFF', label: 'Staff Directory', icon: Users },
//   ] as const;

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans relative flex">
//       {/* Mobile Backdrop */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 z-60 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
//       )}

//       {/* Left Sidebar */}
//       <aside className={`fixed top-0 left-0 z-70 h-full w-56 sm:w-64 bg-[#13102F] shadow-xl border-r border-[#1e1a45] transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
//         <div className="flex items-center justify-between px-4 sm:px-5 h-14 sm:h-20 border-b border-[#1e1a45] shrink-0">
//           <div className="flex items-center gap-2">
//             <div className="h-7 w-7 bg-white text-[#13102F] rounded-lg flex items-center justify-center font-black text-sm">
//               {orgName.charAt(0)}
//             </div>
//             <div className="flex flex-col min-w-0">
//               <h1 className="text-sm sm:text-base font-extrabold text-white leading-tight truncate">{orgName}</h1>
//               <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
//                 <ShieldCheck size={10} /> Verified Org
//               </span>
//             </div>
//           </div>
//           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg">
//             <X size={18} />
//           </button>
//         </div>

//         <div className="flex-1 overflow-y-auto px-2 sm:px-3 py-3 space-y-1">
//           {NAV_ITEMS.map(item => {
//             const Icon = item.icon;
//             const active = activeTab === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
//                 className={`group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${active ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
//               >
//                 <Icon size={16} className={active ? 'text-indigo-400' : 'text-slate-400'} />
//                 <span className="truncate">{item.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         <div className="p-3 border-t border-[#1e1a45] shrink-0">
//           <button className="flex w-full items-center justify-center gap-2 px-3 py-2 text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all shadow-sm">
//             <LogOut size={12} strokeWidth={2.5} />
//             <span>Sign Out</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main Panel */}
//       <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
//         {/* Top Navbar */}
//         <header className="sticky top-0 z-50 flex h-14 sm:h-16 lg:h-20 w-full items-center justify-between border-b border-[#1e1a45] lg:border-slate-200 bg-[#13102F] lg:bg-white/90 px-3 sm:px-4 lg:px-8 backdrop-blur-md shadow-sm gap-3">
//           <div className="flex items-center gap-2 sm:gap-3 lg:hidden min-w-0">
//             <button onClick={() => setIsSidebarOpen(true)} className="p-1.5 text-white hover:bg-white/10 rounded-lg">
//               <Menu size={20} />
//             </button>
//             <h1 className="text-sm sm:text-base font-bold text-white truncate">{orgName} Admin</h1>
//           </div>

//           <div className="hidden lg:flex flex-col items-start justify-center">
//             <h2 className="text-xl lg:text-2xl text-[#13102F] font-black tracking-tight leading-none">
//               {NAV_ITEMS.find(n => n.id === activeTab)?.label}
//             </h2>
//             <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mt-1">
//               <MapPin size={12} className="text-indigo-600" />
//               <span>Arogyagenie Multi-Facility Network</span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2 ml-auto">
//             <button className="p-2 text-white bg-white/10 lg:text-slate-600 lg:bg-slate-50 rounded-full">
//               <Settings size={18} />
//             </button>
            
//             <div className="relative pointer-events-auto" ref={notificationRef}>
//               <button 
//                 onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                 className={`relative p-2 rounded-lg sm:rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center shrink-0 ${
//                   isNotificationOpen 
//                     ? 'bg-indigo-500/20 text-indigo-300 lg:bg-indigo-50 lg:text-indigo-600' 
//                     : 'text-slate-300 hover:bg-white/10 lg:text-slate-500 lg:hover:bg-slate-100'
//                 }`}
//               >
//                 <Bell size={18} strokeWidth={2} />
//                 {unreadCount > 0 && <span className="absolute top-2 right-2.5 h-2.5 w-2.5 rounded-full bg-red-500 border border-[#13102F] lg:border-white"></span>}
//               </button>

//               {isNotificationOpen && (
//                 <div className="absolute right-0 mt-2 sm:mt-4 w-screen sm:w-85 md:w-96 bg-white rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 z-50 overflow-hidden text-left mx-2 sm:mx-0 animate-in fade-in slide-in-from-top-4 duration-300 origin-top-right">
//                   <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50">
//                     <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
//                     {unreadCount > 0 && (
//                       <button onClick={() => setNotifications(n => n.map(i => ({...i, read: true})))} className="text-[10px] font-bold text-indigo-600 flex items-center gap-1 hover:underline">
//                         <CheckCheck size={12} /> Mark all read
//                       </button>
//                     )}
//                   </div>
//                   <div className="max-h-64 overflow-y-auto">
//                     {notifications.length === 0 || unreadCount === 0 ? (
//                       <div className="p-6 text-center text-slate-500 text-xs font-medium">No new notifications.</div>
//                     ) : (
//                       notifications.map(n => (
//                         <div key={n.id} onClick={() => setNotifications(prev => prev.map(i => i.id === n.id ? {...i, read: true} : i))} className="p-3 sm:p-4 border-b border-slate-100/60 bg-indigo-50/20 hover:bg-indigo-50/50 cursor-pointer transition-colors">
//                           <div className="flex justify-between items-start mb-1">
//                             <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
//                             <span className="text-[9px] text-slate-400">{n.timestamp}</span>
//                           </div>
//                           <p className="text-[11px] text-slate-500">{n.message}</p>
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* Content Body */}
//         <main className="relative mx-auto w-full flex-1 max-w-7xl p-3 sm:p-4 lg:p-6 pb-20 sm:pb-6 lg:pb-8">
//           {loading ? (
//             <div className="py-20 flex flex-col items-center justify-center gap-3">
//               <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//               <span className="text-xs font-bold text-slate-500">Loading Workspace...</span>
//             </div>
//           ) : (
//             <>
//               {activeTab === 'OVERVIEW' && <OverviewTab organizationId={organizationId} />}
//               {activeTab === 'FACILITIES' && <FacilitiesTab organizationId={organizationId} initialFacilities={facilities} />}
//               {activeTab === 'STAFF' && <StaffTab organizationId={organizationId} initialEmployees={employees} facilities={facilities} />}
//             </>
//           )}
//         </main>
//       </div>

//       {/* Mobile Bottom Tab Bar */}
//       <nav className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[#13102F] border-t border-[#1e1a45] shadow-lg">
//         <div className="flex items-stretch justify-between px-1">
//           {NAV_ITEMS.map(item => {
//             const active = activeTab === item.id;
//             const Icon = item.icon;
//             return (
//               <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex-1 flex flex-col items-center justify-center gap-1 py-2">
//                 <Icon size={18} className={active ? 'text-indigo-400' : 'text-slate-400'} />
//                 <span className={`text-[9px] font-semibold ${active ? 'text-indigo-400' : 'text-slate-400'}`}>
//                   {item.label.split(' ')[0]}
//                 </span>
//               </button>
//             );
//           })}
//         </div>
//       </nav>
//     </div>
//   );
// }