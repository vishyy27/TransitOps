import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  status?: string;
  variant?: 'success' | 'warning' | 'destructive' | 'default';
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ status, variant, className, children }: BadgeProps) {
  const label = children ?? status ?? '';
  let colorClass = "bg-blue-500/20 text-blue-400";
  let dotClass = "bg-blue-400";

  if (variant === 'success' || status === 'On Trip' || status === 'Active' || status === 'Dispatched') {
    colorClass = "bg-emerald-500/20 text-emerald-400";
    dotClass = "bg-emerald-400";
  } else if (variant === 'warning' || status === 'In Shop' || status === 'Suspended') {
    colorClass = "bg-amber-500/20 text-amber-400";
    dotClass = "bg-amber-400";
  } else if (variant === 'destructive' || status === 'Retired' || status === 'Cancelled') {
    colorClass = "bg-rose-500/20 text-rose-400";
    dotClass = "bg-rose-400";
  } else if (status === 'Completed' || status === 'Available') {
    colorClass = "bg-blue-500/20 text-blue-400";
    dotClass = "bg-blue-400";
  } else if (status === 'Draft' || status === 'Closed') {
    colorClass = "bg-slate-500/20 text-slate-400";
    dotClass = "bg-blue-400";
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
      colorClass, className
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClass)} />
      {label}
    </span>
  );
}
