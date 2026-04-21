import type { Story } from '../../sdk/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../primitives/Dialog';
import { Badge } from '../primitives/Badge';

export interface StoryDetailProps {
  story: Story | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoryDetail({ story, open, onOpenChange }: StoryDetailProps) {
  if (!story) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {story.epic && <Badge variant="info">{story.epic}</Badge>}
            {story.priority && <Badge>{story.priority}</Badge>}
            <Badge variant="default">{story.status}</Badge>
          </div>
          <DialogTitle>{story.title}</DialogTitle>
          {story.assignee && (
            <DialogDescription>Assignee: @{story.assignee}</DialogDescription>
          )}
        </DialogHeader>

        {story.acceptance_criteria && story.acceptance_criteria.length > 0 && (
          <section className="mb-4">
            <h3 className="text-sm font-semibold text-aios-text-primary mb-2">
              Acceptance Criteria
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-aios-text-secondary">
              {story.acceptance_criteria.map((ac, i) => (
                <li key={i}>{ac}</li>
              ))}
            </ul>
          </section>
        )}

        {story.tasks && story.tasks.length > 0 && (
          <section className="mb-4">
            <h3 className="text-sm font-semibold text-aios-text-primary mb-2">Tasks</h3>
            <ul className="space-y-1 text-sm">
              {story.tasks.map((t) => (
                <li
                  key={t.id}
                  className={
                    t.completed
                      ? 'text-aios-success line-through'
                      : 'text-aios-text-secondary'
                  }
                >
                  {t.completed ? '✓' : '◯'} {t.description}
                </li>
              ))}
            </ul>
          </section>
        )}

        {story.file_list && story.file_list.length > 0 && (
          <section className="mb-2">
            <h3 className="text-sm font-semibold text-aios-text-primary mb-2">Files</h3>
            <ul className="space-y-1 text-xs font-mono text-aios-text-muted">
              {story.file_list.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        )}
      </DialogContent>
    </Dialog>
  );
}
