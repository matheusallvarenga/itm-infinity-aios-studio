import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aios-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-aios-secondary text-white hover:bg-aios-secondary/90 shadow-md active:scale-95',
        outline:
          'border border-aios-border bg-transparent hover:bg-aios-card-bg hover:border-aios-primary/50 text-aios-text-primary',
        ghost:
          'hover:bg-aios-card-bg text-aios-text-primary',
        glowing:
          'bg-aios-bg text-white border border-aios-primary/60 shadow-[0_0_15px_rgba(167,139,250,0.35)] hover:shadow-[0_0_25px_rgba(167,139,250,0.6)] transition-shadow duration-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { buttonVariants };
