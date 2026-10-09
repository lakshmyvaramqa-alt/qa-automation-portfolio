import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { SortOption } from '../models/product.model';

export class HomePage extends BasePage {
  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly searchReset: Locator;
  readonly sortDropdown: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-query');
    this.searchSubmit = page.getByTestId('search-submit');
    this.searchReset = page.getByTestId('search-reset');
    this.sortDropdown = page.getByTestId('sort');
    this.productCards = page.locator('a.card');
    this.productNames = page.getByTestId('product-name');
    this.productPrices = page.getByTestId('product-price');
  }

  async searchProduct(query: string): Promise<void> {
    const resPromise = this.page.waitForResponse(
      (res) => (res.url().includes('/search') || res.url().includes('q=')) && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    await this.searchInput.fill(query);
    await this.searchSubmit.click();
    await resPromise;
    await this.page.waitForTimeout(600);
  }

  async resetSearch(): Promise<void> {
    const resPromise = this.page.waitForResponse(
      (res) => res.url().includes('/products') && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    await this.searchReset.click();
    await resPromise;
    await this.page.waitForTimeout(600);
  }

  async selectSort(option: SortOption): Promise<void> {
    const resPromise = this.page.waitForResponse(
      (res) => res.url().includes('sort=') && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    await this.sortDropdown.selectOption(option);
    await resPromise;
    await this.page.waitForTimeout(600);
  }

  async getProductTitles(): Promise<string[]> {
    await this.productNames.first().waitFor({ state: 'visible', timeout: 10000 });
    const texts = await this.productNames.allTextContents();
    return texts.map((t) => t.trim()).filter((t) => t.length > 0);
  }

  async getProductPrices(): Promise<number[]> {
    await this.productPrices.first().waitFor({ state: 'visible', timeout: 10000 });
    const texts = await this.productPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '').trim()));
  }

  async clickProduct(index: number = 0): Promise<void> {
    await this.productCards.nth(index).click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async filterByCategory(categoryName: string): Promise<void> {
    const resPromise = this.page.waitForResponse(
      (res) => res.url().includes('by_category') && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    const checkbox = this.page.getByRole('checkbox', { name: new RegExp(categoryName, 'i') });
    await checkbox.check();
    await resPromise;
    await this.page.waitForTimeout(600);
  }

  async filterByBrand(brandName: string): Promise<void> {
    const resPromise = this.page.waitForResponse(
      (res) => res.url().includes('by_brand') && res.status() === 200,
      { timeout: 15000 }
    ).catch(() => null);
    const checkbox = this.page.getByRole('checkbox', { name: new RegExp(brandName, 'i') });
    await checkbox.check();
    await resPromise;
    await this.page.waitForTimeout(600);
  }
}
