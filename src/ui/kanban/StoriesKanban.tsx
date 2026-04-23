import { useEffect, useState, useCallback } from 'react';
import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import type { Story, StoryStatus } from '../../sdk/types';
import * as storiesSdk from '../../sdk/stories';
import { KanbanColumn } from './KanbanColumn';
import { StoryDetail } from './StoryDetail';
import { Skeleton } from '../primitives/Skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/Card';

const COLUMNS: { status: StoryStatus; title: string }[] = [
  { status: 'Draft', title: 'Draft' },
  { status: 'Approved', title: 'Approved' },
  { status: 'InProgress', title: 'In Progress' },
  { status: 'Done', title: 'Done' },
];

export function StoriesKanban() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Story | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await storiesSdk.list();
      setStories(res);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as StoryStatus;
    const storyId = active.id as string;
    const existing = stories.find((s) => s.id === storyId);
    if (!existing || existing.status === newStatus) return;

    // Optimistic update
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, status: newStatus } : s))
    );

    try {
      await storiesSdk.updateStatus(storyId, newStatus);
    } catch (err: unknown) {
      // Revert on failure
      setStories((prev) =>
        prev.map((s) => (s.id === storyId ? { ...s, status: existing.status } : s))
      );
      setError(err instanceof Error ? err.message : 'Failed to update story status');
    }
  };

  const handleCardClick = (story: Story) => {
    setSelected(story);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-4 gap-4" data-testid="kanban-loading">
        {COLUMNS.map((c) => (
          <Skeleton key={c.status} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Stories unavailable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-aios-text-secondary mb-3">
              Could not load stories: <span className="text-aios-error">{error}</span>
            </p>
            <p className="text-sm text-aios-text-muted">
              If the table <code className="font-mono">aios_stories</code> does not exist yet,
              run the Phase 4 migration to create it.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              title={col.title}
              stories={stories.filter((s) => s.status === col.status)}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      </DndContext>
      <StoryDetail story={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
