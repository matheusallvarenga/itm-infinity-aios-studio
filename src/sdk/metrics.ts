import { getAIOSClient } from '../lib/supabase';
import type { MetricsOverview, MetricsTrendPoint, AgentPerformance } from './types';

/**
 * Compute duration in ms from two ISO timestamp strings.
 * Returns 0 if either value is missing.
 */
function computeDuration(startedAt: string | null, completedAt: string | null): number {
  if (!startedAt || !completedAt) return 0;
  return Math.max(0, new Date(completedAt).getTime() - new Date(startedAt).getTime());
}

/**
 * Get aggregate metrics overview for a time period.
 *
 * Reads from `aios_workflow_runs` as a semantic proxy.
 * See ADR-003 for the full column mapping and rationale.
 * NOTE: totalCost and totalTokens always return 0 until the
 * unified_executions pipeline is implemented (v0.3 backlog).
 */
export async function getOverview(
  period: { start?: string; end?: string } = {}
): Promise<MetricsOverview> {
  const client = getAIOSClient();
  const start =
    period.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const end = period.end || new Date().toISOString();

  const { data, error } = await client
    .from('aios_workflow_runs')
    .select('status, started_at, completed_at')
    .gte('started_at', start)
    .lte('started_at', end);

  if (error) {
    throw { code: 'OVERVIEW_QUERY_FAILED', message: error.message, cause: error };
  }

  const rows = (data as Array<Record<string, unknown>> | null) || [];
  const total = rows.length;
  const successful = rows.filter((r) => r.status === 'completed').length;
  const failed = rows.filter((r) => r.status === 'failed').length;
  const active = rows.filter((r) => r.status === 'running').length;

  const durationsMs = rows
    .map((r) => computeDuration(r.started_at, r.completed_at))
    .filter((d) => d > 0);

  return {
    totalExecutions: total,
    successfulExecutions: successful,
    failedExecutions: failed,
    successRate: total ? successful / total : 0,
    avgDuration: durationsMs.length
      ? durationsMs.reduce((s, d) => s + d, 0) / durationsMs.length
      : 0,
    totalCost: 0,    // ADR-003: not tracked in aios_workflow_runs
    totalTokens: 0,  // ADR-003: not tracked in aios_workflow_runs
    activeJobs: active,
    period: { start, end },
  };
}

/**
 * Get time-series trend data for visualization.
 * Bucketed by day by default.
 * See ADR-003 for column mapping from unified_executions → aios_workflow_runs.
 */
export async function getTrends(
  period: {
    start?: string;
    end?: string;
    granularity?: 'hour' | 'day' | 'week';
  } = {}
): Promise<MetricsTrendPoint[]> {
  const client = getAIOSClient();
  const start =
    period.start || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const end = period.end || new Date().toISOString();

  const { data, error } = await client
    .from('aios_workflow_runs')
    .select('started_at, status, completed_at')
    .gte('started_at', start)
    .lte('started_at', end)
    .order('started_at', { ascending: true });

  if (error) {
    throw { code: 'TRENDS_QUERY_FAILED', message: error.message, cause: error };
  }

  const rows = (data as Array<Record<string, unknown>> | null) || [];
  const buckets = new Map<
    string,
    { executions: number; errors: number; latencies: number[]; cost: number }
  >();

  for (const r of rows) {
    const day = String(r.started_at).slice(0, 10);
    if (!buckets.has(day)) {
      buckets.set(day, { executions: 0, errors: 0, latencies: [], cost: 0 });
    }
    const b = buckets.get(day)!;
    b.executions++;
    if (r.status !== 'completed') b.errors++;
    const duration = computeDuration(r.started_at, r.completed_at);
    if (duration > 0) b.latencies.push(duration);
    // cost: 0 — not tracked in aios_workflow_runs (ADR-003)
  }

  return Array.from(buckets.entries()).map(([day, b]) => ({
    timestamp: day,
    executions: b.executions,
    errors: b.errors,
    avgLatency: b.latencies.length
      ? b.latencies.reduce((s, l) => s + l, 0) / b.latencies.length
      : 0,
    cost: b.cost,
  }));
}

/**
 * Get top workflows by execution volume (sampled from last 1000 runs).
 *
 * Semantic proxy via ADR-003:
 *   agentId   → workflow_name (grouped by)
 *   agentName → workflow_name
 * Returns AgentPerformance shape for API backward compatibility.
 */
export async function getTopAgents(limit: number = 10): Promise<AgentPerformance[]> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from('aios_workflow_runs')
    .select('workflow_name, triggered_by, status, started_at, completed_at')
    .order('started_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw { code: 'TOP_AGENTS_QUERY_FAILED', message: error.message, cause: error };
  }

  const rows = (data as Array<Record<string, unknown>> | null) || [];
  const workflowMap = new Map<string, { runs: typeof rows }>();

  for (const r of rows) {
    const name = r.workflow_name || 'unknown';
    if (!workflowMap.has(name)) {
      workflowMap.set(name, { runs: [] });
    }
    workflowMap.get(name)!.runs.push(r);
  }

  return Array.from(workflowMap.entries())
    .map(([name, { runs }]) => ({
      agentId: name,
      agentName: name,
      executions: runs.length,
      successRate: runs.filter((r) => r.status === 'completed').length / runs.length,
      avgDuration:
        runs
          .map((r) => computeDuration(r.started_at, r.completed_at))
          .reduce((s, d) => s + d, 0) / runs.length,
      avgTokens: 0, // ADR-003: not tracked in aios_workflow_runs
    }))
    .sort((a, b) => b.executions - a.executions)
    .slice(0, limit);
}
