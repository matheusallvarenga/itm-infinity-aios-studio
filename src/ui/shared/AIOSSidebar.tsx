import { Icon } from '../primitives/Icon';
import { cn } from '../primitives/utils';

export type AIOSView =
  | 'dashboard'
  | 'stories'
  | 'agents'
  | 'squads'
  | 'workflows';

interface NavItem {
  id: AIOSView;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'HomeSimple' },
  { id: 'stories', label: 'Stories', icon: 'ViewColumns2' },
  { id: 'agents', label: 'Agents', icon: 'Group' },
  { id: 'squads', label: 'Squads', icon: 'MultiplePages' },
  { id: 'workflows', label: 'Workflows', icon: 'NetworkReverse' },
];

export interface AIOSSidebarProps {
  current: AIOSView;
  onSelect: (view: AIOSView) => void;
  className?: string;
}

export function AIOSSidebar({ current, onSelect, className }: AIOSSidebarProps) {
  return (
    <nav
      className={cn(
        'flex h-full flex-col gap-1 px-3 py-4 text-sm',
        className
      )}
      aria-label="Primary navigation"
    >
      <div className="px-3 pb-6 pt-1">
        <div className="font-display text-lg font-bold tracking-tight text-aios-primary">
          AIOS Studio
        </div>
        <div className="text-xs text-aios-text-muted">v0.1.0</div>
      </div>
      {NAV_ITEMS.map((item) => {
        const active = current === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 transition-colors text-left',
              active
                ? 'bg-aios-secondary/20 text-aios-primary font-semibold'
                : 'text-aios-text-secondary hover:bg-aios-card-bg hover:text-aios-text-primary'
            )}
          >
            <Icon name={item.icon} size="md" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
