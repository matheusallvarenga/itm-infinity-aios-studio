import React from 'react';
import * as Iconoir from 'iconoir-react';
import { cn } from './utils';

const sizeMap: Record<string, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export interface IconProps extends Omit<React.SVGAttributes<SVGSVGElement>, 'ref'> {
  /**
   * PascalCase Iconoir name (e.g. 'HomeSimple', 'Settings', 'ViewGrid')
   * Falls back to QuestionMarkCircle if not found.
   */
  name: string;
  size?: keyof typeof sizeMap | string;
  label?: string;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 'md',
  className,
  label,
  strokeWidth = 1.5,
  ...props
}: IconProps) {
  const iconoirAny = Iconoir as unknown as Record<string, React.ComponentType<any>>;
  const IconComponent =
    iconoirAny[name] || iconoirAny.QuestionMarkCircle || iconoirAny.Circle;

  const sizeClass = sizeMap[size] || size;

  if (!IconComponent) {
    return (
      <span
        aria-label={label}
        role={label ? 'img' : undefined}
        className={cn('inline-block', sizeClass, className)}
      />
    );
  }

  return (
    <IconComponent
      className={cn(sizeClass, className)}
      aria-hidden={label ? undefined : 'true'}
      aria-label={label}
      role={label ? 'img' : undefined}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
