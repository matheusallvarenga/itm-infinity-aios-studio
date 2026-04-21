import type { Agent } from '../../sdk/types';
import { Card, CardHeader, CardContent } from '../primitives/Card';
import { Badge } from '../primitives/Badge';

export interface AgentCardProps {
  agent: Agent;
  onClick?: (agent: Agent) => void;
}

export function AgentCard({ agent, onClick }: AgentCardProps) {
  return (
    <Card
      data-testid="agent-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(agent)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(agent);
        }
      }}
      className="cursor-pointer hover:border-aios-primary/50 hover:shadow-[0_0_20px_rgba(167,139,250,0.2)] transition-all"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl flex-shrink-0">{agent.icon}</span>
            <div className="min-w-0">
              <div className="font-display text-base font-semibold text-aios-text-primary truncate">
                {agent.displayName}
              </div>
              <div className="text-xs text-aios-text-muted truncate">@{agent.name}</div>
            </div>
          </div>
          <Badge variant="info">{agent.archetype}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        <p className="text-sm text-aios-text-secondary line-clamp-2">{agent.role}</p>
        <div className="flex flex-wrap gap-1.5">
          {agent.commands.slice(0, 3).map((cmd) => (
            <span
              key={cmd.name}
              className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-mono bg-aios-border/50 text-aios-text-secondary"
            >
              *{cmd.name}
            </span>
          ))}
          {agent.commands.length > 3 && (
            <span className="text-xs text-aios-text-muted">
              +{agent.commands.length - 3}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
