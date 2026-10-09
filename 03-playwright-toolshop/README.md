# Playwright + TypeScript Automation Framework: Toolshop

An enterprise-grade, end-to-end test automation framework built with **Playwright** and **TypeScript** (strict mode) targeting the [Practice Software Testing Toolshop](https://practicesoftwaretesting.com/) web platform and its REST API ([api.practicesoftwaretesting.com](https://api.practicesoftwaretesting.com)).

---

## 🌟 Key Features & Capabilities

- **Strict TypeScript Architecture**: Typed models, interfaces, union types, and typed fixtures preventing runtime type regressions.
- **Custom Fixtures & Typed POM**: Page objects (`HomePage`, `ProductDetailPage`, `CartPage`, `CheckoutPage`, `ContactPage`, `LoginPage`) injected cleanly through extended test fixtures (`test.fixture.ts`).
- **Global Authentication Setup**: Session caching using `storageState` (`.auth/customer.json` and `.auth/admin.json`) allowing isolated, pre-authenticated test runs without redundant UI logins.
- **Data-Driven Checkout**: Parameterized test matrix covering all 5 payment methods (*Bank Transfer*, *Cash on Delivery*, *Credit Card*, *Buy Now Pay Later*, *Gift Card*).
- **Reusable Sort Helper (`isSorted`)**: Generic utility validating alphabetical and numerical ascending/descending order across dynamic product sets.
- **Network Mocking (`page.route`)**: Route-level interception simulating 500 internal server errors, empty product catalog states, slow network latency (3G simulation), and blocked media requests.
- **Hybrid Testing (`@hybrid`)**: Dual-layer verification setting up orders and user profile states via REST API and validating UI synchronization in real-time.
- **Visual Regression Testing (`@visual`)**: Baseline snapshot testing via `toHaveScreenshot()` with dynamic element masking for prices, images, and build footers across desktop and mobile Pixel 7 emulation.
- **Multi-Browser & Mobile Execution**: Chromium, Firefox, WebKit, and Mobile Chrome (Pixel 7).

---

## 📁 Repository Structure

```text
03-playwright-toolshop/
├── .auth/                        # Git-ignored session storage states (customer.json, admin.json)
├── src/
│   ├── fixtures/
│   │   └── test.fixture.ts       # Extended Playwright test fixtures with typed POM
│   ├── models/
│   │   ├── product.model.ts      # Product and sort option interfaces
│   │   └── user.model.ts         # User, credentials, and payment method types
│   ├── pages/
│   │   ├── BasePage.ts           # Header, navigation, and common utility methods
│   │   ├── CartPage.ts           # Cart line items, count, and checkout progression
│   │   ├── CheckoutPage.ts       # Multi-step checkout & payment handlers
│   │   ├── ContactPage.ts        # Contact form inputs & file upload
│   │   ├── HomePage.ts           # Catalog filters, search, and sorting
│   │   ├── LoginPage.ts          # Authentication page object
│   │   └── ProductDetailPage.ts  # Quantity selection & add-to-cart
│   └── utils/
│       └── sort-helper.ts        # Typed isSorted() assertion helper
├── tests/
│   ├── api/
│   │   └── toolshop-api.spec.ts  # 18 comprehensive REST API tests (@api)
│   ├── fixtures/
│   │   └── sample-attachment.txt # Sample file for file upload tests
│   ├── hybrid/
│   │   └── hybrid-order.spec.ts  # API state seeding + UI validation (@hybrid)
│   ├── network/
│   │   └── network-mocking.spec.ts # page.route failure and latency mocks
│   ├── ui/
│   │   ├── checkout.spec.ts      # Data-driven 5 payment methods checkout
│   │   ├── contact.spec.ts       # Form validation & file upload
│   │   └── search-filter-sort.spec.ts # Search, category/brand, and isSorted tests
│   ├── visual/
│   │   └── visual-regression.spec.ts  # Visual snapshot regression with masking (@visual)
│   └── auth.setup.ts             # Global authentication project
├── playwright.config.ts          # Playwright test configuration
├── tsconfig.json                 # Strict TypeScript configuration
├── .eslintrc.json                # ESLint rules
└── package.json                  # Scripts and dependencies
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ LTS
- **npm**: v9+

### 2. Installation
```powershell
cd 03-playwright-toolshop
npm install
npx playwright install chromium
```

---

## 🧪 Running Tests

| Script | Description |
| :--- | :--- |
| `npm run test` | Runs all suites across configured browser projects |
| `npm run test:smoke` | Runs core end-to-end smoke tests (`@smoke`) |
| `npm run test:api` | Runs the 18 REST API endpoint test cases (`@api`) |
| `npm run test:hybrid` | Runs the API + UI hybrid tests (`@hybrid`) |
| `npm run test:visual` | Runs visual regression snapshot comparison (`@visual`) |
| `npm run test:chromium` | Runs all test suites on Chromium Desktop |
| `npm run test:mobile` | Runs all tests under Pixel 7 mobile emulation |
| `npm run test:ui` | Launches interactive Playwright UI Mode |
| `npm run report` | Opens the interactive HTML test report |

---

## 📊 Test Coverage Matrix

| Test Suite | Spec File | Test Cases | Tags | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Auth Setup** | `tests/auth.setup.ts` | 1 | `setup` | Pre-authenticates customer and admin accounts, saving session tokens to `.auth/` |
| **Search, Filter, Sort** | `tests/ui/search-filter-sort.spec.ts` | 7 | `@smoke` | Verifies product search, category and brand filters, and 4 sort configurations using `isSorted()` |
| **Data-Driven Checkout** | `tests/ui/checkout.spec.ts` | 5 | `@smoke` | Parameterized tests verifying all 5 payment methods (Bank, COD, Card, BNPL, Gift Card) |
| **Contact Form** | `tests/ui/contact.spec.ts` | 3 | `@smoke` | Required field validation, email format validation, and file attachment upload |
| **REST API Suite** | `tests/api/toolshop-api.spec.ts` | 18 | `@api` | Login, current user profile, pagination, search, single product, categories tree, brands, invoices |
| **Hybrid Testing** | `tests/hybrid/hybrid-order.spec.ts` | 2 | `@hybrid` | Invoices and profile synchronization between backend REST API and UI account pages |
| **Network Mocking** | `tests/network/network-mocking.spec.ts` | 4 | - | 500 error interception, empty product list mock, slow 3G network throttle, image abort |
| **Visual Regression** | `tests/visual/visual-regression.spec.ts` | 2 | `@visual` | Layout pixel comparison with element masking for dynamic prices, images, and footers |
| **Total** | | **42 Tests** | | |

---

## 🔍 Defects & Observations Discovered

1. **Search Substring Matching**: Searching for `"pliers"` returned `"Bolt Cutters"` because the backend search index performs a full-text search against product descriptions rather than strictly matching the name title.
2. **CDN IPv6 Handshake Bottlenecks**: In certain ISP environments, Cloudflare's IPv6 CDN nodes experienced TLS negotiation timeouts. Addressed transparently using Playwright's `launchOptions.args` with host mapping rules targeting the origin server.
3. **Empty Credentials HTTP Status**: The `/users/login` endpoint returns HTTP `401 Unauthorized` (`{"error": "Invalid login request"}`) rather than `422 Unprocessable Entity` when empty strings are provided.

---

## ⚖️ Framework Comparison: Selenium vs. Cypress vs. Playwright

| Feature / Metric | Selenium WebDriver | Cypress | Playwright |
| :--- | :--- | :--- | :--- |
| **Architecture** | JSON Wire Protocol / W3C WebDriver HTTP calls to external drivers | Runs directly inside browser runtime iframe | Uses Chrome DevTools Protocol (CDP) & native WebSocket connection |
| **Execution Speed** | Moderate to Slow (per-action HTTP roundtrips) | Fast (in-browser DOM events) | **Ultra Fast** (native binary protocols, zero HTTP overhead) |
| **Multi-Tab / Multi-Window** | Supported via window handles | Not natively supported | **Full Native Support** (`browserContext`, multi-page isolation) |
| **Cross-Browser** | Chromium, Firefox, Safari, Edge, IE | Chromium, Firefox, WebKit (experimental) | **Chromium, Firefox, WebKit, Mobile Emulation** |
| **Network Interception** | Requires external proxy (BrowserMob) or BiDi | `cy.intercept()` (limited WebSocket support) | **Native `page.route`**, request throttling, abort, mock fulfill |
| **API Testing** | Requires external libraries (RestAssured, HttpClient) | `cy.request()` | **Built-in `request` APIRequestContext** |
| **Auto-Waiting** | Manual explicit waits (`WebDriverWait`, `ExpectedConditions`) | Built-in retry-ability on DOM assertions | **Built-in smart auto-waiting** for actionable elements |
| **Parallel Execution** | Via TestNG/JUnit surefire threads (heavy memory footprint) | Paid Cypress Cloud or complex matrix orchestration | **Free, built-in worker processes** (`fullyParallel: true`) |
| **Authentication State** | Manual cookie injection or repetitive UI login | `cy.session()` | **`storageState` files** shared across worker contexts |
| **Visual Testing** | External tools required (Applitools, Percy) | Requires plugins (`cypress-image-snapshot`) | **Built-in `toHaveScreenshot()`** with masking & pixel thresholds |
| **Debugging Tools** | IDE breakpoints, browser devtools | Cypress Test Runner timeline | **Playwright Inspector, Trace Viewer, UI Mode, Video/Trace recordings** |

---

## 🔍 Debugging with Trace Viewer & HTML Reports

To view test results and traces:
```powershell
# Open the HTML report
npx playwright show-report

# Inspect a specific failed test trace
npx playwright show-trace test-results/<folder-name>/trace.zip
```
