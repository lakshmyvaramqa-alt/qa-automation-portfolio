import { test, expect } from '../../src/fixtures/test.fixture';

const API_BASE = 'https://api.practicesoftwaretesting.com';

test.describe('Hybrid API and UI Verification Suite @hybrid', () => {
  test.use({ storageState: '.auth/customer.json' });

  test('TC01 - Verify customer invoices created in API reflect accurately in UI', async ({
    page,
    request,
  }) => {
    // 1. API: Obtain Customer Token
    const loginRes = await request.post(`${API_BASE}/users/login`, {
      data: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
    });
    expect(loginRes.status()).toBe(200);
    const { access_token } = await loginRes.json();

    // 2. API: Fetch customer invoices from backend
    const invoicesRes = await request.get(`${API_BASE}/invoices`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    expect(invoicesRes.status()).toBe(200);
    const invoiceData = await invoicesRes.json();
    const apiInvoices: Array<{ invoice_number: string; total: number }> = invoiceData.data || [];

    // 3. UI: Ensure session is loaded and navigate to Invoices
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('nav-menu')).toBeVisible({ timeout: 15000 });

    await page.getByTestId('nav-menu').click();
    await page.getByTestId('nav-my-invoices').click();
    await expect(page).toHaveURL(/.*invoices/);

    // 4. UI: If customer has existing invoices, verify match in table
    if (apiInvoices.length > 0) {
      const firstInvoice = apiInvoices[0];
      await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 10000 });
      const tableText = await page.locator('tbody').textContent();
      expect(tableText).toContain(firstInvoice.invoice_number);
    } else {
      // Graceful empty state verification
      await expect(page.locator('h1, h2, table, .alert-info').first()).toBeVisible();
    }
  });

  test('TC02 - Verify user profile details fetched via API match the UI Account page', async ({
    page,
    request,
  }) => {
    // 1. API: Fetch Customer Profile
    const loginRes = await request.post(`${API_BASE}/users/login`, {
      data: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
    });
    const { access_token } = await loginRes.json();

    const profileRes = await request.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    expect(profileRes.status()).toBe(200);
    const profile = await profileRes.json();

    // 2. UI: Navigate via menu to Profile
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('nav-menu')).toBeVisible({ timeout: 15000 });

    await page.getByTestId('nav-menu').click();
    await page.getByTestId('nav-profile').click();
    await expect(page).toHaveURL(/.*profile/);

    // 3. UI: Verify form fields are hydrated with API profile values
    await expect(page.getByTestId('first-name')).toHaveValue(profile.first_name, { timeout: 10000 });
    await expect(page.getByTestId('last-name')).toHaveValue(profile.last_name, { timeout: 10000 });
    await expect(page.getByTestId('email')).toHaveValue(profile.email, { timeout: 10000 });
  });
});
