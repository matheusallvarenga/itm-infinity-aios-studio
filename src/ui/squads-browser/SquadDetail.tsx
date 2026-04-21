import type { Squad } from '../../sdk/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../primitives/Dialog';
import { Badge } from '../primitives/Badge';

export interface SquadDetailProps {
  squad: Squad | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SquadDetail({ squad, open, onOpenChange }: SquadDetailProps) {
  if (!squad) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>{squad.displayName}</DialogTitle>
          <DialogDescription>
            <Badge variant="info">v{squad.version}</Badge>{' '}
            <span className="ml-2">{squad.domain}</span>
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-aios-text-secondary mb-4">{squad.description}</p>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-aios-text-muted min-w-[100px]">Name:</span>
            <code className="font-mono text-aios-primary">{squad.name}</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-aios-text-muted min-w-[100px]">Agents:</span>
            <span className="text-aios-text-primary">{squad.agentCount}</span>
          </div>
          {squad.entryAgent && (
            <div className="flex items-center gap-2">
              <span className="text-aios-text-muted min-w-[100px]">Entry Agent:</span>
              <code className="font-mono text-aios-primary">@{squad.entryAgent}</code>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
