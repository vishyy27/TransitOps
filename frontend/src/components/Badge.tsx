import React from 'react';
import { cn } from '../lib/utils';

interface BadgeProps {
  status: string;
}

export function Badge({ status }: BadgeProps) {
  let colorClass = "bg-sage/15 text-sage";
  let dotClass = "bg-sage";

  if (status === 'On Trip' || status === 'Active' || status === 'Dispatched') {
    colorClass = "bg-ink/10 text-ink";
    dotClass = "bg-ink";
  } else if (status === 'In Shop' || status === 'Suspended') {
    colorClass = "bg-rust/15 text-rust";
    dotClass = "bg-rust";
  } else if (status === 'Retired' || status === 'Cancelled') {
    colorClass = "bg-accent/15 text-accent";
    dotClass = "bg-accent";
  } else if (status === 'Completed' || status === 'Available') {
    colorClass = "bg-sage/15 text-sage";
    dotClass = "bg-sage";
  } else if (status === 'Draft' || status === 'Closed') {
    colorClass = "bg-sage/30 text-ink/80";
    dotClass = "bg-sage";
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
      colorClass
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotClass)} />
      {status}
    </span>
  );
}
