import { test, expect } from '@playwright/test';

/**
 * PRAG-9: Bootstrap frontend app (SPA scaffold + home route)
 *
 * Acceptance criteria:
 *  - Frontend framework scaffolded and runs locally with one command
 *  - A placeholder home route renders
 *  - A reusable layout/shell (header with nav placeholders) is in place
 *  - Linter + formatter configured
 *  - .env.example documents the expected env vars (e.g. VITE_API_BASE_URL)
 *
 * Tech stack: React + Vite (TypeScript), React Router v6, DaisyUI + Tailwind
 */

test.describe('PRAG-9: Bootstrap frontend app (SPA scaffold + home route)', () => {

  test('home route renders the main page heading', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Flight Disruption Monitor' }),
    ).toBeVisible();
  });

  test('home route renders the descriptive subtitle', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByText('Enter an airport code to view upcoming departures'),
    ).toBeVisible();
  });

  test('layout shell renders the brand/logo link', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: 'Flight Monitor' }),
    ).toBeVisible();
  });

  test('layout nav contains a Departures link', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: 'Departures' }),
    ).toBeVisible();
  });

  test('layout nav contains a Watchlist link', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('link', { name: 'Watchlist' }),
    ).toBeVisible();
  });

  test('navigating to /watchlist renders the Watchlist placeholder', async ({ page }) => {
    await page.goto('/watchlist');
    await expect(
      page.getByRole('heading', { name: 'Watchlist' }),
    ).toBeVisible();
  });

  test('nav Watchlist link navigates to /watchlist route', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Watchlist' }).click();
    await expect(page).toHaveURL(/\/watchlist$/);
    await expect(
      page.getByRole('heading', { name: 'Watchlist' }),
    ).toBeVisible();
  });

  test('nav Departures link navigates back to home route', async ({ page }) => {
    await page.goto('/watchlist');
    await page.getByRole('link', { name: 'Departures' }).click();
    await expect(page).toHaveURL('/');
    await expect(
      page.getByRole('heading', { name: 'Flight Disruption Monitor' }),
    ).toBeVisible();
  });

  test('home route renders the airport search input', async ({ page }) => {
    await page.goto('/');
    // AirportSearch component renders a text input for airport codes
    await expect(
      page.getByRole('textbox'),
    ).toBeVisible();
  });

  test('page title is set (document has a title)', async ({ page }) => {
    await page.goto('/');
    // Vite scaffolds with a <title> — any non-empty title satisfies this AC
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
  });
});
