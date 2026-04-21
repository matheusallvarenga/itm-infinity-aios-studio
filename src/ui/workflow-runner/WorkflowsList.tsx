import { useEffect, useState } from 'react';
import * as workflowsSdk from '../../sdk/workflows';
import type { Workflow, WorkflowCategory } from '../../sdk/types';
import { WorkflowCard } from './WorkflowCard';
import { RunDialog } from './RunDialog';
import { WorkflowHistory } from './WorkflowHistory';
import { Skeleton } from '../primitives/Skeleton';

const CATEGORY_LABELS: Record<WorkflowCategory, string> = {
  greenfield: 'Greenfield',
  brownfield: 'Brownfield',
  story: 'Story',
  qa: 'QA',
  research: 'Research',
  other: 'Other',
};

const CATEGORY_ORDER: WorkflowCategory[] = [
  'greenfield',
  'brownfield',
  'story',
  'qa',
  'research',
  'other',
];

export function WorkflowsList() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Workflow | null>(null);
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    workflowsSdk.list().then((res) => {
      if (mounted) {
        setWorkflows(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = workflows.reduce<Record<WorkflowCategory, Workflow[]>>(
    (acc, w) => {
      (acc[w.category] ||= []).push(w);
      return acc;
    },
    {
      greenfield: [],
      brownfield: [],
      story: [],
      qa: [],
      research: [],
      other: [],
    }
  );

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-8">
        {CATEGORY_ORDER.map((cat) => {
          const list = grouped[cat];
          if (!list || list.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="font-display text-sm font-semibold tracking-wide uppercase text-aios-text-secondary mb-3">
                {CATEGORY_LABELS[cat]} ({list.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {list.map((w) => (
                  <WorkflowCard
                    key={w.id}
                    workflow={w}
                    onTrigger={(wf) => {
                      setSelected(wf);
                      setOpen(true);
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <aside className="lg:col-span-1">
        <WorkflowHistory refreshKey={refreshKey} />
      </aside>
      <RunDialog
        workflow={selected}
        open={open}
        onOpenChange={setOpen}
        onTriggered={() => setRefreshKey((k) => k + 1)}
      />
    </div>
  );
}
