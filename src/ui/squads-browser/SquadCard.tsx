import type { Squad } from '../../sdk/types';
import { Card, CardHeader, CardContent } from '../primitives/Card';
import { Badge } from '../primitives/Badge';

export interface SquadCardProps {
  squad: Squad;
  onClick?: (squad: Squad) => void;
}

export function SquadCard({ squad, onClick }: SquadCardProps) {
  return (
    <Card
      role="button"
      tabIndex={0}
      data-testid="squad-card"
      onClick={() => onClick?.(squad)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(squad);
        }
      }}
      className="cursor-pointer hover:border-aios-primary/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] transition-all"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-display text-base font-semibold text-aios-text-primary truncate">
              {squad.displayName}
            </div>
            <div className="text-xs text-aios-text-muted truncate">{squad.domain}</div>
          </div>
          <Badge variant="info">v{squad.version}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <p className="text-sm text-aios-text-secondary line-clamp-2">
          {squad.description}
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-aios-text-muted">
            {squad.agentCount} {squad.agentCount === 1 ? 'agent' : 'agents'}
          </span>
          {squad.entryAgent && (
            <span className="font-mono text-aios-primary">@{squad.entryAgent}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
