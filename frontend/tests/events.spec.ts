import { expect, test } from '@playwright/test';
import { authenticate } from './helpers';

const event = {
  _id: 'event-1',
  name: 'Bridge Building',
  description: 'Test event description',
  date: '2026-10-01',
  timeBlock: 'Morning',
  rsvps: [],
};

test.describe('events', () => {
  test('lists events and opens event details', async ({ page }) => {
    await authenticate(page);
    await page.route('**/events', async (route) => {
      await route.fulfill({ json: [event] });
    });
    await page.route('**/events/event-1', async (route) => {
      await route.fulfill({ json: event });
    });

    await page.goto('/events');
    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bridge Building' })).toBeVisible();
    await page.getByRole('link', { name: 'View details' }).click();

    await expect(page).toHaveURL(/\/events\/event-1$/);
    await expect(page.getByText('Test event description')).toBeVisible();
    await expect(page.getByText('RSVPs: 0')).toBeVisible();
  });

  test('shows an empty events page when the API returns no events', async ({ page }) => {
    await authenticate(page);
    await page.route('**/events', async (route) => {
      await route.fulfill({ json: [] });
    });

    await page.goto('/events');

    await expect(page.getByRole('heading', { name: 'Events' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'View details' })).toHaveCount(0);
  });
});