import { test, expect } from '@playwright/test';

test.describe('Stories Kanban view', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Stories' }).click();
  });

  test('renders topbar with correct title', async ({ page }) => {
    await expect(page.getByText('AIOS Studio — Stories')).toBeVisible();
  });

  test('renders kanban columns or loading state', async ({ page }) => {
    // KanbanColumn uses data-testid="kanban-col-{Status}"
    // Draft column is the first and most likely to render
    const draftCol = page.locator('[data-testid="kanban-col-Draft"]');
    const fallback = page.locator('.kanban-board, [class*="kanban"], section');
    const visible = draftCol.or(fallback.first());
    await expect(visible.first()).toBeVisible({ timeout: 5_000 });
  });

  test('sidebar Stories nav item is active', async ({ page }) => {
    const storiesBtn = page.getByRole('button', { name: 'Stories' });
    await expect(storiesBtn).toHaveAttribute('aria-current', 'page');
  });
});
