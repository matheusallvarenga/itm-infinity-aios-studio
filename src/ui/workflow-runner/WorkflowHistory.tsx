import { useEffect, useState, useCallback } from 'react';
import type { WorkflowRun } from '../../sdk/types';
import * as workflowsSdk from '../../sdk/workflows';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import { Skeleton } from '../primitives/Skeleton';

export interface WorkflowHistoryProps {
  refreshKey?: number;
}

export function WorkflowHistory({ refreshKey = 0 }: WorkflowHistoryProps) {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await workflowsSdk.getHistory(10);
      setRuns(res);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Runs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : error ? (
          <p className="text-sm text-aios-text-muted">
            Run history unavailable (table may not exist yet).
          </p>
        ) : runs.length === 0 ? (
          <p className="text-sm text-aios-text-muted">No workflow runs yet.</p>
        ) : (
          <ul className="divide-y divide-aios-border/50">
            {runs.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                <div className="min-w-0">
                  <div className="font-mono text-aios-text-primary truncate">
                    {r.workflow_name}
                  </div>
                  <div className="text-xs text-aios-text-muted">
                    {new Date(r.started_at).toLocaleString()}
                  </div>
                </div>
                <Badge
                  variant={
                    r.status === 'completed'
                      ? 'success'
                      : r.status === 'failed'
                        ? 'error'
                        : 'info'
                  }
                >
                  {r.status}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
