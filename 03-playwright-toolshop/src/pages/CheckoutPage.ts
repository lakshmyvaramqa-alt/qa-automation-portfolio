import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { PaymentDetails } from '../models/user.model';

export class CheckoutPage extends BasePage {
  readonly proceed1: Locator;
  readonly proceed2: Locator;
  readonly proceed3: Locator;
  readonly paymentMethodSelect: Locator;
  readonly finishButton: Locator;
  readonly orderConfirmation: Locator;

  // Bank Transfer Fields
  readonly bankNameInput: Locator;
  readonly accountNameInput: Locator;
  readonly accountNumberInput: Locator;

  // Credit Card Fields
  readonly creditCardNumberInput: Locator;
  readonly expirationDateInput: Locator;
  readonly cvvInput: Locator;
  readonly cardHolderNameInput: Locator;

  // Buy Now Pay Later
  readonly monthlyInstallmentsSelect: Locator;

  // Gift Card
  readonly giftCardNumberInput: Locator;
  readonly validationCodeInput: Locator;

  constructor(page: Page) {
    super(page);
    this.proceed1 = page.getByTestId('proceed-1');
    this.proceed2 = page.getByTestId('proceed-2');
    this.proceed3 = page.getByTestId('proceed-3');
    this.paymentMethodSelect = page.getByTestId('payment-method');
    this.finishButton = page.getByTestId('finish');
    this.orderConfirmation = page.locator('#order-confirmation, .help-block, .alert-success');

    // Payment fields
    this.bankNameInput = page.getByTestId('bank_name');
    this.accountNameInput = page.getByTestId('account_name');
    this.accountNumberInput = page.getByTestId('account_number');

    this.creditCardNumberInput = page.getByTestId('credit_card_number');
    this.expirationDateInput = page.getByTestId('expiration_date');
    this.cvvInput = page.getByTestId('cvv');
    this.cardHolderNameInput = page.getByTestId('card_holder_name');

    this.monthlyInstallmentsSelect = page.getByTestId('monthly_installments');

    this.giftCardNumberInput = page.getByTestId('gift_card_number');
    this.validationCodeInput = page.getByTestId('validation_code');
  }

  async proceedThroughSteps(): Promise<void> {
    if (await this.proceed1.isVisible()) {
      await this.proceed1.click();
    }
    if (await this.proceed2.isVisible()) {
      await this.proceed2.click();
    }
    if (await this.proceed3.isVisible()) {
      await this.proceed3.click();
    }
  }

  async selectPaymentMethod(payment: PaymentDetails): Promise<void> {
    await this.paymentMethodSelect.selectOption(payment.method);

    switch (payment.method) {
      case 'bank-transfer':
        await this.bankNameInput.fill(payment.bankName || 'Demo Bank');
        await this.accountNameInput.fill(payment.accountName || 'Jane Doe');
        await this.accountNumberInput.fill(payment.accountNumber || '123456789');
        break;

      case 'cash-on-delivery':
        // No additional input fields required
        break;

      case 'credit-card':
        await this.creditCardNumberInput.fill(payment.creditCardNumber || '1111-2222-3333-4444');
        await this.expirationDateInput.fill(payment.expirationDate || '12/2028');
        await this.cvvInput.fill(payment.cvv || '123');
        await this.cardHolderNameInput.fill(payment.cardHolderName || 'Jane Doe');
        break;

      case 'buy-now-pay-later':
        await this.monthlyInstallmentsSelect.selectOption(payment.monthlyInstallments || '3');
        break;

      case 'gift-card':
        await this.giftCardNumberInput.fill(payment.giftCardNumber || 'GIFT-12345');
        await this.validationCodeInput.fill(payment.validationCode || '1234');
        break;
    }
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async isOrderConfirmed(): Promise<boolean> {
    await this.orderConfirmation.first().waitFor({ state: 'visible', timeout: 15000 });
    const text = await this.orderConfirmation.first().textContent();
    return !!text && (text.includes('Thanks for your order') || text.includes('confirmed') || text.includes('successful'));
  }
}
