import { test, expect } from '@playwright/test';

test.describe('Dashboard view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Dashboard' }).click();
  });

  test('renders topbar with correct title', async ({ page }) => {
    await expect(page.getByText('AIOS Studio — Dashboard')).toBeVisible();
  });

  test('renders metrics grid area', async ({ page }) => {
    // MetricsGrid renders skeleton or loaded cards — either is valid
    const metricsArea = page.locator(
      '[data-testid="metrics-grid-skeleton"], [data-testid="metrics-grid"]'
    );
    await expect(metricsArea.first()).toBeVisible({ timeout: 5_000 });
  });

  test('sidebar Dashboard nav item is active', async ({ page }) => {
    const dashboardBtn = page.getByRole('button', { name: 'Dashboard' });
    await expect(dashboardBtn).toHaveAttribute('aria-current', 'page');
  });
});
