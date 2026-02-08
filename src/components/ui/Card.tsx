/**
 * Card Component
 * Komponen kartu untuk membungkus konten
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl bg-white p-4 transition-shadow duration-200',
          {
            // Default: subtle depth with inner highlight
            'shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] border border-slate-200/60': variant === 'default',
            // Elevated: stronger shadow, softer border
            'shadow-[0_4px_20px_rgba(0,0,0,0.08),0_8px_32px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] border border-slate-200/40': variant === 'elevated',
            // Bordered: clear border with very subtle shadow
            'border border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)]': variant === 'bordered',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mb-3', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-lg font-semibold text-slate-900', className)}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-slate-700', className)}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
