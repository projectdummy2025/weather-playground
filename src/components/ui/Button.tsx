/**
 * Button Component
 * Komponen tombol dasar dengan berbagai variant
 */

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          
          // Variants
          {
            'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500':
              variant === 'primary',
            'bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-500':
              variant === 'secondary',
            'border border-slate-300 bg-transparent hover:bg-slate-100 focus-visible:ring-slate-500':
              variant === 'outline',
            'bg-transparent hover:bg-slate-100 focus-visible:ring-slate-500':
              variant === 'ghost',
          },
          
          // Sizes — min 44px touch target on mobile
          {
            'h-11 px-3 text-sm': size === 'sm',
            'h-11 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
