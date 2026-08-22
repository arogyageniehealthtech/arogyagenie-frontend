import React from 'react';

export const PartnerSkeleton: React.FC<{ rows?: number; type?: 'table' | 'cards' | 'dashboard' }> = ({
  rows = 4,
  type = 'table',
}) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-slate-200/60 p-5 space-y-3">
            <div className="h-4 w-24 bg-slate-300/60 rounded-md" />
            <div className="h-8 w-16 bg-slate-300/80 rounded-lg" />
            <div className="h-3 w-36 bg-slate-300/50 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-slate-200/60" />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-200/60" />
        <div className="h-96 rounded-2xl bg-slate-200/60" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4 animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="h-5 w-36 bg-slate-200 rounded-md" />
        <div className="h-8 w-24 bg-slate-200 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="space-y-1">
                <div className="h-4 w-32 bg-slate-200 rounded-md" />
                <div className="h-3 w-20 bg-slate-100 rounded-md" />
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-200 rounded-full" />
            <div className="h-8 w-20 bg-slate-200 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};
