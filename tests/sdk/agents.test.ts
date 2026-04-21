import { describe, it, expect } from 'vitest';
import * as agents from '../../src/sdk/agents';

describe('SDK agents module', () => {
  it('list() returns the 12 AIOS agents', async () => {
    const all = await agents.list();
    expect(all).toHaveLength(12);
  });

  it('includes the expected canonical agent names', async () => {
    const all = await agents.list();
    const names = all.map((a) => a.name);
    expect(names).toEqual(
      expect.arrayContaining([
        'aios-master',
        'analyst',
        'pm',
        'architect',
        'sm',
        'dev',
        'qa',
        'po',
        'devops',
        'data-engineer',
        'ux-design-expert',
        'squad-creator',
      ])
    );
  });

  it('each agent has required shape fields', async () => {
    const all = await agents.list();
    for (const a of all) {
      expect(a.id).toBeTruthy();
      expect(a.name).toBeTruthy();
      expect(a.displayName).toBeTruthy();
      expect(a.icon).toBeTruthy();
      expect(a.archetype).toBeTruthy();
      expect(a.role).toBeTruthy();
      expect(Array.isArray(a.commands)).toBe(true);
      expect(a.commands.length).toBeGreaterThan(0);
    }
  });

  it('getByName() resolves by name', async () => {
    const dev = await agents.getByName('dev');
    expect(dev?.displayName).toBe('Dex');
  });

  it('getByName() resolves by displayName', async () => {
    const orion = await agents.getByName('Orion');
    expect(orion?.name).toBe('aios-master');
  });

  it('getByName() returns null for unknown name', async () => {
    const missing = await agents.getByName('nonexistent-agent-xyz');
    expect(missing).toBeNull();
  });

  it('getCommands() returns the agent command list', async () => {
    const commands = await agents.getCommands('dev');
    expect(Array.isArray(commands)).toBe(true);
    expect(commands.length).toBeGreaterThan(0);
    expect(commands[0]).toHaveProperty('name');
    expect(commands[0]).toHaveProperty('description');
  });

  it('getCommands() returns empty list for unknown agent', async () => {
    const commands = await agents.getCommands('nonexistent-agent-xyz');
    expect(commands).toEqual([]);
  });
});
