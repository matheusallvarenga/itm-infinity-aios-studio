/**
 * itm-infinity-aios-studio — SDK (headless)
 *
 * Headless TypeScript SDK. Pure Promises, no React, no DOM.
 * Can be consumed programmatically by any TypeScript/JavaScript client
 * (including the UI layer in this package, and external services like
 * itm-legendary-infinity-os background workers).
 */

// Client management
export {
  createAIOSClient,
  getAIOSClient,
  resetAIOSClient,
} from '../lib/supabase';
export type { AIOSClientConfig } from '../lib/supabase';

// Domain types
export * from './types';

// Namespaced modules
export * as metrics from './metrics';
export * as stories from './stories';
export * as agents from './agents';
export * as squads from './squads';
export * as workflows from './workflows';
