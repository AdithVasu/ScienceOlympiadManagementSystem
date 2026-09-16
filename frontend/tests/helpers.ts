import type { Page } from '@playwright/test';

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString('base64url');
}

export function authToken(role: number) {
  return [
    encodeBase64Url(JSON.stringify({ alg: 'none', typ: 'JWT' })),
    encodeBase64Url(JSON.stringify({ id: `test-user-${role}`, role })),
    'test-signature',
  ].join('.');
}

export async function authenticate(page: Page, role = 2) {
  await page.addInitScript((token) => {
    window.localStorage.setItem('accessToken', token);
  }, authToken(role));
}

export async function mockDashboardApi(page: Page) {
  await page.route('**/events', async (route) => {
    await route.fulfill({ json: [] });
  });
  await page.route('**/event-scores/pending', async (route) => {
    await route.fulfill({ json: [] });
  });
}