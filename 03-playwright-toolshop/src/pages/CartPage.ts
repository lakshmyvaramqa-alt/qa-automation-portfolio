import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly proceedButton: Locator;
  readonly cartItems: Locator;
  readonly productQuantity: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.proceedButton = page.getByTestId('proceed-1');
    this.cartItems = page.locator('tbody tr');
    this.productQuantity = page.getByTestId('product-quantity');
    this.deleteButton = page.locator('.btn-danger, [data-test="btn-delete"]');
  }

  async proceedToCheckout(): Promise<void> {
    await this.proceedButton.click();
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async deleteItem(index: number = 0): Promise<void> {
    await this.deleteButton.nth(index).click();
  }
}
