import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changePercent?: number;
  icon: LucideIcon;
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'blue' | 'purple' | 'rose';
  onClick?: () => void;
  className?: string;
  highlightBadge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  changePercent,
  icon: Icon,
  colorScheme = 'indigo',
  onClick,
  className,
  highlightBadge,
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50/70 hover:bg-indigo-50 border-indigo-100',
      iconBg: 'bg-indigo-600 text-white shadow-indigo-200',
      text: 'text-indigo-900',
      accent: 'text-indigo-600',
    },
    emerald: {
      bg: 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-100',
      iconBg: 'bg-emerald-600 text-white shadow-emerald-200',
      text: 'text-emerald-900',
      accent: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50/70 hover:bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-500 text-white shadow-amber-200',
      text: 'text-amber-900',
      accent: 'text-amber-600',
    },
    blue: {
      bg: 'bg-blue-50/70 hover:bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-600 text-white shadow-blue-200',
      text: 'text-blue-900',
      accent: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50/70 hover:bg-purple-50 border-purple-100',
      iconBg: 'bg-purple-600 text-white shadow-purple-200',
      text: 'text-purple-900',
      accent: 'text-purple-600',
    },
    rose: {
      bg: 'bg-rose-50/70 hover:bg-rose-50 border-rose-100',
      iconBg: 'bg-rose-600 text-white shadow-rose-200',
      text: 'text-rose-900',
      accent: 'text-rose-600',
    },
  };

  const scheme = colorMap[colorScheme];

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/90 shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {value}
            </h3>
            {highlightBadge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                {highlightBadge}
              </span>
            )}
          </div>
        </div>

        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm shrink-0 transition-transform group-hover:scale-105',
            scheme.iconBg
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={2.2} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs">
        {subtitle && <span className="text-slate-500 font-medium">{subtitle}</span>}
        {changePercent !== undefined && (
          <span
            className={cn(
              'font-bold inline-flex items-center gap-0.5',
              changePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'
            )}
          >
            {changePercent >= 0 ? '↑ +' : '↓ '}
            {Math.abs(changePercent)}%
            <span className="font-normal text-slate-400 ml-1">vs last week</span>
          </span>
        )}
      </div>
    </div>
  );
};
