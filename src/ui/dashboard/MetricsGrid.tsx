import { useEffect, useState } from 'react';
import * as metricsSdk from '../../sdk/metrics';
import type { MetricsOverview } from '../../sdk/types';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import { Skeleton } from '../primitives/Skeleton';

interface KPI {
  label: string;
  value: string;
  badge?: { label: string; variant: 'success' | 'warning' | 'error' | 'info' };
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

function formatCost(cost: number): string {
  return `$${cost.toFixed(2)}`;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return `${n}`;
}

function toKPIs(overview: MetricsOverview): KPI[] {
  const pct = Math.round(overview.successRate * 100);
  const variant: KPI['badge'] = pct >= 95
    ? { label: `${pct}%`, variant: 'success' }
    : pct >= 80
      ? { label: `${pct}%`, variant: 'warning' }
      : { label: `${pct}%`, variant: 'error' };
  return [
    { label: 'Total Executions', value: String(overview.totalExecutions) },
    { label: 'Success Rate', value: `${pct}%`, badge: variant },
    { label: 'Avg Duration', value: formatDuration(overview.avgDuration) },
    { label: 'Total Cost', value: formatCost(overview.totalCost) },
    { label: 'Total Tokens', value: formatTokens(overview.totalTokens) },
    { label: 'Active Jobs', value: String(overview.activeJobs) },
  ];
}

export function MetricsGrid() {
  const [overview, setOverview] = useState<MetricsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    metricsSdk
      .getOverview()
      .then((res) => {
        if (mounted) {
          setOverview(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || 'Failed to load metrics');
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        data-testid="metrics-grid-skeleton"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-aios-error text-sm">Failed to load metrics: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!overview) return null;

  const kpis = toKPIs(overview);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kpis.map((kpi) => (
        <Card key={kpi.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-aios-text-secondary font-sans font-normal">
              {kpi.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-semibold text-aios-text-primary">
                {kpi.value}
              </span>
              {kpi.badge && <Badge variant={kpi.badge.variant}>{kpi.badge.label}</Badge>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
