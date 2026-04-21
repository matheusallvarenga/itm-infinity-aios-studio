import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface AIOSClientConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseClient?: SupabaseClient;
}

let _client: SupabaseClient | null = null;

export function createAIOSClient(config: AIOSClientConfig = {}): SupabaseClient {
  if (config.supabaseClient) {
    _client = config.supabaseClient;
    return _client;
  }
  const envUrl =
    typeof import.meta !== 'undefined' && (import.meta as any).env
      ? (import.meta as any).env.VITE_SUPABASE_URL
      : undefined;
  const envKey =
    typeof import.meta !== 'undefined' && (import.meta as any).env
      ? (import.meta as any).env.VITE_SUPABASE_ANON_KEY
      : undefined;
  const url = config.supabaseUrl || envUrl;
  const key = config.supabaseAnonKey || envKey;
  if (!url || !key) {
    throw new Error(
      '[AIOS SDK] Missing Supabase credentials. Pass via config or VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY env vars.'
    );
  }
  _client = createClient(url, key);
  return _client;
}

export function getAIOSClient(): SupabaseClient {
  if (!_client) {
    throw new Error('[AIOS SDK] Client not initialized. Call createAIOSClient() first.');
  }
  return _client;
}

export function resetAIOSClient(): void {
  _client = null;
}
