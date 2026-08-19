import React from 'react';
import { cn } from '@/lib/utils';
import type { PartnerRequestStatus } from '@/types/partner.types';

interface StatusBadgeProps {
  status: PartnerRequestStatus | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  size = 'md',
}) => {
  const normalized = status.toUpperCase().replace(/\s+/g, '_');

  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let label = status;

  switch (normalized) {
    case 'PENDING':
    case 'PENDING_VALIDATION':
    case 'PENDING_COLLECTION':
    case 'WAITING':
      style = 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
      dotColor = 'bg-amber-500 animate-pulse';
      label = normalized === 'PENDING' ? 'Pending Action' : normalized.replace(/_/g, ' ');
      break;

    case 'ACCEPTED':
    case 'CONFIRMED':
    case 'VALIDATED':
      style = 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20';
      dotColor = 'bg-blue-500';
      label = normalized.replace(/_/g, ' ');
      break;

    case 'IN_PROGRESS':
    case 'PROCESSING':
    case 'COLLECTED':
    case 'IN_TRANSIT':
    case 'WITH_DOCTOR':
      style = 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
      dotColor = 'bg-indigo-600 animate-ping';
      label = normalized.replace(/_/g, ' ');
      break;

    case 'COMPLETED':
    case 'DELIVERED':
    case 'RELEASED':
    case 'IN_STOCK':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      dotColor = 'bg-emerald-500';
      label = normalized.replace(/_/g, ' ');
      break;

    case 'CANCELLED':
    case 'REJECTED':
    case 'OUT_OF_STOCK':
      style = 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
      dotColor = 'bg-rose-500';
      label = normalized.replace(/_/g, ' ');
      break;

    case 'LOW_STOCK':
    case 'URGENT':
      style = 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20';
      dotColor = 'bg-orange-500';
      label = normalized.replace(/_/g, ' ');
      break;

    case 'EMERGENCY':
      style = 'bg-red-100 text-red-800 border-red-300 ring-red-500/30 animate-pulse font-bold';
      dotColor = 'bg-red-600';
      label = 'EMERGENCY';
      break;

    default:
      style = 'bg-slate-50 text-slate-700 border-slate-200';
      dotColor = 'bg-slate-400';
      label = status;
  }

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border capitalize tracking-tight shadow-2xs select-none transition-all',
        style,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColor)} />
      <span>{label}</span>
    </span>
  );
};
