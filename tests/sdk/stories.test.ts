import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as stories from '../../src/sdk/stories';
import { createAIOSClient, resetAIOSClient } from '../../src/lib/supabase';

describe('SDK stories module', () => {
  beforeEach(() => {
    resetAIOSClient();
  });

  it('list() queries aios_stories with defaults', async () => {
    const rows = [
      {
        id: 's1',
        title: 'First',
        status: 'Draft',
        created_at: '2026-04-01T00:00:00Z',
        updated_at: '2026-04-01T00:00:00Z',
      },
    ];

    // Terminal: order(...) resolves
    const order = vi.fn().mockResolvedValue({ data: rows, error: null });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });

    createAIOSClient({ supabaseClient: { from } as any });

    const result = await stories.list();
    expect(from).toHaveBeenCalledWith('aios_stories');
    expect(select).toHaveBeenCalledWith('*');
    expect(order).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(result).toHaveLength(1);
  });

  it('list() applies filter, limit, and orderBy', async () => {
    // Chain: from -> select -> eq -> order -> limit -> range -> resolve
    const finalResult = { data: [], error: null };
    const range = vi.fn().mockResolvedValue(finalResult);
    const limit = vi.fn().mockReturnValue({ range });
    const order = vi.fn().mockReturnValue({ limit });
    const eq = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    createAIOSClient({ supabaseClient: { from } as any });

    await stories.list({
      filter: { status: 'Draft' },
      orderBy: 'updated_at',
      orderDirection: 'asc',
      limit: 10,
      offset: 5,
    });

    expect(eq).toHaveBeenCalledWith('status', 'Draft');
    expect(order).toHaveBeenCalledWith('updated_at', { ascending: true });
    expect(limit).toHaveBeenCalledWith(10);
    expect(range).toHaveBeenCalledWith(5, 14);
  });

  it('get() fetches a single story by id', async () => {
    const row = {
      id: 's1',
      title: 'Sample',
      status: 'Draft',
      created_at: '',
      updated_at: '',
    };
    const maybeSingle = vi.fn().mockResolvedValue({ data: row, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });

    createAIOSClient({ supabaseClient: { from } as any });

    const result = await stories.get('s1');
    expect(eq).toHaveBeenCalledWith('id', 's1');
    expect(result?.id).toBe('s1');
  });

  it('create() inserts with default status Draft', async () => {
    const inserted = {
      id: 's1',
      title: 'New',
      status: 'Draft',
      created_at: '',
      updated_at: '',
    };
    const single = vi.fn().mockResolvedValue({ data: inserted, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const insert = vi.fn().mockReturnValue({ select });
    const from = vi.fn().mockReturnValue({ insert });

    createAIOSClient({ supabaseClient: { from } as any });

    const result = await stories.create({ title: 'New' });
    expect(insert).toHaveBeenCalledWith({ title: 'New', status: 'Draft' });
    expect(result.id).toBe('s1');
  });

  it('updateStatus() updates only the status column', async () => {
    const updated = {
      id: 's1',
      title: 'X',
      status: 'Done',
      created_at: '',
      updated_at: '',
    };
    const single = vi.fn().mockResolvedValue({ data: updated, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const eq = vi.fn().mockReturnValue({ select });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });

    createAIOSClient({ supabaseClient: { from } as any });

    const result = await stories.updateStatus('s1', 'Done');
    expect(update).toHaveBeenCalledWith({ status: 'Done' });
    expect(eq).toHaveBeenCalledWith('id', 's1');
    expect(result.status).toBe('Done');
  });

  it('update() applies arbitrary patch', async () => {
    const updated = {
      id: 's1',
      title: 'New title',
      status: 'Draft',
      created_at: '',
      updated_at: '',
    };
    const single = vi.fn().mockResolvedValue({ data: updated, error: null });
    const select = vi.fn().mockReturnValue({ single });
    const eq = vi.fn().mockReturnValue({ select });
    const update = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ update });

    createAIOSClient({ supabaseClient: { from } as any });

    await stories.update('s1', { title: 'New title' });
    expect(update).toHaveBeenCalledWith({ title: 'New title' });
    expect(eq).toHaveBeenCalledWith('id', 's1');
  });

  it('remove() deletes a story by id', async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ delete: del });

    createAIOSClient({ supabaseClient: { from } as any });

    await stories.remove('s1');
    expect(del).toHaveBeenCalled();
    expect(eq).toHaveBeenCalledWith('id', 's1');
  });

  it('list() throws SDKError on Supabase error', async () => {
    const order = vi.fn().mockResolvedValue({
      data: null,
      error: { message: 'boom' },
    });
    const select = vi.fn().mockReturnValue({ order });
    const from = vi.fn().mockReturnValue({ select });

    createAIOSClient({ supabaseClient: { from } as any });

    await expect(stories.list()).rejects.toMatchObject({
      code: 'STORIES_LIST_FAILED',
      message: 'boom',
    });
  });
});
