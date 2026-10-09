import { test, expect } from '../../src/fixtures/test.fixture';
import * as path from 'path';

test.describe('Contact Form Tests @smoke', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.goto();
  });

  test('TC01 - Validate required field errors on empty submission', async ({ contactPage, page }) => {
    await contactPage.submit();
    
    // Validation messages should appear for required fields
    const errorCount = await contactPage.getErrorCount();
    expect(errorCount).toBeGreaterThan(0);
    
    // Specific field validations
    await expect(page.locator('#first_name, [data-test="first-name"]')).toHaveClass(/is-invalid|ng-invalid/);
    await expect(page.locator('#last_name, [data-test="last-name"]')).toHaveClass(/is-invalid|ng-invalid/);
    await expect(page.locator('#email, [data-test="email"]')).toHaveClass(/is-invalid|ng-invalid/);
  });

  test('TC02 - Validate invalid email format error', async ({ contactPage, page }) => {
    await contactPage.fillForm({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'invalid-email-format',
      subject: 'Warranty',
      message: 'This is a test message to report a tool defect with warranty.',
    });
    await contactPage.submit();

    await expect(page.locator('#email, [data-test="email"]')).toHaveClass(/is-invalid|ng-invalid/);
  });

  test('TC03 - Successful contact form submission with file upload', async ({ contactPage, page }) => {
    const attachmentPath = path.resolve(__dirname, '../fixtures/sample-attachment.txt');

    await contactPage.fillForm({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      subject: 'Customer service',
      message: 'Hello, I have an inquiry regarding product warranty and repair services. Thanks!',
      attachmentPath,
    });

    const submitResponse = page.waitForResponse(
      (res) => res.url().includes('/messages') && res.status() === 200
    ).catch(() => null);

    await contactPage.submit();
    await submitResponse;

    const successMsg = await contactPage.getSuccessMessage();
    expect(successMsg.toLowerCase()).toContain('thanks for your message');
  });
});
