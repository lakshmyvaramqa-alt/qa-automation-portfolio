import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;

  // Header navigation locators
  readonly navHome: Locator;
  readonly navContact: Locator;
  readonly navSignIn: Locator;
  readonly navUserMenu: Locator;
  readonly navCart: Locator;
  readonly cartQuantity: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navHome = page.getByTestId('nav-home');
    this.navContact = page.getByTestId('nav-contact');
    this.navSignIn = page.getByTestId('nav-sign-in');
    this.navUserMenu = page.getByTestId('nav-menu');
    this.navCart = page.getByTestId('nav-cart');
    this.cartQuantity = page.getByTestId('cart-quantity');
  }

  async navigateToHome(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clickContact(): Promise<void> {
    await this.navContact.click();
  }

  async clickSignIn(): Promise<void> {
    await this.navSignIn.click();
  }

  async clickCart(): Promise<void> {
    await this.navCart.click();
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartQuantity.textContent();
    return text ? parseInt(text.trim(), 10) : 0;
  }
}
