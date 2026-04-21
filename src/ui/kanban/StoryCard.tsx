import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Story } from '../../sdk/types';
import { Card, CardContent } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import { cn } from '../primitives/utils';

const PRIORITY_MAP: Record<NonNullable<Story['priority']>, { label: string; variant: 'info' | 'warning' | 'error' | 'default' }> = {
  low: { label: 'Low', variant: 'info' },
  medium: { label: 'Medium', variant: 'default' },
  high: { label: 'High', variant: 'warning' },
  critical: { label: 'Critical', variant: 'error' },
};

export interface StoryCardProps {
  story: Story;
  onClick?: (story: Story) => void;
}

export function StoryCard({ story, onClick }: StoryCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: story.id,
  });

  const priority = story.priority && PRIORITY_MAP[story.priority];

  return (
    <Card
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
      }}
      className={cn(
        'cursor-grab active:cursor-grabbing hover:border-aios-primary/50 transition-colors',
        isDragging && 'ring-2 ring-aios-primary'
      )}
      {...attributes}
      {...listeners}
    >
      <CardContent className="space-y-2 p-4">
        <div
          className="font-semibold text-sm text-aios-text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(story);
          }}
        >
          {story.title}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {story.epic && <Badge variant="info">{story.epic}</Badge>}
          {priority && <Badge variant={priority.variant}>{priority.label}</Badge>}
          {story.assignee && (
            <span className="text-aios-text-muted">@{story.assignee}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
