import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createAIOSClient,
  getAIOSClient,
  resetAIOSClient,
} from '../../src/lib/supabase';

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url: string, key: string) => ({
    __mock: true,
    url,
    key,
  })),
}));

describe('SDK client factory', () => {
  beforeEach(() => {
    resetAIOSClient();
  });

  it('creates a client from explicit url/key config', () => {
    const client = createAIOSClient({
      supabaseUrl: 'https://test.supabase.co',
      supabaseAnonKey: 'test-anon-key',
    });
    expect(client).toBeDefined();
    expect((client as any).__mock).toBe(true);
  });

  it('returns the same client via getAIOSClient after init', () => {
    const created = createAIOSClient({
      supabaseUrl: 'https://test.supabase.co',
      supabaseAnonKey: 'test-anon-key',
    });
    const fetched = getAIOSClient();
    expect(fetched).toBe(created);
  });

  it('accepts a pre-configured SupabaseClient via config.supabaseClient', () => {
    const preConfigured = { preConfigured: true } as any;
    const client = createAIOSClient({ supabaseClient: preConfigured });
    expect(client).toBe(preConfigured);
    expect(getAIOSClient()).toBe(preConfigured);
  });

  it('throws when getAIOSClient called before init', () => {
    expect(() => getAIOSClient()).toThrow(/Client not initialized/);
  });

  it('throws when credentials are missing', () => {
    expect(() => createAIOSClient({})).toThrow(/Missing Supabase credentials/);
  });

  it('resets the client', () => {
    createAIOSClient({
      supabaseUrl: 'https://test.supabase.co',
      supabaseAnonKey: 'test-anon-key',
    });
    resetAIOSClient();
    expect(() => getAIOSClient()).toThrow(/Client not initialized/);
  });
});
