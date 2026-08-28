// import React, { useState } from 'react';
// import { 
//   Bell, Check, CheckCheck, Trash2, Calendar, Pill, 
//   Microscope, Building2, AlertCircle, ArrowLeft, Filter 
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// // ==========================================
// // Types
// // ==========================================
// type NotificationCategory = 'all' | 'appointments' | 'orders' | 'reports' | 'alerts';

// interface NotificationItem {
//   id: string;
//   title: string;
//   message: string;
//   timestamp: string;
//   category: 'appointments' | 'orders' | 'reports' | 'alerts';
//   read: boolean;
//   actionUrl?: string;
// }

// // ==========================================
// // Mock Data
// // ==========================================
// const INITIAL_NOTIFICATIONS: NotificationItem[] = [
//   {
//     id: 'n1',
//     title: 'Appointment Confirmed',
//     message: 'Your upcoming consultation with Dr. Arup Kumar is confirmed for tomorrow at 05:30 PM.',
//     timestamp: '10 mins ago',
//     category: 'appointments',
//     read: false,
//   },
//   {
//     id: 'n2',
//     title: 'Medicine Request Accepted',
//     message: 'Apollo Pharmacy has accepted your broadcasted medicine order and is preparing it for dispatch.',
//     timestamp: '1 hour ago',
//     category: 'orders',
//     read: false,
//   },
//   {
//     id: 'n3',
//     title: 'Lab Report Ready',
//     message: 'Your Complete Blood Count (CBC) lab report from City Diagnostics is now available to download.',
//     timestamp: 'Yesterday',
//     category: 'reports',
//     read: true,
//   },
//   {
//     id: 'n4',
//     title: 'Bed Admission Update',
//     message: 'Your bed reservation at City Care Multispecialty Hospital has been successfully registered.',
//     timestamp: '2 days ago',
//     category: 'alerts',
//     read: true,
//   },
// ];

// export default function NotificationsPage() {
//   const navigate = useNavigate();
//   const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
//   const [filter, setFilter] = useState<NotificationCategory>('all');

//   // --- Handlers ---
//   const handleMarkAsRead = (id: string) => {
//     setNotifications(notifications.map(item => 
//       item.id === id ? { ...item, read: true } : item
//     ));
//   };

//   const handleMarkAllAsRead = () => {
//     setNotifications(notifications.map(item => ({ ...item, read: true })));
//   };

//   const handleDeleteNotification = (id: string, e: React.MouseEvent) => {
//     e.stopPropagation();
//     setNotifications(notifications.filter(item => item.id !== id));
//   };

//   const handleClearAll = () => {
//     setNotifications([]);
//   };

//   // Filtered Notifications
//   const filteredNotifications = notifications.filter(item => {
//     if (filter === 'all') return true;
//     return item.category === filter;
//   });

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const getCategoryIcon = (category: string) => {
//     switch (category) {
//       case 'appointments': return <Calendar className="w-5 h-5 text-indigo-600" />;
//       case 'orders': return <Pill className="w-5 h-5 text-purple-600" />;
//       case 'reports': return <Microscope className="w-5 h-5 text-blue-600" />;
//       default: return <AlertCircle className="w-5 h-5 text-amber-600" />;
//     }
//   };

//   const getCategoryBg = (category: string) => {
//     switch (category) {
//       case 'appointments': return 'bg-indigo-50 border-indigo-100';
//       case 'orders': return 'bg-purple-50 border-purple-100';
//       case 'reports': return 'bg-blue-50 border-blue-100';
//       default: return 'bg-amber-50 border-amber-100';
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
//       {/* Top Header Card */}
//       <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div className="flex items-center gap-4">
//           <button 
//             onClick={() => navigate(-1)}
//             className="p-2.5 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all border border-gray-200"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <div>
//             <div className="flex items-center gap-2.5">
//               <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h2>
//               {unreadCount > 0 && (
//                 <span className="bg-red-500 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
//                   {unreadCount} unread
//                 </span>
//               )}
//             </div>
//             <p className="text-sm font-medium text-gray-500 mt-0.5">Stay updated on your health activities, orders, and appointments.</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 self-end sm:self-auto">
//           {unreadCount > 0 && (
//             <button 
//               onClick={handleMarkAllAsRead}
//               className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100"
//             >
//               <CheckCheck className="w-4 h-4" /> Mark all read
//             </button>
//           )}
//           {notifications.length > 0 && (
//             <button 
//               onClick={handleClearAll}
//               className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
//             >
//               <Trash2 className="w-4 h-4" /> Clear all
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Filter Chips */}
//       <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
//         {[
//           { id: 'all', label: 'All Notifications' },
//           { id: 'appointments', label: 'Appointments' },
//           { id: 'orders', label: 'Medicine Orders' },
//           { id: 'reports', label: 'Lab Reports' },
//           { id: 'alerts', label: 'System Alerts' },
//         ].map(tab => (
//           <button
//             key={tab.id}
//             onClick={() => setFilter(tab.id as NotificationCategory)}
//             className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
//               filter === tab.id 
//                 ? 'bg-purple-600 text-white border-purple-600 shadow-sm' 
//                 : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
//             }`}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>

//       {/* Notifications List */}
//       <div className="space-y-3">
//         {filteredNotifications.length === 0 ? (
//           <div className="bg-white border border-gray-200 border-dashed rounded-3xl p-16 text-center shadow-sm flex flex-col items-center">
//             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-inner">
//               <Bell className="w-8 h-8 text-gray-300" />
//             </div>
//             <h3 className="font-bold text-lg text-gray-900">No notifications found</h3>
//             <p className="text-sm font-medium text-gray-500 mt-1 max-w-sm">You're all caught up! There are no new alerts in this category.</p>
//           </div>
//         ) : (
//           filteredNotifications.map(item => (
//             <div 
//               key={item.id}
//               onClick={() => handleMarkAsRead(item.id)}
//               className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 relative group ${
//                 item.read 
//                   ? 'bg-white border-gray-200 hover:border-gray-300' 
//                   : 'bg-purple-50/20 border-purple-200 ring-1 ring-purple-100 shadow-sm'
//               }`}
//             >
//               {/* Unread indicator dot */}
//               {!item.read && (
//                 <span className="absolute top-5 right-5 w-2.5 h-2.5 bg-purple-600 rounded-full animate-pulse" />
//               )}

//               {/* Category Icon */}
//               <div className={`p-3 rounded-2xl border shrink-0 ${getCategoryBg(item.category)}`}>
//                 {getCategoryIcon(item.category)}
//               </div>

//               {/* Content */}
//               <div className="flex-1 pr-6">
//                 <div className="flex items-center gap-3">
//                   <h4 className={`font-bold text-base ${item.read ? 'text-gray-800' : 'text-gray-900 font-extrabold'}`}>
//                     {item.title}
//                   </h4>
//                   <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-md">
//                     {item.timestamp}
//                   </span>
//                 </div>
//                 <p className={`text-sm mt-1 leading-relaxed ${item.read ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
//                   {item.message}
//                 </p>
//               </div>

//               {/* Delete Single Action */}
//               <button 
//                 onClick={(e) => handleDeleteNotification(item.id, e)}
//                 className="absolute bottom-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
//                 title="Delete notification"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//     </div>
//   );
// }