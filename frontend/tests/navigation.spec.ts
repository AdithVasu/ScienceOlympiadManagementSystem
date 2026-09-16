import { expect, test } from '@playwright/test';
import { authenticate, mockDashboardApi } from './helpers';

test.describe('protected navigation', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('allows an authenticated user to open the dashboard and log out', async ({ page }) => {
    await authenticate(page);
    await mockDashboardApi(page);
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Welcome, Volunteer' })).toBeVisible();
    await page.getByRole('button', { name: 'Logout' }).click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test('keeps an authenticated user on a protected route after refresh', async ({ page }) => {
    await authenticate(page);
    await mockDashboardApi(page);
    await page.goto('/dashboard');
    await page.reload();

    await expect(page.getByRole('heading', { name: 'Welcome, Volunteer' })).toBeVisible();
  });

  test('blocks a regular user from the admin review page', async ({ page }) => {
    await authenticate(page, 2);
    await mockDashboardApi(page);
    await page.goto('/admin/review');

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('allows an admin to open the review page', async ({ page }) => {
    await authenticate(page, 0);
    await page.route('**/event-scores/pending', async (route) => {
      await route.fulfill({ json: [] });
    });
    await page.goto('/admin/review');

    await expect(page.getByRole('heading', { name: 'Review queue' })).toBeVisible();
    await expect(page.getByText('No pending submissions.')).toBeVisible();
  });
});