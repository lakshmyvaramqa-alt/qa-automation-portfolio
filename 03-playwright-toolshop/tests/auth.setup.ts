import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const authDir = path.resolve(__dirname, '../.auth');
const API_BASE_URL = 'https://api.practicesoftwaretesting.com';

function saveStorageState(filePath: string, token: string) {
  const state = {
    cookies: [],
    origins: [
      {
        origin: 'https://practicesoftwaretesting.com',
        localStorage: [
          {
            name: 'auth-token',
            value: token,
          },
        ],
      },
    ],
  };
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf-8');
}

setup('authenticate customer and admin', async ({ request }) => {
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  const customerPath = path.join(authDir, 'customer.json');
  const adminPath = path.join(authDir, 'admin.json');

  // Skip if valid auth states are already saved
  if (fs.existsSync(customerPath) && fs.existsSync(adminPath)) {
    try {
      const custData = JSON.parse(fs.readFileSync(customerPath, 'utf-8'));
      if (custData?.origins?.[0]?.localStorage?.[0]?.value) {
        return;
      }
    } catch {
      // Continue to re-generate if malformed
    }
  }

  // 1. Authenticate Customer via API
  const customerRes = await request.post(`${API_BASE_URL}/users/login`, {
    data: { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
    timeout: 10000,
  }).catch(() => null);

  if (customerRes && customerRes.ok()) {
    const custData = await customerRes.json();
    saveStorageState(customerPath, custData.access_token);
  }

  // 2. Authenticate Admin via API
  const adminRes = await request.post(`${API_BASE_URL}/users/login`, {
    data: { email: 'admin@practicesoftwaretesting.com', password: 'welcome01' },
    timeout: 10000,
  }).catch(() => null);

  if (adminRes && adminRes.ok()) {
    const adminData = await adminRes.json();
    saveStorageState(adminPath, adminData.access_token);
  }
});
