import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  readonly productName: Locator;
  readonly unitPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly toastMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.getByTestId('product-name');
    this.unitPrice = page.getByTestId('unit-price');
    this.quantityInput = page.getByTestId('quantity');
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.toastMessage = page.locator('div[role="alert"], .toast-body');
  }

  async setQuantity(qty: number): Promise<void> {
    await this.quantityInput.fill(qty.toString());
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async getTitle(): Promise<string> {
    return (await this.productName.textContent()) || '';
  }

  async getPrice(): Promise<number> {
    const text = (await this.unitPrice.textContent()) || '0';
    return parseFloat(text.replace('$', '').trim());
  }
}
