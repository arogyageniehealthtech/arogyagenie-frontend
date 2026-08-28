import React, { useState, useMemo } from 'react';
import {
  Bell,
  AlertTriangle,
  ShoppingBag,
  FlaskConical,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePartner } from '../context/PartnerContext';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';
import { PartnerEmptyState } from '../components/common/PartnerEmptyState';
import { Button } from '@/components/ui/button';

export const PartnerNotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, isLoading, markNotifRead, markAllNotifsRead } = usePartner();
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'URGENT'>('ALL');

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === 'UNREAD') return !n.isRead;
      if (filter === 'URGENT') return n.priority === 'HIGH' || n.type === 'URGENT';
      return true;
    });
  }, [notifications, filter]);

  if (isLoading) {
    return <PartnerSkeleton rows={5} />;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_REQUEST':
      case 'URGENT':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'ORDER_UPDATE':
        return <ShoppingBag className="h-5 w-5 text-indigo-600" />;
      case 'LAB_REPORT':
        return <FlaskConical className="h-5 w-5 text-teal-600" />;
      default:
        return <Bell className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-indigo-600" />
            Partner Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational alerts, priority escalations, and system updates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllNotifsRead}
            className="rounded-xl text-xs font-bold"
            leftIcon={<Check className="h-4 w-4 text-indigo-600" />}
          >
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 pb-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>

        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'UNREAD' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({notifications.filter((n) => !n.isRead).length})
        </button>

        <button
          onClick={() => setFilter('URGENT')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'URGENT' ? 'bg-amber-500 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Urgent ({notifications.filter((n) => n.priority === 'HIGH' || n.type === 'URGENT').length})
        </button>
      </div>

      {filtered.length === 0 ? (
        <PartnerEmptyState
          title="No notifications found"
          description="You are completely caught up with all operational alerts."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.isRead
                  ? 'bg-white border-indigo-200/80 shadow-xs ring-1 ring-indigo-500/10'
                  : 'bg-slate-50/50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 ${
                    !n.isRead ? 'bg-indigo-50' : 'bg-slate-100'
                  }`}
                >
                  {getIcon(n.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                    )}
                    {n.priority === 'HIGH' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    {n.timestamp}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!n.isRead && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markNotifRead(n.id)}
                    className="rounded-xl text-xs font-semibold"
                  >
                    Mark Read
                  </Button>
                )}
                {n.link && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      markNotifRead(n.id);
                      navigate(n.link!);
                    }}
                    className="rounded-xl text-xs font-bold"
                    rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    View
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PartnerNotificationsPage;
