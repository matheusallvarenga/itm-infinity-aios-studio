import React from 'react';
import { cn } from '../primitives/utils';

export interface AIOSTopbarProps {
  title: string;
  breadcrumb?: string[];
  actions?: React.ReactNode;
  className?: string;
}

export function AIOSTopbar({ title, breadcrumb, actions, className }: AIOSTopbarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4 min-h-[64px]',
        className
      )}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-aios-text-muted">
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-aios-text-muted/60">/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-aios-text-secondary' : ''}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="font-display text-xl font-semibold text-aios-text-primary truncate">
          {title}
        </h1>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
