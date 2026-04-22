import { test, expect } from '@playwright/test';

test.describe('Squads view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Squads' }).click();
  });

  test('renders topbar with correct title', async ({ page }) => {
    await expect(page.getByText('AIOS Studio — Squads')).toBeVisible();
  });

  test('renders squads content area', async ({ page }) => {
    const content = page.locator(
      '[data-testid="squad-card"], [data-testid="squads-empty"], section, main > *'
    );
    await expect(content.first()).toBeVisible({ timeout: 5_000 });
  });

  test('sidebar Squads nav item is active', async ({ page }) => {
    const squadsBtn = page.getByRole('button', { name: 'Squads' });
    await expect(squadsBtn).toHaveAttribute('aria-current', 'page');
  });
});
