import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors';

  const variants = {
    default: 'bg-zinc-800 text-zinc-200 border border-zinc-700',
    success: 'bg-emerald-950 text-emerald-300 border border-emerald-800',
    warning: 'bg-amber-950 text-amber-300 border border-amber-800',
    danger: 'bg-rose-950 text-rose-300 border border-rose-800',
    outline: 'border border-zinc-700 text-zinc-300',
  };

  return <span className={cn(base, variants[variant], className)} {...props} />;
}

