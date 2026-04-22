import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as metrics from '../../src/sdk/metrics';
import { createAIOSClient, resetAIOSClient } from '../../src/lib/supabase';

/**
 * Builds a chained mock for:
 * `.from(table).select(...).gte(...).lte(...) → resolved result`
 * lte() is the terminal call — must return a Promise directly.
 */
function chainResult(result: { data: any; error: any }) {
  const lte = vi.fn().mockResolvedValue(result);
  const gte = vi.fn().mockReturnValue({ lte });
  const select = vi.fn().mockReturnValue({ gte });
  return { select, gte, lte };
}

/**
 * Builds a chained mock for:
 * `.from(table).select(...).gte(...).lte(...).order(...) → resolved result`
 */
function chainResultWithOrder(result: { data: any; error: any }) {
  const order = vi.fn().mockResolvedValue(result);
  const lte = vi.fn().mockReturnValue({ order });
  const gte = vi.fn().mockReturnValue({ lte });
  const select = vi.fn().mockReturnValue({ gte });
  return { select, gte, lte, order };
}

/**
 * Builds a chained mock for:
 * `.from(table).select(...).order(...).limit(...) → resolved result`
 */
function chainResultWithOrderLimit(result: { data: any; error: any }) {
  const limit = vi.fn().mockResolvedValue(result);
  const order = vi.fn().mockReturnValue({ limit });
  const select = vi.fn().mockReturnValue({ order });
  return { select, order, limit };
}

describe('SDK metrics module', () => {
  beforeEach(() => {
    resetAIOSClient();
  });

  it('getOverview() aggregates from aios_workflow_runs', async () => {
    const rows = [
      { status: 'completed', started_at: '2026-04-01T10:00:00Z', completed_at: '2026-04-01T10:00:01.5Z' },
      { status: 'completed', started_at: '2026-04-01T11:00:00Z', completed_at: '2026-04-01T11:00:02Z' },
      { status: 'failed',    started_at: '2026-04-01T12:00:00Z', completed_at: null },
      { status: 'running',   started_at: '2026-04-01T13:00:00Z', completed_at: null },
    ];

    const chain = chainResult({ data: rows, error: null });
    const from = vi.fn().mockReturnValue({ select: chain.select });

    createAIOSClient({ supabaseClient: { from } as any });

    const overview = await metrics.getOverview({
      start: '2026-04-01T00:00:00Z',
      end: '2026-04-02T00:00:00Z',
    });

    expect(from).toHaveBeenCalledWith('aios_workflow_runs');
    expect(overview.totalExecutions).toBe(4);
    expect(overview.successfulExecutions).toBe(2);
    expect(overview.failedExecutions).toBe(1);
    expect(overview.activeJobs).toBe(1);
    expect(overview.successRate).toBeCloseTo(0.5);
    expect(overview.totalCost).toBe(0);
    expect(overview.totalTokens).toBe(0);
    expect(overview.period.start).toBe('2026-04-01T00:00:00Z');
  });

  it('getOverview() returns zero metrics when no rows exist', async () => {
    const chain = chainResult({ data: [], error: null });
    const from = vi.fn().mockReturnValue({ select: chain.select });

    createAIOSClient({ supabaseClient: { from } as any });

    const overview = await metrics.getOverview({});

    expect(overview.totalExecutions).toBe(0);
    expect(overview.successRate).toBe(0);
    expect(overview.activeJobs).toBe(0);
  });

  it('getTrends() buckets by day and computes aggregates', async () => {
    const rows = [
      { started_at: '2026-04-01T10:00:00Z', status: 'completed', completed_at: '2026-04-01T10:00:01Z' },
      { started_at: '2026-04-01T14:00:00Z', status: 'failed',    completed_at: '2026-04-01T14:00:00.5Z' },
      { started_at: '2026-04-02T09:00:00Z', status: 'completed', completed_at: '2026-04-02T09:00:02Z' },
    ];

    const chain = chainResultWithOrder({ data: rows, error: null });
    const from = vi.fn().mockReturnValue({ select: chain.select });

    createAIOSClient({ supabaseClient: { from } as any });

    const trends = await metrics.getTrends({});
    expect(trends).toHaveLength(2);

    const day1 = trends.find((t) => t.timestamp === '2026-04-01');
    expect(day1?.executions).toBe(2);
    expect(day1?.errors).toBe(1);         // 'failed' counts as error
    expect(day1?.avgLatency).toBe(750);   // (1000 + 500) / 2
    expect(day1?.cost).toBe(0);           // ADR-003: no cost column

    const day2 = trends.find((t) => t.timestamp === '2026-04-02');
    expect(day2?.executions).toBe(1);
    expect(day2?.errors).toBe(0);
    expect(day2?.avgLatency).toBe(2000);
  });

  it('getTopAgents() groups by workflow_name', async () => {
    const rows = [
      { workflow_name: 'story-development-cycle', triggered_by: '@dev', status: 'completed', started_at: '2026-04-01T10:00:00Z', completed_at: '2026-04-01T10:00:01Z' },
      { workflow_name: 'story-development-cycle', triggered_by: '@dev', status: 'completed', started_at: '2026-04-01T11:00:00Z', completed_at: '2026-04-01T11:00:02Z' },
      { workflow_name: 'story-development-cycle', triggered_by: '@qa',  status: 'failed',    started_at: '2026-04-01T12:00:00Z', completed_at: null },
      { workflow_name: 'greenfield-fullstack',     triggered_by: '@sm',  status: 'completed', started_at: '2026-04-01T13:00:00Z', completed_at: '2026-04-01T13:00:00.3Z' },
    ];

    const chain = chainResultWithOrderLimit({ data: rows, error: null });
    const from = vi.fn().mockReturnValue({ select: chain.select });

    createAIOSClient({ supabaseClient: { from } as any });

    const top = await metrics.getTopAgents(5);

    expect(top[0].agentId).toBe('story-development-cycle');
    expect(top[0].agentName).toBe('story-development-cycle');
    expect(top[0].executions).toBe(3);
    expect(top[0].successRate).toBeCloseTo(2 / 3);
    expect(top[0].avgTokens).toBe(0); // ADR-003

    expect(top[1].agentId).toBe('greenfield-fullstack');
    expect(top[1].executions).toBe(1);
    expect(top[1].successRate).toBe(1);
  });
});
