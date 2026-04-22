import { test, expect } from '@playwright/test';

test.describe('Workflows view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Workflows' }).click();
  });

  test('renders topbar with correct title', async ({ page }) => {
    await expect(page.getByText('AIOS Studio — Workflows')).toBeVisible();
  });

  test('renders workflows content area', async ({ page }) => {
    const content = page.locator(
      '[data-testid="workflow-card"], [data-testid="workflows-empty"], section, main > *'
    );
    await expect(content.first()).toBeVisible({ timeout: 5_000 });
  });

  test('sidebar Workflows nav item is active', async ({ page }) => {
    const workflowsBtn = page.getByRole('button', { name: 'Workflows' });
    await expect(workflowsBtn).toHaveAttribute('aria-current', 'page');
  });
});
