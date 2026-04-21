import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

// Mock the metrics SDK module BEFORE importing the component.
vi.mock('../../../src/sdk/metrics', () => ({
  getOverview: vi.fn(
    () =>
      new Promise((resolve) => {
        // Resolve async so the initial render shows the skeleton.
        setTimeout(
          () =>
            resolve({
              totalExecutions: 100,
              successfulExecutions: 95,
              failedExecutions: 5,
              successRate: 0.95,
              avgDuration: 1200,
              totalCost: 12.34,
              totalTokens: 50000,
              activeJobs: 2,
              period: { start: '', end: '' },
            }),
          0
        );
      })
  ),
  getTrends: vi.fn(() => Promise.resolve([])),
  getTopAgents: vi.fn(() => Promise.resolve([])),
}));

import { MetricsGrid } from '../../../src/ui/dashboard/MetricsGrid';

describe('MetricsGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton on initial load', () => {
    render(<MetricsGrid />);
    expect(screen.getByTestId('metrics-grid-skeleton')).toBeInTheDocument();
  });

  it('renders 6 KPI cards once data is loaded', async () => {
    render(<MetricsGrid />);
    await waitFor(() => {
      expect(screen.getByText('Total Executions')).toBeInTheDocument();
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
      expect(screen.getByText('Avg Duration')).toBeInTheDocument();
      expect(screen.getByText('Total Cost')).toBeInTheDocument();
      expect(screen.getByText('Total Tokens')).toBeInTheDocument();
      expect(screen.getByText('Active Jobs')).toBeInTheDocument();
    });
  });
});
