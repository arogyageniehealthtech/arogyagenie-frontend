import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Building2,
  Clock,
  Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePartner } from '../../context/PartnerContext';

interface PartnerHeaderProps {
  onToggleMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const PartnerHeader: React.FC<PartnerHeaderProps> = ({
  onToggleMobileMenu,
  title,
  subtitle,
}) => {
  const navigate = useNavigate();
  const {
    activeProvider,
    providers,
    activeProviderId,
    setActiveProviderId,
    notifications,
    unreadNotifCount,
    markNotifRead,
    markAllNotifsRead,
    simulateIncomingRequest,
    searchQuery,
    setSearchQuery,
  } = usePartner();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [isProviderMenuOpen, setIsProviderMenuOpen] = useState<boolean>(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const providerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (providerRef.current && !providerRef.current.contains(e.target as Node)) {
        setIsProviderMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 sm:px-8 backdrop-blur-md shadow-xs">
      
      {/* Left: Mobile Menu & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate tracking-tight">
            {title || `Welcome, ${activeProvider?.name || 'Partner'}`}
          </h1>
          <p className="hidden sm:block text-xs font-medium text-slate-500 truncate">
            {subtitle || `${activeProvider?.type} Dashboard • Live on AarogyaGenie Platform`}
          </p>
        </div>
      </div>

      {/* Right: Search, Demo Simulator, Notifications, Provider Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, order, request #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
          />
        </div>

        {/* Live Presentation Request Simulator Button */}
        <button
          onClick={simulateIncomingRequest}
          title="Simulate a patient requesting a service from the AarogyaGenie mobile app"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-sm hover:shadow-md hover:from-indigo-700 hover:to-violet-700 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="hidden sm:inline">Simulate Patient Request</span>
          <span className="sm:hidden">Simulate</span>
        </button>

        {/* Notifications Flyout */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-bounce">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">Partner Notifications</h4>
                  {unreadNotifCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotifsRead}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="mt-3 max-h-80 overflow-y-auto space-y-2 divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotifRead(n.id);
                        if (n.link) navigate(n.link);
                        setIsNotifOpen(false);
                      }}
                      className={`pt-2.5 pb-1 px-2 rounded-xl cursor-pointer transition-colors ${
                        !n.isRead ? 'bg-indigo-50/50 hover:bg-indigo-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 block">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsNotifOpen(false);
                    navigate('/partner/notifications');
                  }}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                >
                  View All Notifications <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Provider Profile Menu */}
        <div className="relative" ref={providerRef}>
          <button
            onClick={() => setIsProviderMenuOpen(!isProviderMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all cursor-pointer"
          >
            <img
              src={
                activeProvider?.avatar ||
                'https://images.unsplash.com/photo-1586015555751-63c2c15bdc05?auto=format&fit=crop&w=100&h=100&q=80'
              }
              alt={activeProvider?.name}
              className="h-9 w-9 rounded-xl object-cover border border-slate-200"
            />
            <div className="hidden xl:block text-left">
              <span className="text-xs font-bold text-slate-900 truncate block max-w-36">
                {activeProvider?.name}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {activeProvider?.type} • Operational
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {isProviderMenuOpen && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white p-4 shadow-2xl border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src={activeProvider?.avatar}
                    alt={activeProvider?.name}
                    className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{activeProvider?.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">{activeProvider?.licenseNumber}</p>
                  </div>
                </div>
                <div className="mt-2.5 space-y-1 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{activeProvider?.operationalHours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{activeProvider?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Provider Quick Switch List */}
              <div className="py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Switch Active Facility (Demo)
                </p>
                <div className="space-y-1">
                  {providers.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProviderId(p.id);
                        setIsProviderMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-left transition-colors ${
                        p.id === activeProviderId
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-400" />
                        <span>{p.name}</span>
                      </div>
                      {p.id === activeProviderId && (
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProviderMenuOpen(false);
                    navigate('/partner/settings');
                  }}
                  className="w-full py-2 text-center text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Manage Facility Settings
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
