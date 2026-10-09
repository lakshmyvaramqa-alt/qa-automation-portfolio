import { test, expect } from '../../src/fixtures/test.fixture';
import { isSorted } from '../../src/utils/sort-helper';

test.describe('Search, Filter and Sort Tests @smoke', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigateToHome();
  });

  test('TC01 - Search for products and verify results', async ({ homePage }) => {
    await homePage.searchProduct('pliers');
    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    const hasMatch = titles.some((t) => t.toLowerCase().includes('plier'));
    expect(hasMatch).toBe(true);
  });

  test('TC02 - Filter products by category', async ({ homePage }) => {
    await homePage.filterByCategory('Hammer');
    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
    const hasHammer = titles.some((t) => t.toLowerCase().includes('hammer'));
    expect(hasHammer).toBe(true);
  });

  test('TC03 - Filter products by brand', async ({ homePage }) => {
    await homePage.filterByBrand('ForgeFlex Tools');
    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(0);
  });

  test('TC04 - Sort products by Name (A-Z) and verify with isSorted()', async ({ homePage }) => {
    await homePage.selectSort('name,asc');
    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(1);
    expect(isSorted(titles, 'asc')).toBe(true);
  });

  test('TC05 - Sort products by Name (Z-A) and verify with isSorted()', async ({ homePage }) => {
    await homePage.selectSort('name,desc');
    const titles = await homePage.getProductTitles();
    expect(titles.length).toBeGreaterThan(1);
    expect(isSorted(titles, 'desc')).toBe(true);
  });

  test('TC06 - Sort products by Price (Low to High) and verify with isSorted()', async ({ homePage }) => {
    await homePage.selectSort('price,asc');
    const prices = await homePage.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);
    expect(isSorted(prices, 'asc')).toBe(true);
  });

  test('TC07 - Sort products by Price (High to Low) and verify with isSorted()', async ({ homePage }) => {
    await homePage.selectSort('price,desc');
    const prices = await homePage.getProductPrices();
    expect(prices.length).toBeGreaterThan(1);
    expect(isSorted(prices, 'desc')).toBe(true);
  });
});
