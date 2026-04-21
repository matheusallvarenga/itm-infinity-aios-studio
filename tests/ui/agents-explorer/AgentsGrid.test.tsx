import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// Use the real agents list (static registry — no side effects)
import * as agentsSdk from '../../../src/sdk/agents';

vi.spyOn(agentsSdk, 'list');

import { AgentsGrid } from '../../../src/ui/agents-explorer/AgentsGrid';

describe('AgentsGrid', () => {
  it('renders 12 agent cards', async () => {
    render(<AgentsGrid />);
    await waitFor(() => {
      const cards = screen.getAllByTestId('agent-card');
      expect(cards).toHaveLength(12);
    });
  });
});
