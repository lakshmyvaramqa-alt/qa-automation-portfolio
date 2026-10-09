import { test, expect } from '../../src/fixtures/test.fixture';
import { PaymentDetails } from '../../src/models/user.model';

const paymentTestCases: { name: string; payment: PaymentDetails }[] = [
  {
    name: 'Bank Transfer',
    payment: {
      method: 'bank-transfer',
      bankName: 'Test Bank NV',
      accountName: 'Jane Doe',
      accountNumber: 'NL91ABNA0417164300',
    },
  },
  {
    name: 'Cash on Delivery',
    payment: {
      method: 'cash-on-delivery',
    },
  },
  {
    name: 'Credit Card',
    payment: {
      method: 'credit-card',
      creditCardNumber: '4111-2222-3333-4444',
      expirationDate: '12/2028',
      cvv: '123',
      cardHolderName: 'Jane Doe',
    },
  },
  {
    name: 'Buy Now Pay Later',
    payment: {
      method: 'buy-now-pay-later',
      monthlyInstallments: '3',
    },
  },
  {
    name: 'Gift Card',
    payment: {
      method: 'gift-card',
      giftCardNumber: 'GIFT-99887766',
      validationCode: '1234',
    },
  },
];

test.describe('Data-Driven Checkout Suite @smoke', () => {
  // Use saved authenticated customer state
  test.use({ storageState: '.auth/customer.json' });

  for (const { name, payment } of paymentTestCases) {
    test(`Checkout with ${name} and verify order confirmation`, async ({
      homePage,
      productDetailPage,
      cartPage,
      checkoutPage,
      page,
    }) => {
      // 1. Navigate to home and add first product to cart
      await homePage.navigateToHome();
      await homePage.clickProduct(0);
      await productDetailPage.addToCart();

      // 2. Go to Cart
      await homePage.clickCart();
      await expect(page).toHaveURL(/.*checkout/);

      // 3. Step 1: Cart proceed
      await page.getByTestId('proceed-1').click();

      // 4. Step 2: Sign-in step (already signed in via storageState)
      const proceed2 = page.getByTestId('proceed-2');
      await proceed2.waitFor({ state: 'visible', timeout: 10000 });
      await proceed2.click();

      // 5. Step 3: Billing Address step
      const stateInput = page.getByTestId('state');
      if (await stateInput.isVisible()) {
        const currentVal = await stateInput.inputValue();
        if (!currentVal) {
          await page.getByTestId('address').fill('123 Toolshop Ave');
          await page.getByTestId('city').fill('Amsterdam');
          await stateInput.fill('North Holland');
          await page.getByTestId('postal_code').fill('1012AB');
          await page.getByTestId('country').fill('Netherlands');
        }
      }
      const proceed3 = page.getByTestId('proceed-3');
      await proceed3.waitFor({ state: 'visible', timeout: 10000 });
      await proceed3.click();

      // 6. Step 4: Payment Selection
      await checkoutPage.selectPaymentMethod(payment);

      // 7. Finish Order
      await checkoutPage.finishOrder();

      // 8. Verify confirmation
      const isConfirmed = await checkoutPage.isOrderConfirmed();
      expect(isConfirmed).toBe(true);
    });
  }
});
