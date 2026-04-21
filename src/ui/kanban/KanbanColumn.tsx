import { useDroppable } from '@dnd-kit/core';
import type { Story, StoryStatus } from '../../sdk/types';
import { StoryCard } from './StoryCard';
import { cn } from '../primitives/utils';

export interface KanbanColumnProps {
  status: StoryStatus;
  title: string;
  stories: Story[];
  onCardClick?: (story: Story) => void;
}

export function KanbanColumn({ status, title, stories, onCardClick }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex flex-col min-w-[260px] flex-1 gap-3">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-display text-sm font-semibold tracking-wide text-aios-text-primary uppercase">
          {title}
        </h3>
        <span className="text-xs text-aios-text-muted bg-aios-card-bg rounded-full px-2 py-0.5">
          {stories.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        data-testid={`kanban-col-${status}`}
        className={cn(
          'flex flex-col gap-2 rounded-lg border border-dashed border-aios-border/50 bg-aios-card-bg/30 p-2 min-h-[300px] transition-colors',
          isOver && 'border-aios-primary bg-aios-secondary/10'
        )}
      >
        {stories.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-xs text-aios-text-muted py-6">
            No stories
          </div>
        ) : (
          stories.map((s) => <StoryCard key={s.id} story={s} onClick={onCardClick} />)
        )}
      </div>
    </div>
  );
}
