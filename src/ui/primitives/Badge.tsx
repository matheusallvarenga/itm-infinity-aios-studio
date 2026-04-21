import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-aios-secondary/20 text-aios-primary',
        success:
          'border-transparent bg-aios-success/20 text-aios-success',
        warning:
          'border-transparent bg-aios-warning/20 text-aios-warning',
        error:
          'border-transparent bg-aios-error/20 text-aios-error',
        info:
          'border-transparent bg-aios-info/20 text-aios-info',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
