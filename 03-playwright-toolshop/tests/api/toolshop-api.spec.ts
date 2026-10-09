import { test, expect } from '@playwright/test';

const API_BASE = 'https://api.practicesoftwaretesting.com';

test.describe('Toolshop REST API Test Suite @api', () => {
  let customerToken: string;
  let adminToken: string;
  let sampleProductId: string;
  let sampleBrandId: string;

  test.beforeAll(async ({ request }) => {
    // 1. Authenticate Customer
    const custRes = await request.post(`${API_BASE}/users/login`, {
      data: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
    });
    expect(custRes.status()).toBe(200);
    const custData = await custRes.json();
    customerToken = custData.access_token;

    // 2. Authenticate Admin
    const adminRes = await request.post(`${API_BASE}/users/login`, {
      data: { email: 'admin@practicesoftwaretesting.com', password: 'welcome01' },
    });
    expect(adminRes.status()).toBe(200);
    const adminData = await adminRes.json();
    adminToken = adminData.access_token;

    // 3. Fetch a sample product ID
    const prodRes = await request.get(`${API_BASE}/products`);
    expect(prodRes.status()).toBe(200);
    const prodData = await prodRes.json();
    sampleProductId = prodData.data[0].id;

    // 4. Fetch a sample brand ID
    const brandRes = await request.get(`${API_BASE}/brands`);
    expect(brandRes.status()).toBe(200);
    const brandData = await brandRes.json();
    sampleBrandId = brandData[0].id;
  });

  // --- AUTHENTICATION ENDPOINTS ---

  test('API-01: Login customer with valid credentials returns 200 and token', async ({ request }) => {
    const res = await request.post(`${API_BASE}/users/login`, {
      data: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('access_token');
    expect(body).toHaveProperty('token_type', 'bearer');
    expect(typeof body.access_token).toBe('string');
  });

  test('API-02: Login with invalid password returns 401 Unauthorized', async ({ request }) => {
    const res = await request.post(`${API_BASE}/users/login`, {
      data: { email: 'invalid-user-for-testing@example.com', password: 'wrongpassword' },
    });
    expect(res.status()).toBe(401);
  });

  test('API-03: Login with empty credentials returns 401 or 422', async ({ request }) => {
    const res = await request.post(`${API_BASE}/users/login`, {
      data: { email: '', password: '' },
    });
    expect([400, 401, 422]).toContain(res.status());
  });

  test('API-04: Login admin credentials returns 200 and admin token', async ({ request }) => {
    const res = await request.post(`${API_BASE}/users/login`, {
      data: { email: 'admin@practicesoftwaretesting.com', password: 'welcome01' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.access_token).toBeDefined();
  });

  test('API-05: Get current customer profile with valid Bearer token', async ({ request }) => {
    const res = await request.get(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    expect(res.status()).toBe(200);
    const profile = await res.json();
    expect(profile).toHaveProperty('email', 'customer@practicesoftwaretesting.com');
  });

  test('API-06: Get user profile without token returns 401 Unauthorized', async ({ request }) => {
    const res = await request.get(`${API_BASE}/users/me`);
    expect(res.status()).toBe(401);
  });

  // --- PRODUCT ENDPOINTS ---

  test('API-07: Get products returns 200 and paginated structure', async ({ request }) => {
    const res = await request.get(`${API_BASE}/products`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body).toHaveProperty('total');
  });

  test('API-08: Get products page 2 returns distinct page results', async ({ request }) => {
    const res = await request.get(`${API_BASE}/products?page=2`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('current_page', 2);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('API-09: Search products with query returns matching items', async ({ request }) => {
    const res = await request.get(`${API_BASE}/products/search?q=hammer`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test('API-10: Get single product by valid ID returns 200 with product details', async ({ request }) => {
    const res = await request.get(`${API_BASE}/products/${sampleProductId}`);
    expect(res.status()).toBe(200);
    const product = await res.json();
    expect(product).toHaveProperty('id', sampleProductId);
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
  });

  test('API-11: Get product by non-existent ID returns 404 Not Found', async ({ request }) => {
    const res = await request.get(`${API_BASE}/products/non-existent-id-99999`);
    expect(res.status()).toBe(404);
  });

  // --- CATEGORIES ENDPOINTS ---

  test('API-12: Get all categories returns 200 with categories array', async ({ request }) => {
    const res = await request.get(`${API_BASE}/categories`);
    expect(res.status()).toBe(200);
    const categories = await res.json();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toHaveProperty('name');
  });

  test('API-13: Get category tree returns nested hierarchy', async ({ request }) => {
    const res = await request.get(`${API_BASE}/categories/tree`);
    expect(res.status()).toBe(200);
    const tree = await res.json();
    expect(Array.isArray(tree)).toBe(true);
    expect(tree[0]).toHaveProperty('sub_categories');
  });

  // --- BRANDS ENDPOINTS ---

  test('API-14: Get all brands returns 200 with brands list', async ({ request }) => {
    const res = await request.get(`${API_BASE}/brands`);
    expect(res.status()).toBe(200);
    const brands = await res.json();
    expect(Array.isArray(brands)).toBe(true);
    expect(brands.length).toBeGreaterThan(0);
    expect(brands[0]).toHaveProperty('name');
  });

  test('API-15: Get brand by valid ID returns 200 with brand info', async ({ request }) => {
    const res = await request.get(`${API_BASE}/brands/${sampleBrandId}`);
    expect(res.status()).toBe(200);
    const brand = await res.json();
    expect(brand).toHaveProperty('id', sampleBrandId);
    expect(brand).toHaveProperty('name');
  });

  // --- INVOICES ENDPOINTS ---

  test('API-16: Get invoices with customer auth token returns 200', async ({ request }) => {
    const res = await request.get(`${API_BASE}/invoices`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    expect(res.status()).toBe(200);
    const invoices = await res.json();
    expect(invoices).toHaveProperty('data');
    expect(Array.isArray(invoices.data)).toBe(true);
  });

  test('API-17: Get invoices without authentication returns 401 Unauthorized', async ({ request }) => {
    const res = await request.get(`${API_BASE}/invoices`);
    expect(res.status()).toBe(401);
  });

  test('API-18: Get invoice by invalid ID returns 404 Not Found', async ({ request }) => {
    const res = await request.get(`${API_BASE}/invoices/invalid-id-999`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    expect(res.status()).toBe(404);
  });
});
