import React from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  IndianRupee,
  Activity,
} from 'lucide-react';
import { usePartner } from '../context/PartnerContext';
import { StatCard } from '../components/common/StatCard';
import { PartnerSkeleton } from '../components/common/PartnerSkeleton';

export const PartnerAnalyticsPage: React.FC = () => {
  const { analytics, activeProvider, isLoading } = usePartner();

  if (isLoading || !analytics) {
    return <PartnerSkeleton rows={6} type="dashboard" />;
  }

  const maxRequests = Math.max(...analytics.requestTrends.map((t) => t.requests), 1);
  const maxPeakVolume = Math.max(...analytics.peakHours.map((p) => p.volume), 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-indigo-600" />
            Operational Insights & Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Operational efficiency, fulfillment rates, volume trends, and revenue metrics for {activeProvider?.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
            Last 30 Days
          </span>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Monthly Requests"
          value={analytics.kpis.totalRequests}
          subtitle="Processed via AarogyaGenie"
          changePercent={14.8}
          icon={Activity}
          colorScheme="indigo"
        />

        <StatCard
          title="SLA Completion Rate"
          value={`${analytics.kpis.completionRatePercent}%`}
          subtitle="Successfully fulfilled"
          changePercent={2.1}
          icon={CheckCircle2}
          colorScheme="emerald"
        />

        <StatCard
          title="Avg Response Time"
          value={`${analytics.kpis.avgResponseMins}m`}
          subtitle="Acceptance latency"
          changePercent={-8.5}
          icon={Clock}
          colorScheme="blue"
        />

        <StatCard
          title="Gross Revenue"
          value={`₹${analytics.kpis.monthlyRevenue.toLocaleString()}`}
          subtitle="Settled transactions"
          changePercent={16.2}
          icon={IndianRupee}
          colorScheme="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Request Trends Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Request Volume</h3>
              <p className="text-xs text-slate-500">Incoming vs Successfully Completed</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="h-2.5 w-2.5 rounded-xs bg-indigo-600" /> Incoming
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" /> Completed
              </span>
            </div>
          </div>

          <div className="pt-6 pb-2">
            <div className="grid grid-cols-7 gap-3 h-52 items-end">
              {analytics.requestTrends.map((trend) => {
                const reqHeight = Math.round((trend.requests / maxRequests) * 100);
                const compHeight = Math.round((trend.completed / maxRequests) * 100);

                return (
                  <div key={trend.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Incoming bar */}
                      <div
                        style={{ height: `${reqHeight}%` }}
                        className="w-4 sm:w-5 bg-indigo-500 rounded-t-lg transition-all duration-300 group-hover:bg-indigo-600 relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-sm transition-opacity pointer-events-none">
                          {trend.requests}
                        </span>
                      </div>
                      {/* Completed bar */}
                      <div
                        style={{ height: `${compHeight}%` }}
                        className="w-4 sm:w-5 bg-emerald-400 rounded-t-lg transition-all duration-300 group-hover:bg-emerald-500 relative"
                      >
                        <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-sm transition-opacity pointer-events-none">
                          {trend.completed}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{trend.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Service Category Share</h3>
            <p className="text-xs text-slate-500">Distribution by operational modality</p>
          </div>

          <div className="space-y-4 pt-2">
            {analytics.serviceDistribution.map((cat, i) => {
              const colors = [
                'bg-indigo-600 text-indigo-600',
                'bg-teal-500 text-teal-600',
                'bg-amber-500 text-amber-600',
              ];
              const color = colors[i % colors.length];

              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${color.split(' ')[0]}`} />
                      {cat.name}
                    </span>
                    <span className="font-bold text-slate-900">
                      {cat.count} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${cat.percentage}%` }}
                      className={`h-full rounded-full ${color.split(' ')[0]}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Demand Hours Curve (12 cols) */}
        <div className="lg:col-span-12 p-6 rounded-2xl border border-slate-200/90 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Hourly Patient Request Heatmap</h3>
              <p className="text-xs text-slate-500">Peak operational request volume throughout operating hours</p>
            </div>
            <span className="text-xs font-bold text-indigo-600">Peak Slot: 10:00 AM - 12:00 PM</span>
          </div>

          <div className="pt-4 grid grid-cols-4 sm:grid-cols-8 gap-3">
            {analytics.peakHours.map((slot) => {
              const isPeak = slot.volume >= maxPeakVolume * 0.8;

              return (
                <div
                  key={slot.hour}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isPeak
                      ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-500/10'
                      : 'bg-slate-50/70 border-slate-200/70'
                  }`}
                >
                  <span className="text-[11px] font-bold text-slate-500 block">{slot.hour}</span>
                  <span
                    className={`text-lg font-extrabold block mt-1 ${
                      isPeak ? 'text-indigo-700' : 'text-slate-800'
                    }`}
                  >
                    {slot.volume}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">requests</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};

export default PartnerAnalyticsPage;
