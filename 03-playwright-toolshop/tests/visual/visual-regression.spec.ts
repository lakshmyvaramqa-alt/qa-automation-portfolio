import { test, expect } from '../../src/fixtures/test.fixture';

test.describe('Visual Regression Test Suite @visual', () => {
  test('TC01 - Verify Homepage layout against baseline with dynamic masking', async ({
    page,
    homePage,
  }) => {
    await homePage.navigateToHome();
    await page.waitForLoadState('domcontentloaded');

    // Wait for core elements
    await expect(page.getByTestId('nav-home')).toBeVisible();
    await expect(page.locator('a.card').first()).toBeVisible({ timeout: 15000 });

    // Mask dynamic areas: prices, product images, footer timestamps
    await expect(page).toHaveScreenshot('homepage-layout.png', {
      maxDiffPixelRatio: 0.1,
      mask: [
        page.getByTestId('product-price'),
        page.locator('.card-img-top, img'),
        page.locator('footer, .footer'),
      ],
      fullPage: false,
    });
  });

  test('TC02 - Verify Contact page layout with masked footer', async ({ page, contactPage }) => {
    await contactPage.goto();
    await expect(contactPage.firstNameInput).toBeVisible();

    await expect(page).toHaveScreenshot('contact-layout.png', {
      maxDiffPixelRatio: 0.05,
      mask: [
        page.locator('footer, .footer'),
      ],
      fullPage: false,
    });
  });
});
