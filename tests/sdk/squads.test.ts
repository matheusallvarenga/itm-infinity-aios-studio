import { describe, it, expect } from 'vitest';
import * as squads from '../../src/sdk/squads';

describe('SDK squads module', () => {
  it('list() returns at least 10 squads', async () => {
    const all = await squads.list();
    expect(all.length).toBeGreaterThanOrEqual(10);
  });

  it('includes the core domain squads', async () => {
    const all = await squads.list();
    const names = all.map((s) => s.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'mmos',
        'mmos-squad',
        'etl',
        'etl-squad',
        'curator',
        'deep-research',
        'legal-analyst',
      ])
    );
  });

  it('each squad has required shape fields', async () => {
    const all = await squads.list();
    for (const s of all) {
      expect(s.id).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.version).toBeTruthy();
      expect(s.displayName).toBeTruthy();
      expect(s.domain).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(typeof s.agentCount).toBe('number');
    }
  });

  it('getByName() resolves a known squad', async () => {
    const mmos = await squads.getByName('mmos');
    expect(mmos).not.toBeNull();
    expect(mmos?.displayName).toBe('MMOS Minds');
  });

  it('getByName() returns null for unknown squad', async () => {
    const missing = await squads.getByName('nonexistent-squad-xyz');
    expect(missing).toBeNull();
  });
});
