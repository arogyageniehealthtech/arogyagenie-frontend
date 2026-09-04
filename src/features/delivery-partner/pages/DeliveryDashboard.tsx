import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Loader2, AlertCircle, Zap, ArrowUpRight, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { deliveryApi } from '../api/deliveryApi.ts';
import { toggleOnlineStatus } from '@/store/slices/deliverySlice';
import toast from 'react-hot-toast';

const chartData = [
  { day: 'Mon', val: 450 }, { day: 'Tue', val: 680 }, { day: 'Wed', val: 850 },
  { day: 'Thu', val: 1240 }, { day: 'Fri', val: 920 }, { day: 'Sat', val: 1450 }, { day: 'Sun', val: 1100 }
];

export default function DeliveryDashboard() {
  const dispatch = useDispatch();
  const isOnline = useSelector((s: any) => s.delivery?.isOnline || false);

  // Fetch real profile data from API
  const { data: proRes, isLoading: l1 } = useQuery({ 
    queryKey: ['pro'], 
    queryFn: deliveryApi.getProfile 
  });
  
  const pro = proRes?.data || { name: 'Partner', partnerId: 'DP-8849', totalDeliveries: 84, rating: 4.8 };

  const { data: ern, isLoading: l2 } = useQuery({ 
    queryKey: ['ern'], queryFn: async () => ({ today: 1240, week: 7840, month: 28450, dist: 342, avg: 93, bonus: 450 }) 
  });

  const handleToggleStatus = async () => {
    const newStatus = isOnline ? 'OFFLINE' : 'AVAILABLE';
    try {
      await deliveryApi.updateStatus(newStatus);
      dispatch(toggleOnlineStatus());
    } catch (error) {
      // Fallback for mock mode testing
      dispatch(toggleOnlineStatus());
      toast.success(`Mock: You are now ${newStatus}`);
    }
  };

  if (l1 || l2) return <div className="flex h-dvh items-center justify-center bg-[#F0F6FF]"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>;

  return (
    <div className="h-dvh max-w-6xl mx-auto flex flex-col gap-3 p-3 sm:p-4 bg-[#F0F6FF] overflow-hidden box-border text-slate-800 font-sans">
      
      {/* 1. Header & Quick Status Bar */}
      <div className="shrink-0 flex justify-between items-center bg-white/80 backdrop-blur-xl p-3 sm:p-3.5 rounded-2xl shadow-sm border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-black uppercase">
            {pro.name?.[0]}
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-tight flex items-center gap-1.5">
              {pro.name} <span className={`w-2 h-2 rounded-full inline-block ${isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">ID: #{pro.partnerId}</p>
          </div>
        </div>

        <button 
          onClick={handleToggleStatus} 
          className={`relative px-5 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 overflow-hidden transition-all shadow-sm ${isOnline ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-200 text-slate-700 border border-slate-300'}`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="z-10 tracking-wider uppercase">{isOnline ? 'Online' : 'Offline'}</span>
          {isOnline && <motion.div layoutId="obg" className="absolute inset-0 bg-emerald-400/20" />}
        </button>
      </div>

      {/* Offline Alert */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="shrink-0">
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm backdrop-blur-md">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" /> You are offline. Switch online to receive delivery requests.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Compact High-Level Stats Strip */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {[
          { l: "Today's Earnings", v: `₹${ern?.today?.toLocaleString()}`, badge: "+14%", color: "text-blue-600", bg: "from-blue-50 to-indigo-50/50 border-blue-100" },
          { l: "Weekly Payout", v: `₹${ern?.week?.toLocaleString()}`, badge: "Stable", color: "text-slate-900", bg: "from-white to-blue-50/30 border-blue-50" },
          { l: "Total Deliveries", v: pro.totalDeliveries || "0", badge: "On Track", color: "text-slate-900", bg: "from-white to-blue-50/30 border-blue-50" },
          { l: "Partner Rating", v: `${pro.rating || 'N/A'} ★`, badge: "Top 5%", color: "text-amber-600", bg: "from-white to-blue-50/30 border-blue-50" }
        ].map((x, i) => (
          <div key={i} className={`bg-linear-to-br ${x.bg} backdrop-blur-xl border p-3 rounded-2xl shadow-sm flex justify-between items-center`}>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{x.l}</p>
              <h2 className={`text-base sm:text-lg font-black tracking-tight mt-0.5 ${x.color}`}>{x.v}</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100/60 text-blue-700 border border-blue-200/50">{x.badge}</span>
          </div>
        ))}
      </div>

      {/* 3. Main Data Management Grid */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3">
        
        {/* Weekly Trend Analytics Chart - Modern Split Header & Glassmorphism Card */}
        <div className="flex-1 min-h-0 bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 text-white backdrop-blur-xl border border-blue-900/60 p-4 sm:p-5 rounded-2xl shadow-md flex flex-col justify-between">
          
          {/* Redesigned Header: Left Title + Right Floating Summary Badge */}
          <div className="flex items-center justify-between shrink-0 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black tracking-wide text-white uppercase">Revenue Trend</h3>
                <p className="text-[10px] text-blue-300 font-medium">Performance over past 7 days</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <div className="text-right">
                <span className="text-[9px] font-bold text-blue-300 uppercase block leading-none">Peak Day</span>
                <span className="text-xs font-black text-white">Sat (₹1,450)</span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Expanded Chart Space */}
          <div className="flex-1 min-h-0 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, left: -25, right: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={5} />
                <Tooltip cursor={{ stroke: '#38BDF8', strokeWidth: 1 }} contentStyle={{ backgroundColor: '#0F172A', borderRadius: '12px', border: '1px solid #334155', fontSize: '12px', padding: '6px 10px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }} />
                <Area type="monotone" dataKey="val" stroke="#38BDF8" strokeWidth={3.5} fillOpacity={1} fill="url(#colorValNew)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Granular Management Metrics Panel */}
        <div className="shrink-0 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:w-64">
          {[
            { l: "Avg / Order", v: `₹${ern?.avg}`, sub: "Optimized" },
            { l: "Distance Covered", v: `${ern?.dist} km`, sub: "Efficient" },
            { l: "Incentive Bonus", v: `₹${ern?.bonus}`, sub: "Unlocked", c: "text-emerald-600" },
            { l: "Monthly Payout", v: `₹${ern?.month?.toLocaleString()}`, sub: "Target Met" }
          ].map((x, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-xl border border-blue-100 p-2.5 sm:p-3 rounded-2xl flex justify-between items-center shadow-sm">
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block truncate">{x.l}</span>
                <span className="text-[9px] text-slate-400 font-semibold">{x.sub}</span>
              </div>
              <span className={`text-xs sm:text-sm font-black pl-2 ${x.c || 'text-slate-900'}`}>{x.v}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}