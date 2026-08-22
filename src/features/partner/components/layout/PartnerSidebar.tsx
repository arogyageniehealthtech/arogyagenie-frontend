import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  ShoppingBag,
  PackageSearch,
  FlaskConical,
  FileCheck2,
  CalendarCheck,
  Users2,
  Users,
  Stethoscope,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { usePartner } from '../../context/PartnerContext';
import { ROUTES } from '@/constants/routes.constants';

interface PartnerSidebarProps {
  onCloseMobile?: () => void;
}

export const PartnerSidebar: React.FC<PartnerSidebarProps> = ({ onCloseMobile }) => {
  const navigate = useNavigate();
  const {
    activeProvider,
    providers,
    activeProviderId,
    setActiveProviderId,
    requests,
    unreadNotifCount,
  } = usePartner();

  const pendingRequestsCount = requests.filter((r) => r.status === 'PENDING').length;
  const providerType = activeProvider?.type || 'PHARMACY';

  // Navigation schema configured by provider type
  const navGroups = [
    {
      title: 'Core Operations',
      items: [
        {
          to: '/partner/dashboard',
          label: 'Overview',
          icon: LayoutDashboard,
        },
        {
          to: '/partner/requests',
          label: 'Incoming Requests',
          icon: Inbox,
          badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
          badgeColor: 'bg-amber-500 text-white animate-pulse',
        },
      ],
    },
    {
      title: `${providerType === 'PHARMACY' ? 'Pharmacy' : providerType === 'LAB' ? 'Diagnostic Lab' : providerType === 'HOSPITAL' ? 'Hospital' : 'Clinic'} Modules`,
      items: [
        ...(providerType === 'PHARMACY'
          ? [
              { to: '/partner/orders', label: 'Medicine Orders', icon: ShoppingBag },
              { to: '/partner/inventory', label: 'Inventory & Stock', icon: PackageSearch },
            ]
          : []),
        ...(providerType === 'LAB'
          ? [
              { to: '/partner/test-bookings', label: 'Test Bookings', icon: FlaskConical },
              { to: '/partner/lab-reports', label: 'Lab Reports', icon: FileCheck2 },
            ]
          : []),
        ...(providerType === 'HOSPITAL'
          ? [
              { to: '/partner/appointments', label: 'Doctor Appointments', icon: CalendarCheck },
              { to: '/partner/check-ins', label: 'OPD Queue & Check-ins', icon: Users2 },
            ]
          : []),
        ...(providerType === 'CLINIC'
          ? [
              { to: '/partner/appointments', label: 'Doctor Consultations', icon: CalendarCheck },
            ]
          : []),
      ],
    },
    {
      title: 'Directory & Management',
      items: [
        { to: '/partner/patients', label: 'Patients Directory', icon: Users },
        { to: '/partner/services', label: 'Offered Services', icon: Stethoscope },
        { to: '/partner/analytics', label: 'Insights & Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'Account & Support',
      items: [
        {
          to: '/partner/notifications',
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
          badgeColor: 'bg-indigo-500 text-white',
        },
        { to: '/partner/settings', label: 'Facility Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-72 flex flex-col h-full shrink-0 select-none bg-[#0E0A24] text-white border-r border-violet-950/60 shadow-xl">
      
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-violet-900/40">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
            <img
              src="/LOGO.png"
              alt="AarogyaGenie"
              className="h-7 w-7 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white">
                AarogyaGenie
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                PARTNER
              </span>
            </div>
            <p className="text-[11px] font-semibold text-violet-300/60">
              Healthcare Operations Portal
            </p>
          </div>
        </div>

        {/* Quick Demo Switcher Selector */}
        <div className="mt-4 p-2.5 rounded-xl bg-violet-950/50 border border-violet-800/40">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-violet-300/70 mb-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-400" />
            Active Partner Facility:
          </label>
          <select
            value={activeProviderId}
            onChange={(e) => setActiveProviderId(e.target.value)}
            className="w-full bg-violet-900/80 text-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-violet-700/60 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.name} ({p.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 scrollbar-thin scrollbar-thumb-violet-900">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-violet-300/40">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                      isActive
                        ? 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-violet-200/70 hover:bg-violet-900/40 hover:text-white'
                    }`
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 shadow-xs ${
                        item.badgeColor || 'bg-slate-700 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile & Exit */}
      <div className="p-3 border-t border-violet-900/40 bg-violet-950/30">
        {activeProvider && (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-violet-900/40 border border-violet-800/40 mb-2">
            <img
              src={activeProvider.avatar}
              alt={activeProvider.name}
              className="h-9 w-9 rounded-xl object-cover shrink-0 border border-violet-500/40 shadow-xs"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white truncate block">
                  {activeProvider.name}
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              </div>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified & Online
              </span>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate(ROUTES.AUTH.LOGIN)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition-colors border border-rose-900/30 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Exit Partner Portal</span>
        </button>
      </div>

    </aside>
  );
};
