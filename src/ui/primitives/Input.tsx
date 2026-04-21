import React from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-aios-text-primary"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex h-10 w-full rounded-md border border-aios-border bg-aios-bg px-3 py-2 text-sm text-aios-text-primary placeholder:text-aios-text-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aios-primary focus-visible:ring-offset-2 focus-visible:ring-offset-aios-bg',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-aios-error',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-aios-error">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-aios-text-primary"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-aios-border bg-aios-bg px-3 py-2 text-sm text-aios-text-primary placeholder:text-aios-text-muted',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aios-primary focus-visible:ring-offset-2 focus-visible:ring-offset-aios-bg',
            error && 'border-aios-error',
            className
          )}
          {...props}
        />
        {error && <span className="text-xs text-aios-error">{error}</span>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
