import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, ListOrdered, Navigation, Clock, IndianRupee, User, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/delivery/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/delivery/requests', icon: ListOrdered, label: 'Requests' },
  { path: '/delivery/active', icon: Navigation, label: 'Active' },
  { path: '/delivery/history', icon: Clock, label: 'History' },
  { path: '/delivery/earnings', icon: IndianRupee, label: 'Earnings' },
  { path: '/delivery/profile', icon: User, label: 'Profile' },
];

export default function DeliveryLayout() {
  const isOnline = useSelector((state: any) => state.delivery.isOnline);
  const activeDeliveryId = useSelector((state: any) => state.delivery.activeDeliveryId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 flex-col border-r border-slate-800">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">AG</div>
          <span className="font-bold text-white tracking-wide">ArogyaGenie</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50' : 'hover:bg-slate-800 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
              {item.path === '/delivery/active' && activeDeliveryId && (
                <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-xl">
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-slate-500'}`} />
            <span className="text-sm font-bold text-white">{isOnline ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe z-50">
        {navItems.slice(0, 5).map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `flex flex-col items-center p-2 rounded-lg transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}>
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.path === '/delivery/active' && activeDeliveryId && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              )}
            </div>
            <span className="text-[10px] font-semibold mt-1">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}