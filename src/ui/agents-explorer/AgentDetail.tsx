import type { Agent } from '../../sdk/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../primitives/Dialog';
import { Badge } from '../primitives/Badge';

export interface AgentDetailProps {
  agent: Agent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentDetail({ agent, open, onOpenChange }: AgentDetailProps) {
  if (!agent) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{agent.icon}</span>
            <div>
              <DialogTitle>
                {agent.displayName}{' '}
                <span className="text-aios-text-muted font-normal text-sm">
                  @{agent.name}
                </span>
              </DialogTitle>
              <DialogDescription>
                <Badge variant="info">{agent.archetype}</Badge>{' '}
                <span className="ml-2">{agent.role}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm text-aios-text-secondary mb-4">{agent.description}</p>

        <section>
          <h3 className="text-sm font-semibold text-aios-text-primary mb-2">Commands</h3>
          <ul className="divide-y divide-aios-border/50">
            {agent.commands.map((cmd) => (
              <li key={cmd.name} className="py-2 flex items-start gap-3">
                <code className="font-mono text-sm text-aios-primary flex-shrink-0">
                  *{cmd.name}
                  {cmd.args ? ` ${cmd.args}` : ''}
                </code>
                <span className="text-sm text-aios-text-secondary">{cmd.description}</span>
              </li>
            ))}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
}
