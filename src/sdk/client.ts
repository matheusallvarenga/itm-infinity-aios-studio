/**
 * SDK-level client management.
 * Re-exports the internal Supabase client factory.
 */
export { createAIOSClient, getAIOSClient, resetAIOSClient } from '../lib/supabase';
export type { AIOSClientConfig } from '../lib/supabase';
