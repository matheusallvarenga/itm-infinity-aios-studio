import React from 'react';
import { cn } from '../primitives/utils';

export interface AIOSLayoutProps {
  topbar: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AIOSLayout({ topbar, sidebar, children, className }: AIOSLayoutProps) {
  return (
    <div
      className={cn(
        'flex h-screen w-screen bg-aios-bg text-aios-text-primary font-sans overflow-hidden',
        className
      )}
    >
      {sidebar && (
        <aside className="w-60 flex-shrink-0 border-r border-aios-border bg-aios-card-bg/50">
          {sidebar}
        </aside>
      )}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="border-b border-aios-border bg-aios-card-bg/50 backdrop-blur-sm">
          {topbar}
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
