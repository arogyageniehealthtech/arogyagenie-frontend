import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin, IndianRupee, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock API Call
const fetchHistory = async () => {
  return [
    { id: '1', orderId: 'DLV-10245', from: 'Apollo Pharmacy', to: 'Salt Lake', distance: 6.4, status: 'DELIVERED', earnings: 85, date: '2026-09-04T14:30:00Z' },
    { id: '2', orderId: 'DLV-10244', from: 'Wellness Meds', to: 'New Town', distance: 3.2, status: 'DELIVERED', earnings: 50, date: '2026-09-04T11:15:00Z' },
    { id: '3', orderId: 'DLV-10241', from: 'City Health', to: 'Rajarhat', distance: 8.1, status: 'CANCELLED', earnings: 0, date: '2026-09-03T09:20:00Z' },
  ];
};

export default function DeliveryHistory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'DELIVERED' | 'CANCELLED'>('ALL');

  const { data: history, isLoading } = useQuery({ queryKey: ['deliveryHistory'], queryFn: fetchHistory });

  const filteredHistory = history?.filter(item => {
    const matchesSearch = item.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Delivery History</h1>
          <p className="text-sm text-slate-500">{history?.filter(h => h.status === 'DELIVERED').length || 0} completed deliveries</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" placeholder="Search by Order ID..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
          />
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {['ALL', 'DELIVERED', 'CANCELLED'].map((f) => (
            <button
              key={f} onClick={() => setFilter(f as any)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-2xl" />)
        ) : filteredHistory?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Filter className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No deliveries found matching your criteria.</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredHistory?.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{item.orderId}</span>
                    {item.status === 'DELIVERED' ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Completed</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <MapPin className="w-4 h-4 text-indigo-400" /> {item.from} <span className="text-slate-300">→</span> {item.to}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    <span>• {item.distance} km</span>
                  </div>
                </div>
                <div className="sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 mt-2 sm:mt-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Earnings</span>
                  <span className={`text-xl font-black ${item.status === 'DELIVERED' ? 'text-emerald-600' : 'text-slate-400 line-through'}`}>
                    ₹{item.earnings}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}