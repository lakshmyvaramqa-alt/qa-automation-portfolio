/**
 * Standalone High-Fidelity Local OWASP Juice Shop Server
 * 
 * Provides an exact emulation of OWASP Juice Shop REST API endpoints
 * for offline, repeatable, safe local performance testing.
 * Runs on Node.js standard library with ZERO external dependencies.
 */

const http = require('http');
const url = require('url');
const crypto = require('crypto');

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// In-memory catalog
const PRODUCTS = [
  { id: 1, name: 'Apple Juice (1000ml)', description: 'The all-time classic.', price: 1.99, deluxePrice: 0.99, image: 'apple_juice.jpg' },
  { id: 2, name: 'Orange Juice (1000ml)', description: 'Made from 100% freshly squeezed sweet Valencia oranges.', price: 2.99, deluxePrice: 1.99, image: 'orange_juice.jpg' },
  { id: 3, name: 'Eggfruit Juice (500ml)', description: 'Now with even more exotic flavour.', price: 8.99, deluxePrice: 7.49, image: 'eggfruit_juice.jpg' },
  { id: 4, name: 'Raspberry Juice (1000ml)', description: 'Made from fresh sweet organic raspberries.', price: 4.99, deluxePrice: 3.99, image: 'raspberry_juice.jpg' },
  { id: 5, name: 'Lemon Juice (500ml)', description: 'Sour but refreshing.', price: 2.49, deluxePrice: 1.79, image: 'lemon_juice.jpg' },
  { id: 6, name: 'Banana Juice (1000ml)', description: 'Rich in potassium and flavor.', price: 3.19, deluxePrice: 2.59, image: 'banana_juice.jpg' },
  { id: 7, name: 'OWASP Juice Shop "Permafrost" 2020 T-Shirt', description: 'Official merchandise.', price: 22.49, deluxePrice: 19.99, image: 'fan_shirt.jpg' },
  { id: 8, name: 'OWASP Juice Shop Logo (3D-printed)', description: 'Desk ornament for true fans.', price: 99.99, deluxePrice: 89.99, image: '3d_keychain.jpg' },
  { id: 9, name: 'OWASP Juice Shop Hoodie', description: 'Warm and comfortable hoodie.', price: 49.99, deluxePrice: 42.99, image: 'hoodie.jpg' },
  { id: 10, name: 'Green Smoothie', description: 'Healthy blend of spinach, kale, and green apples.', price: 3.99, deluxePrice: 2.99, image: 'green_smoothie.jpg' },
  { id: 11, name: 'Strawberry Juice (500ml)', description: 'Sweet summer strawberries in a bottle.', price: 3.49, deluxePrice: 2.89, image: 'strawberry_juice.jpeg' },
  { id: 12, name: 'OWASP Juice Shop Iron-Ons (16pcs)', description: 'Decorate everything with Juice Shop badges.', price: 14.99, deluxePrice: 11.99, image: 'iron-on.jpg' }
];

const REVIEWS = {
  1: [{ _id: 'r1', message: 'Tastes like autumn apples!', author: 'jim@juice-sh.op', likesCount: 4 }],
  2: [{ _id: 'r2', message: 'Best orange juice on the market.', author: 'bender@juice-sh.op', likesCount: 7 }],
  3: [{ _id: 'r3', message: 'Very exotic and creamy texture.', author: 'amy@juice-sh.op', likesCount: 1 }],
  6: [{ _id: 'r4', message: 'Great pre-workout energy boost.', author: 'admin@juice-sh.op', likesCount: 3 }]
};

// In-memory state
const USERS = new Map([
  ['admin@juice-sh.op', { id: 1, email: 'admin@juice-sh.op', password: 'admin123', bid: 1 }],
  ['jim@juice-sh.op', { id: 2, email: 'jim@juice-sh.op', password: 'ncc-1701', bid: 2 }],
  ['bender@juice-sh.op', { id: 3, email: 'bender@juice-sh.op', password: 'beer123', bid: 3 }],
  ['amy@juice-sh.op', { id: 4, email: 'amy@juice-sh.op', password: 'kif123', bid: 4 }]
]);

const BASKETS = new Map([
  [1, [{ id: 101, ProductId: 1, quantity: 2, Product: PRODUCTS[0] }]],
  [2, [{ id: 102, ProductId: 2, quantity: 1, Product: PRODUCTS[1] }]],
  [3, [{ id: 103, ProductId: 7, quantity: 1, Product: PRODUCTS[6] }]],
  [4, []]
]);

const FEEDBACKS = [];

let activeRequests = 0;
let requestCount = 0;

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Email',
    'X-Content-Type-Options': 'nosniff',
    'X-Powered-By': 'Express (Emulated Juice Shop)'
  });
  res.end(body);
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

// Generate simple mock JWT token
function generateMockJwt(userId, email, basketId) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    status: 'success',
    data: { id: userId, email: email, role: 'customer' },
    bid: basketId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 36000
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', 'perf-secret').update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${sig}`;
}

const server = http.createServer(async (req, res) => {
  requestCount++;
  activeRequests++;

  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    activeRequests--;
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Email'
    });
    res.end();
    return;
  }

  // Realistic simulation latency:
  // Base latency ~15-25ms. Under high concurrency (> 40 concurrent requests), adds slight saturation delay.
  let delay = Math.floor(15 + Math.random() * 20);
  if (activeRequests > 30) {
    delay += Math.min(200, (activeRequests - 30) * 8);
  }

  setTimeout(async () => {
    try {
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;

      // 1. Root / Health Check
      if (pathname === '/' || pathname === '/health') {
        sendJson(res, 200, {
          status: 'ok',
          app: 'OWASP Juice Shop (Performance Simulation Mode)',
          uptime: process.uptime(),
          requestsServed: requestCount,
          activeRequests: activeRequests
        });
        return;
      }

      // 2. Application Configuration
      if (pathname === '/rest/admin/application-configuration' && req.method === 'GET') {
        sendJson(res, 200, {
          status: 'success',
          config: {
            server: { port: PORT },
            application: {
              name: 'OWASP Juice Shop',
              logo: 'JuiceShop_Logo.png',
              favicon: 'favicon_js.ico',
              theme: 'bluegrey-lightgreen',
              showVersionNumber: true,
              showGitHubLinks: true
            }
          }
        });
        return;
      }

      // 3. Product Catalog & Search: /rest/products/search?q=...
      if (pathname === '/rest/products/search' && req.method === 'GET') {
        const query = (parsedUrl.query.q || '').toString().toLowerCase().trim();
        let matches = PRODUCTS;
        if (query) {
          matches = PRODUCTS.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
          );
        }
        sendJson(res, 200, {
          status: 'success',
          data: matches
        });
        return;
      }

      // 4. Product Reviews: /rest/products/:id/reviews
      const reviewsMatch = pathname.match(/^\/rest\/products\/(\d+)\/reviews$/);
      if (reviewsMatch && req.method === 'GET') {
        const prodId = parseInt(reviewsMatch[1], 10);
        const reviews = REVIEWS[prodId] || [];
        sendJson(res, 200, {
          status: 'success',
          data: reviews
        });
        return;
      }

      // 5. User Authentication / Login: POST /rest/user/login
      if (pathname === '/rest/user/login' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const email = (body.email || '').trim();
        const password = (body.password || '').trim();

        let user = USERS.get(email);
        // If not found in default list, auto-authenticate for performance testing load accounts
        if (!user) {
          const newId = USERS.size + 1;
          user = { id: newId, email: email, password: password, bid: newId };
          USERS.set(email, user);
          BASKETS.set(newId, []);
        }

        const token = generateMockJwt(user.id, user.email, user.bid);
        sendJson(res, 200, {
          authentication: {
            token: token,
            bid: user.bid,
            umail: user.email
          }
        });
        return;
      }

      // 6. User Registration: POST /api/Users
      if (pathname === '/api/Users' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const email = (body.email || `user_${Date.now()}@juice-sh.op`).trim();
        const newId = USERS.size + 1;
        const newUser = { id: newId, email: email, password: body.password || 'password123', bid: newId };
        USERS.set(email, newUser);
        BASKETS.set(newId, []);

        sendJson(res, 201, {
          status: 'success',
          data: {
            id: newId,
            email: email,
            isActive: true,
            createdAt: new Date().toISOString()
          }
        });
        return;
      }

      // 7. Get Basket Details: GET /rest/basket/:id
      const basketMatch = pathname.match(/^\/rest\/basket\/(\d+)$/);
      if (basketMatch && req.method === 'GET') {
        const basketId = parseInt(basketMatch[1], 10);
        const items = BASKETS.get(basketId) || [];
        sendJson(res, 200, {
          status: 'success',
          data: {
            id: basketId,
            coupon: null,
            Products: items
          }
        });
        return;
      }

      // 8. Add Item to Basket: POST /api/BasketItems
      if (pathname === '/api/BasketItems' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const basketId = parseInt(body.BasketId || 1, 10);
        const productId = parseInt(body.ProductId || 1, 10);
        const quantity = parseInt(body.quantity || 1, 10);

        let basket = BASKETS.get(basketId);
        if (!basket) {
          basket = [];
          BASKETS.set(basketId, basket);
        }

        const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
        const existingItem = basket.find(item => item.ProductId === productId);
        let itemId;

        if (existingItem) {
          existingItem.quantity += quantity;
          itemId = existingItem.id;
        } else {
          itemId = Date.now() + Math.floor(Math.random() * 1000);
          basket.push({
            id: itemId,
            ProductId: productId,
            quantity: quantity,
            Product: product
          });
        }

        sendJson(res, 200, {
          status: 'success',
          data: {
            id: itemId,
            BasketId: basketId,
            ProductId: productId,
            quantity: quantity
          }
        });
        return;
      }

      // 9. Captcha: GET /rest/captcha
      if (pathname === '/rest/captcha' && req.method === 'GET') {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        sendJson(res, 200, {
          captchaId: Date.now(),
          captcha: `${num1}+${num2}`,
          answer: String(num1 + num2)
        });
        return;
      }

      // 10. Customer Feedback: POST /api/Feedbacks
      if (pathname === '/api/Feedbacks' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const feedback = {
          id: FEEDBACKS.length + 1,
          comment: body.comment || 'Great juice collection!',
          rating: parseInt(body.rating || 5, 10),
          createdAt: new Date().toISOString()
        };
        FEEDBACKS.push(feedback);

        sendJson(res, 201, {
          status: 'success',
          data: feedback
        });
        return;
      }

      // Fallback 404
      sendJson(res, 404, {
        status: 'error',
        message: `Endpoint ${pathname} not found on emulated Juice Shop server`
      });

    } catch (err) {
      sendJson(res, 500, {
        status: 'error',
        message: err.message
      });
    } finally {
      activeRequests--;
    }
  }, delay);
});

server.listen(PORT, HOST, () => {
  console.log(`================================================================`);
  console.log(` OWASP Juice Shop Server running on http://${HOST}:${PORT}`);
  console.log(` Zero-dependency mock engine ready for JMeter performance suites`);
  console.log(`================================================================`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('\nJuice Shop server stopped gracefully.');
    process.exit(0);
  });
});
