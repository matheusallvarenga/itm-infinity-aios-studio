import { useEffect, useState } from 'react';
import * as metricsSdk from '../../sdk/metrics';
import type { AgentPerformance } from '../../sdk/types';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import { Skeleton } from '../primitives/Skeleton';

export function TopAgentsCard() {
  const [agents, setAgents] = useState<AgentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    metricsSdk
      .getTopAgents(5)
      .then((res) => {
        if (mounted) {
          setAgents(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || 'Failed to load');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Agents</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-aios-error text-sm">Error: {error}</div>
        ) : agents.length === 0 ? (
          <div className="text-aios-text-muted text-sm">No agent activity yet.</div>
        ) : (
          <ul className="space-y-2">
            {agents.map((a) => {
              const pct = Math.round(a.successRate * 100);
              return (
                <li
                  key={a.agentId}
                  className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-aios-border/40 transition"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-aios-text-primary text-sm">
                      {a.agentName}
                    </span>
                    <span className="text-xs text-aios-text-muted">
                      {a.executions} runs
                    </span>
                  </div>
                  <Badge
                    variant={pct >= 95 ? 'success' : pct >= 80 ? 'warning' : 'error'}
                  >
                    {pct}%
                  </Badge>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
