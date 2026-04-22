import { test, expect } from '@playwright/test';

test.describe('Agents view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Agents' }).click();
  });

  test('renders topbar with correct title', async ({ page }) => {
    await expect(page.getByText('AIOS Studio — Agents')).toBeVisible();
  });

  test('renders at least one agent card or empty state', async ({ page }) => {
    // Either agent cards are present or an empty/loading state renders
    const agentContent = page.locator(
      '[data-testid="agent-card"], [data-testid="agents-empty"], .agents-grid, section'
    );
    await expect(agentContent.first()).toBeVisible({ timeout: 5_000 });
  });

  test('sidebar Agents nav item is active', async ({ page }) => {
    const agentsBtn = page.getByRole('button', { name: 'Agents' });
    await expect(agentsBtn).toHaveAttribute('aria-current', 'page');
  });
});
