import { useQuery } from '@tanstack/react-query';
import { IndianRupee, TrendingUp, Truck, Gift, MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const chartData = [
  { day: 'Mon', earnings: 450 }, { day: 'Tue', earnings: 680 }, { day: 'Wed', earnings: 850 },
  { day: 'Thu', earnings: 1240 }, { day: 'Fri', earnings: 0 }, { day: 'Sat', earnings: 0 }, { day: 'Sun', earnings: 0 }
];

export default function DeliveryEarnings() {
  const { isLoading } = useQuery({ queryKey: ['earnings'], queryFn: async () => ({ today: 1240, week: 7840, month: 28450 }) });

  if (isLoading) return <div className="p-6 animate-pulse bg-slate-200 h-screen" />;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">Earnings Dashboard</h1>
        <p className="text-sm text-slate-500">Track your deliveries and incentives.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
          <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Today's Earnings</p>
          <h2 className="text-4xl font-black">₹1,240</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">This Week</p>
          <h2 className="text-3xl font-bold text-slate-900">₹7,840</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">This Month</p>
          <h2 className="text-3xl font-bold text-slate-900">₹28,450</h2>
        </div>
      </div>

      {/* Chart & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider">Weekly Overview</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="earnings" radius={[6, 6, 6, 6]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.day === 'Thu' ? '#4F46E5' : '#CBD5E1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <StatRow icon={Truck} label="Total Deliveries" value="84" />
          <StatRow icon={TrendingUp} label="Avg. Per Delivery" value="₹93" />
          <StatRow icon={MapPin} label="Total Distance" value="342 km" />
          <StatRow icon={Gift} label="Bonus / Incentives" value="₹450" color="text-emerald-600" />
        </div>
      </div>
    </div>
  );
}

const StatRow = ({ icon: Icon, label, value, color = "text-slate-900" }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><Icon className="w-4 h-4" /></div>
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{label}</span>
    </div>
    <span className={`font-black ${color}`}>{value}</span>
  </div>
);