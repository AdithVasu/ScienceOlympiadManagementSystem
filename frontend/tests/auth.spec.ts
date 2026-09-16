import { expect, test } from '@playwright/test';

test.describe('authentication pages', () => {
  test('shows the login page and links to account recovery and registration', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot password?' })).toHaveAttribute('href', '/forgot-password');
    await expect(page.getByRole('link', { name: 'Create account' })).toHaveAttribute('href', '/register');
  });

  test('shows an error for invalid login credentials', async ({ page }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid password' }),
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder('Email address').fill('student@example.com');
    await page.getByPlaceholder('Password').fill('wrong-password');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Invalid password')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('registers an account and returns to login', async ({ page }) => {
    await page.route('**/auth/signup', async (route) => {
      await route.fulfill({ status: 201, json: { message: 'Account created' } });
    });

    await page.goto('/register');
    await page.getByPlaceholder('First name').fill('Test');
    await page.getByPlaceholder('Last name').fill('Student');
    await page.getByPlaceholder('Email address').fill('student@example.com');
    await page.getByPlaceholder('Password').fill('password123');
    await page.getByPlaceholder('Confirm password').fill('password123');
    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL(/\/login$/);
  });

  test('confirms a password reset request', async ({ page }) => {
    await page.route('**/auth/request-password-reset', async (route) => {
      await route.fulfill({ status: 200, json: { message: 'Reset requested' } });
    });

    await page.goto('/forgot-password');
    await page.getByPlaceholder('Email address').fill('student@example.com');
    await page.getByRole('button', { name: 'Send reset link' }).click();

    await expect(page.getByText('Reset link sent. Check your email.')).toBeVisible();
  });
});