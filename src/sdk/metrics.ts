import { getAIOSClient } from '../lib/supabase';
import type { MetricsOverview, MetricsTrendPoint, AgentPerformance } from './types';

/**
 * Get aggregate metrics overview for a time period.
 * Reads from `unified_metrics` table first, falling back to computing
 * from `unified_executions` if no aggregated row is available.
 */
export async function getOverview(
  period: { start?: string; end?: string } = {}
): Promise<MetricsOverview> {
  const client = getAIOSClient();
  const start =
    period.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const end = period.end || new Date().toISOString();

  // Try unified_metrics (aggregated) first
  const metricsRes = await client
    .from('unified_metrics')
    .select('*')
    .gte('period_start', start)
    .lte('period_end', end)
    .order('period_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  const metricsData = metricsRes.data as Record<string, any> | null;
  const metricsErr = metricsRes.error;

  if (metricsData && !metricsErr) {
    return {
      totalExecutions: metricsData.total_executions || 0,
      successfulExecutions: metricsData.successful_executions || 0,
      failedExecutions: metricsData.failed_executions || 0,
      successRate: metricsData.success_rate || 0,
      avgDuration: metricsData.avg_duration || 0,
      totalCost: metricsData.total_cost || 0,
      totalTokens: metricsData.total_tokens || 0,
      activeJobs: metricsData.active_jobs || 0,
      period: { start, end },
    };
  }

  // Fallback: compute from unified_executions
  const execsRes = await client
    .from('unified_executions')
    .select('status, duration_ms, tokens, cost')
    .gte('created_at', start)
    .lte('created_at', end);

  const execs = (execsRes.data as Array<Record<string, any>> | null) || [];
  const total = execs.length;
  const successful = execs.filter((e) => e.status === 'success').length;

  return {
    totalExecutions: total,
    successfulExecutions: successful,
    failedExecutions: total - successful,
    successRate: total ? successful / total : 0,
    avgDuration: total
      ? execs.reduce((s, e) => s + (e.duration_ms || 0), 0) / total
      : 0,
    totalCost: execs.reduce((s, e) => s + (e.cost || 0), 0),
    totalTokens: execs.reduce((s, e) => s + (e.tokens || 0), 0),
    activeJobs: 0,
    period: { start, end },
  };
}

/**
 * Get time-series trend data for visualization.
 * Bucketed by day by default.
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
    .from('unified_executions')
    .select('created_at, status, duration_ms, cost')
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: true });

  if (error) {
    throw { code: 'TRENDS_QUERY_FAILED', message: error.message, cause: error };
  }

  const rows = (data as Array<Record<string, any>> | null) || [];
  const buckets = new Map<
    string,
    { executions: number; errors: number; latencies: number[]; cost: number }
  >();

  for (const e of rows) {
    const day = String(e.created_at).slice(0, 10);
    if (!buckets.has(day)) {
      buckets.set(day, { executions: 0, errors: 0, latencies: [], cost: 0 });
    }
    const b = buckets.get(day)!;
    b.executions++;
    if (e.status !== 'success') b.errors++;
    if (e.duration_ms) b.latencies.push(e.duration_ms);
    b.cost += e.cost || 0;
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
 * Get top agents by execution volume (sampled from last 1000 executions).
 */
export async function getTopAgents(limit: number = 10): Promise<AgentPerformance[]> {
  const client = getAIOSClient();
  const { data, error } = await client
    .from('unified_executions')
    .select('agent_id, agent_name, status, duration_ms, tokens')
    .order('created_at', { ascending: false })
    .limit(1000);

  if (error) {
    throw { code: 'TOP_AGENTS_QUERY_FAILED', message: error.message, cause: error };
  }

  const rows = (data as Array<Record<string, any>> | null) || [];
  const agentMap = new Map<
    string,
    { name: string; execs: Array<Record<string, any>> }
  >();

  for (const e of rows) {
    const id = e.agent_id || 'unknown';
    if (!agentMap.has(id)) {
      agentMap.set(id, { name: e.agent_name || id, execs: [] });
    }
    agentMap.get(id)!.execs.push(e);
  }

  return Array.from(agentMap.entries())
    .map(([id, { name, execs }]) => ({
      agentId: id,
      agentName: name,
      executions: execs.length,
      successRate:
        execs.filter((e) => e.status === 'success').length / execs.length,
      avgDuration:
        execs.reduce((s, e) => s + (e.duration_ms || 0), 0) / execs.length,
      avgTokens: execs.reduce((s, e) => s + (e.tokens || 0), 0) / execs.length,
    }))
    .sort((a, b) => b.executions - a.executions)
    .slice(0, limit);
}
