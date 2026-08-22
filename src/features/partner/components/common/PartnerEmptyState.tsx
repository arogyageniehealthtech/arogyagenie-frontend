import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PartnerEmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const PartnerEmptyState: React.FC<PartnerEmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/40 ${
        className || ''
      }`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xs border border-slate-200/80 text-slate-400 mb-4">
        <Icon className="h-8 w-8 text-indigo-500/80" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-bold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-5 rounded-xl">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
