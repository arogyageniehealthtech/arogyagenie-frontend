import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, MapPin, IndianRupee, Gift, CheckCircle2 } from 'lucide-react';

const mockNotifications = [
  { id: '1', type: 'REQUEST', title: 'New Delivery Request', desc: 'Pharmacy → Salt Lake (6.4 km)', time: '2 mins ago', read: false },
  { id: '2', type: 'PAYMENT', title: 'Payment Credited', desc: '₹85 added to your wallet for Order #DLV-10245', time: '1 hour ago', read: true },
  { id: '3', type: 'INCENTIVE', title: 'Weekend Bonus Active', desc: 'Complete 10 deliveries today to earn extra ₹200.', time: '5 hours ago', read: true },
];

export default function DeliveryNotifications() {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const { data: notifications, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: async () => mockNotifications });

  const getIcon = (type: string) => {
    switch (type) {
      case 'REQUEST': return <MapPin className="w-5 h-5 text-indigo-500" />;
      case 'PAYMENT': return <IndianRupee className="w-5 h-5 text-emerald-500" />;
      case 'INCENTIVE': return <Gift className="w-5 h-5 text-amber-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const filtered = notifications?.filter(n => filter === 'ALL' || !n.read) || [];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg">Mark all as read</button>
      </div>

      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        {['ALL', 'UNREAD'].map((f) => (
          <button key={f} onClick={() => setFilter(f as any)} className={`px-5 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-2xl" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">You're all caught up!</p>
          </div>
        ) : (
          filtered.map(n => (
            <div key={n.id} className={`p-5 rounded-2xl border flex gap-4 transition-colors cursor-pointer ${n.read ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-indigo-50/50 border-indigo-200/50'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-sm font-bold ${n.read ? 'text-slate-700' : 'text-indigo-900'}`}>{n.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                </div>
                <p className={`text-xs ${n.read ? 'text-slate-500' : 'text-indigo-700/80'}`}>{n.desc}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full self-center" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
}