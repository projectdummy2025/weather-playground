/**
 * Badge Component
 * Komponen badge untuk menampilkan status atau label
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types/weather';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'safe' | 'caution' | 'danger';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          
          // Variants
          {
            'bg-slate-100 text-slate-700': variant === 'default',
            'bg-green-100 text-green-700': variant === 'safe',
            'bg-yellow-100 text-yellow-700': variant === 'caution',
            'bg-red-100 text-red-700': variant === 'danger',
          },
          
          // Sizes
          {
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-3 py-1 text-sm': size === 'md',
          },
          
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

/**
 * Risk Badge - Badge khusus untuk menampilkan level risiko
 */
export interface RiskBadgeProps extends Omit<BadgeProps, 'variant'> {
  risk: RiskLevel;
  showEmoji?: boolean;
}

const RiskBadge = forwardRef<HTMLSpanElement, RiskBadgeProps>(
  ({ risk, showEmoji = true, className, ...props }, ref) => {
    const variant = risk === 'AMAN' ? 'safe' 
      : risk === 'RISIKO_RINGAN' ? 'caution' 
      : 'danger';
    
    const emoji = risk === 'AMAN' ? '🟢' 
      : risk === 'RISIKO_RINGAN' ? '🟡' 
      : '🔴';
    
    const label = risk === 'AMAN' ? 'Aman' 
      : risk === 'RISIKO_RINGAN' ? 'Waspada' 
      : 'Hindari';
    
    return (
      <Badge
        ref={ref}
        variant={variant}
        className={className}
        {...props}
      >
        {showEmoji && <span className="mr-1">{emoji}</span>}
        {label}
      </Badge>
    );
  }
);

RiskBadge.displayName = 'RiskBadge';

export { Badge, RiskBadge };
