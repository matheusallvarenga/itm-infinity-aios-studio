import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as workflows from '../../src/sdk/workflows';
import {
  createAIOSClient,
  resetAIOSClient,
} from '../../src/lib/supabase';

describe('SDK workflows module — static registry', () => {
  it('list() returns 16 workflows', async () => {
    const all = await workflows.list();
    expect(all).toHaveLength(16);
  });

  it('list() filters by category', async () => {
    const gf = await workflows.list({ category: 'greenfield' });
    expect(gf.length).toBeGreaterThan(0);
    for (const w of gf) expect(w.category).toBe('greenfield');

    const bf = await workflows.list({ category: 'brownfield' });
    expect(bf.length).toBeGreaterThan(0);
    for (const w of bf) expect(w.category).toBe('brownfield');
  });

  it('getByName() resolves a known workflow', async () => {
    const w = await workflows.getByName('story-development-cycle');
    expect(w).not.toBeNull();
    expect(w?.category).toBe('story');
  });

  it('getByName() returns null for unknown workflow', async () => {
    const missing = await workflows.getByName('nonexistent-workflow');
    expect(missing).toBeNull();
  });
});

describe('SDK workflows module — Supabase-backed', () => {
  beforeEach(() => {
    resetAIOSClient();
  });

  it('trigger() inserts a workflow run and returns the row', async () => {
    const insertedRow = {
      id: 'run-123',
      workflow_name: 'story-development-cycle',
      params: { story_id: 'abc' },
      status: 'pending',
      started_at: new Date().toISOString(),
    };

    const single = vi.fn().mockResolvedValue({ data: insertedRow, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });

    createAIOSClient({ supabaseClient: { from } as any });

    const run = await workflows.trigger({
      workflow_name: 'story-development-cycle',
      params: { story_id: 'abc' },
      triggered_by: 'dev',
    });

    expect(from).toHaveBeenCalledWith('aios_workflow_runs');
    expect(insert).toHaveBeenCalled();
    const insertArg = insert.mock.calls[0][0];
    expect(insertArg.workflow_name).toBe('story-development-cycle');
    expect(insertArg.status).toBe('pending');
    expect(insertArg.triggered_by).toBe('dev');
    expect(run.id).toBe('run-123');
  });

  it('getStatus() fetches a run by id', async () => {
    const row = {
      id: 'run-123',
      workflow_name: 'x',
      params: {},
      status: 'completed',
      started_at: new Date().toISOString(),
    };
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    createAIOSClient({ supabaseClient: { from } as any });

    const result = await workflows.getStatus('run-123');
    expect(from).toHaveBeenCalledWith('aios_workflow_runs');
    expect(result?.id).toBe('run-123');
  });

  it('getHistory() returns ordered list', async () => {
    const rows = [
      {
        id: 'r2',
        workflow_name: 'x',
        params: {},
        status: 'completed',
        started_at: '2026-04-20T00:00:00Z',
      },
      {
        id: 'r1',
        workflow_name: 'x',
        params: {},
        status: 'failed',
        started_at: '2026-04-19T00:00:00Z',
      },
    ];
    const limit = vi.fn().mockResolvedValue({ data: rows, error: null });
    const order = vi.fn().mockReturnValue({ limit });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });

    createAIOSClient({ supabaseClient: { from } as any });

    const result = await workflows.getHistory(5);
    expect(from).toHaveBeenCalledWith('aios_workflow_runs');
    expect(order).toHaveBeenCalledWith('started_at', { ascending: false });
    expect(limit).toHaveBeenCalledWith(5);
    expect(result).toHaveLength(2);
  });
});
