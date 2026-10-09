import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  attachmentPath?: string;
}

export class ContactPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectSelect: Locator;
  readonly messageInput: Locator;
  readonly attachmentInput: Locator;
  readonly submitButton: Locator;
  readonly successAlert: Locator;
  readonly errorAlerts: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.emailInput = page.getByTestId('email');
    this.subjectSelect = page.getByTestId('subject');
    this.messageInput = page.getByTestId('message');
    this.attachmentInput = page.getByTestId('attachment').or(page.locator('input[type="file"]'));
    this.submitButton = page.getByTestId('contact-submit').or(page.locator('input[type="submit"], button[type="submit"]'));
    this.successAlert = page.locator('.alert-success');
    this.errorAlerts = page.locator('.alert-danger, .invalid-feedback');
  }

  async goto(): Promise<void> {
    await this.page.goto('/contact');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async fillForm(data: ContactFormData): Promise<void> {
    if (data.firstName) await this.firstNameInput.fill(data.firstName);
    if (data.lastName) await this.lastNameInput.fill(data.lastName);
    if (data.email) await this.emailInput.fill(data.email);
    if (data.subject) await this.subjectSelect.selectOption({ label: data.subject });
    if (data.message) await this.messageInput.fill(data.message);

    if (data.attachmentPath) {
      await this.attachmentInput.setInputFiles(data.attachmentPath);
    }
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async getSuccessMessage(): Promise<string> {
    await this.successAlert.waitFor({ state: 'visible', timeout: 10000 });
    return (await this.successAlert.textContent()) || '';
  }

  async getErrorCount(): Promise<number> {
    return await this.errorAlerts.count();
  }
}
