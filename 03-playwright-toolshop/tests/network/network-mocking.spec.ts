import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('Network Mocking Tests with page.route', () => {
  test('TC01 - Simulate 500 Internal Server Error for product API', async ({ page }) => {
    // Intercept GET products API and return 500
    await page.route('**/products**', (route) => {
      if (route.request().method() === 'GET' && !route.request().url().includes('/search')) {
        return route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error: simulated database failure' }),
        });
      }
      return route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Verify page shell loads and handles the error gracefully
    await expect(page.getByTestId('nav-home')).toBeVisible();
    // Cards should not render due to 500 error
    const count = await page.locator('a.card').count();
    expect(count).toBe(0);
  });

  test('TC02 - Simulate empty products response', async ({ page }) => {
    // Intercept products API and return empty array
    await page.route('**/products**', (route) => {
      if (route.request().method() === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [],
            total: 0,
            current_page: 1,
            per_page: 9,
            from: 0,
            to: 0,
          }),
        });
      }
      return route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('nav-home')).toBeVisible();

    // Verify 0 product cards displayed
    const cards = page.locator('a.card');
    await expect(cards).toHaveCount(0);
  });

  test('TC03 - Simulate slow / throttled network response', async ({ page }) => {
    let responseDelayed = false;

    // Introduce 1500ms delay to simulate high latency 3G
    await page.route('**/products**', async (route) => {
      if (route.request().method() === 'GET') {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        responseDelayed = true;
      }
      await route.continue();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Expect items eventually appear after delay
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.locator('a.card').first()).toBeVisible({ timeout: 15000 });
    expect(responseDelayed).toBe(true);
  });

  test('TC04 - Block image network requests to verify core usability without media', async ({
    page,
  }) => {
    let blockedImagesCount = 0;

    // Abort all image resource downloads
    await page.route(/\.(png|jpg|jpeg|webp|svg|avif)$/i, (route) => {
      blockedImagesCount++;
      return route.abort();
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Core interactive features must still be functional
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.getByTestId('sort')).toBeVisible();
    expect(blockedImagesCount).toBeGreaterThan(0);
  });
});
