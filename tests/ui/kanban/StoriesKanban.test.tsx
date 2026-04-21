import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../../../src/sdk/stories', () => ({
  list: vi.fn(() => Promise.resolve([])),
  updateStatus: vi.fn(),
}));

import { StoriesKanban } from '../../../src/ui/kanban/StoriesKanban';

describe('StoriesKanban', () => {
  it('renders 4 columns (Draft, Approved, InProgress, Done)', async () => {
    render(<StoriesKanban />);
    await waitFor(() => {
      expect(screen.getByTestId('kanban-col-Draft')).toBeInTheDocument();
      expect(screen.getByTestId('kanban-col-Approved')).toBeInTheDocument();
      expect(screen.getByTestId('kanban-col-InProgress')).toBeInTheDocument();
      expect(screen.getByTestId('kanban-col-Done')).toBeInTheDocument();
    });
  });
});
