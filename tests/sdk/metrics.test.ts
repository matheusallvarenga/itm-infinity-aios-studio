import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as metrics from '../../src/sdk/metrics';
import { createAIOSClient, resetAIOSClient } from '../../src/lib/supabase';

/**
 * Builds a chained mock for `.from(table).select(...).gte(...).lte(...)...`
 * that ends with a resolved result.
 */
function chainResult(result: { data: any; error: any }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const limit = vi.fn().mockReturnValue({ maybeSingle });
  const order = vi.fn().mockReturnValue({ limit });
  const lte = vi.fn().mockReturnValue({ order });
  const gte = vi.fn().mockReturnValue({ lte });
  const select = vi.fn().mockReturnValue({ gte });
  return { select, gte, lte, order, limit, maybeSingle };
}

describe('SDK metrics module', () => {
  beforeEach(() => {
    resetAIOSClient();
  });

  it('getOverview() uses unified_metrics when row is available', async () => {
    const aggregated = {
      total_executions: 100,
      successful_executions: 90,
      failed_executions: 10,
      success_rate: 0.9,
      avg_duration: 1500,
      total_cost: 1.23,
      total_tokens: 45000,
      active_jobs: 3,
    };

    const metricsChain = chainResult({ data: aggregated, error: null });
    const from = vi.fn().mockImplementation((table: string) => {
      if (table === 'unified_metrics') return { select: metricsChain.select };
      throw new Error('Unexpected fallback to ' + table);
    });

    createAIOSClient({ supabaseClient: { from } as any });

    const overview = await metrics.getOverview({
      start: '2026-01-01T00:00:00Z',
      end: '2026-02-01T00:00:00Z',
    });

    expect(from).toHaveBeenCalledWith('unified_metrics');
    expect(overview.totalExecutions).toBe(100);
    expect(overview.successRate).toBe(0.9);
    expect(overview.period.start).toBe('2026-01-01T00:00:00Z');
  });

  it('getOverview() falls back to unified_executions when no aggregate row', async () => {
    const metricsChain = chainResult({ data: null, error: null });

    const execRows = [
      { status: 'success', duration_ms: 1000, tokens: 100, cost: 0.5 },
      { status: 'success', duration_ms: 2000, tokens: 200, cost: 1.0 },
      { status: 'failure', duration_ms: 500, tokens: 50, cost: 0.25 },
    ];
    const lte = vi.fn().mockResolvedValue({ data: execRows, error: null });
    const gte = vi.fn().mockReturnValue({ lte });
    const execsSelect = vi.fn().mockReturnValue({ gte });

    const from = vi.fn().mockImplementation((table: string) => {
      if (table === 'unified_metrics') return { select: metricsChain.select };
      if (table === 'unified_executions') return { select: execsSelect };
      throw new Error('Unexpected table ' + table);
    });

    createAIOSClient({ supabaseClient: { from } as any });

    const overview = await metrics.getOverview({});
    expect(from).toHaveBeenCalledWith('unified_metrics');
    expect(from).toHaveBeenCalledWith('unified_executions');
    expect(overview.totalExecutions).toBe(3);
    expect(overview.successfulExecutions).toBe(2);
    expect(overview.failedExecutions).toBe(1);
    expect(overview.totalCost).toBeCloseTo(1.75);
    expect(overview.totalTokens).toBe(350);
  });

  it('getTrends() buckets by day and computes aggregates', async () => {
    const rows = [
      {
        created_at: '2026-04-01T10:00:00Z',
        status: 'success',
        duration_ms: 1000,
        cost: 0.1,
      },
      {
        created_at: '2026-04-01T14:00:00Z',
        status: 'failure',
        duration_ms: 500,
        cost: 0.05,
      },
      {
        created_at: '2026-04-02T09:00:00Z',
        status: 'success',
        duration_ms: 2000,
        cost: 0.2,
      },
    ];

    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const lte = vi.fn().mockReturnValue({ order });
    const gte = vi.fn().mockReturnValue({ lte });
    const select = vi.fn().mockReturnValue({ gte });
    const from = vi.fn().mockImplementation((_table: string) => ({ select }));

    createAIOSClient({ supabaseClient: { from } as any });

    const trends = await metrics.getTrends({});
    expect(trends).toHaveLength(2);
    const day1 = trends.find((t) => t.timestamp === '2026-04-01');
    expect(day1?.executions).toBe(2);
    expect(day1?.errors).toBe(1);
    expect(day1?.avgLatency).toBe(750);
    expect(day1?.cost).toBeCloseTo(0.15);
  });

  it('getTopAgents() aggregates executions by agent', async () => {
    const rows = [
      { agent_id: 'dev', agent_name: 'Dex', status: 'success', duration_ms: 1000, tokens: 100 },
      { agent_id: 'dev', agent_name: 'Dex', status: 'success', duration_ms: 2000, tokens: 200 },
      { agent_id: 'dev', agent_name: 'Dex', status: 'failure', duration_ms: 500, tokens: 50 },
      { agent_id: 'qa', agent_name: 'Vera', status: 'success', duration_ms: 300, tokens: 30 },
    ];
    const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
    const order = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockImplementation((_table: string) => ({ select }));

    createAIOSClient({ supabaseClient: { from } as any });

    const top = await metrics.getTopAgents(5);
    expect(top[0].agentId).toBe('dev');
    expect(top[0].executions).toBe(3);
    expect(top[0].successRate).toBeCloseTo(2 / 3);
    expect(top[1].agentId).toBe('qa');
  });
});
