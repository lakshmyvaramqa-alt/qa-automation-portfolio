# Cypress + JavaScript Automation Framework: Demoblaze

A modern, production-grade test automation framework built with **Cypress** and **JavaScript** targeting the [Demoblaze](https://www.demoblaze.com/) e-commerce platform and its underlying REST API ([api.demoblaze.com](https://api.demoblaze.com)).

---

## 🌟 Key Features & Capabilities

- **Modern JavaScript Architecture**: ES6+ modules, const/let, arrow functions, and array iteration methods (`map`, `filter`, `forEach`).
- **Page Object Model (POM)**: Fully decoupled, reusable page objects (`Navbar`, `HomePage`, `ProductPage`, `CartPage`, `PlaceOrderModal`, `ContactModal`, `LoginModal`, `SignupModal`).
- **Custom Commands & Fixtures**: Encapsulated reusable business logic (`cy.signup`, `cy.login`, `cy.addProductToCart`, `cy.fillOrderForm`) with parameterized fixture data (`users.json`, `order.json`, `contact.json`).
- **Session Caching (`cy.session`)**: Blazing fast, cached login sessions guaranteeing order-independent test execution without repetitive UI logins.
- **Strictly No Hardcoded Waits**: 100% free of arbitrary `cy.wait(ms)`—all asynchronous network requests are coordinated through `cy.intercept` aliases (`@alias`) and Cypress automatic retry-ability.
- **Network Interception & Mocking**: Full control over network traffic using `cy.intercept` to spy on real traffic, mock empty catalogs (`[]`), inject `500 Internal Server Errors`, and simulate high-latency 3G network conditions.
- **Comprehensive REST API Test Suite**: Direct HTTP testing via `cy.request` against `/signup`, `/login`, `/view`, and `/bycat` (phone, notebook, monitor).
- **Mochawesome HTML Reporting**: Interactive HTML reports featuring pass/fail charts, execution duration analytics, and embedded failure screenshots.

---

## 📁 Repository Structure

```text
02-cypress-demoblaze/
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   └── demoblaze-api.cy.js        # 7 REST API endpoint tests (@api)
│   │   ├── network/
│   │   │   └── network-intercept.cy.js    # 4 Network interception & stubbing tests
│   │   └── ui/
│   │       ├── auth-modals.cy.js          # 5 Signup, Login, and Contact modal tests
│   │       ├── categories-pagination.cy.js # 6 Categories & pagination tests
│   │       ├── order-checkout.cy.js       # 5 Place Order positive & negative tests
│   │       ├── product-cart.cy.js         # 6 Product details, cart, & delete tests
│   │       └── session-auth.cy.js         # 3 Cached login session tests (cy.session)
│   ├── fixtures/
│   │   ├── contact.json                   # Sample contact inquiry payload
│   │   ├── order.json                     # Valid and partial checkout payloads
│   │   └── users.json                     # Valid and invalid credentials
│   └── support/
│       ├── pages/                         # Page Object Model classes
│       │   ├── CartPage.js
│       │   ├── ContactModal.js
│       │   ├── HomePage.js
│       │   ├── LoginModal.js
│       │   ├── Navbar.js
│       │   ├── PlaceOrderModal.js
│       │   ├── ProductPage.js
│       │   └── SignupModal.js
│       ├── commands.js                    # Custom Cypress commands
│       └── e2e.js                         # Global configuration & reporter registration
├── cypress.config.js                      # Cypress test runner configuration
├── package.json                           # Scripts and devDependencies
└── .gitignore                             # Git-ignored folders (node_modules, reports, videos)
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ LTS
- **npm**: v9+

### 2. Installation
```powershell
cd 02-cypress-demoblaze
npm ci
```

---

## 🧪 Running Tests

| Script | Command | Description |
| :--- | :--- | :--- |
| **All Tests** | `npm test` | Runs the full 36-test suite headless |
| **Chrome Headless** | `npm run test:chrome` | Runs all suites against Google Chrome |
| **Interactive UI Mode** | `npm run test:ui` | Opens the Cypress Test Runner app for visual debugging |
| **UI Suites Only** | `npm run test:e2e` | Runs only the user interface specifications |
| **API Suite Only** | `npm run test:api` | Runs the REST API endpoint tests |
| **Network Mocking** | `npm run test:network` | Runs the interception and stubbing test suite |

---

## 📊 Test Coverage Matrix (36 Total Tests)

| Test Suite | Spec File | Tests | Focus Area |
| :--- | :--- | :---: | :--- |
| **Categories & Pagination** | `categories-pagination.cy.js` | 6 | Default catalog, Phones filter, Laptops filter, Monitors filter, Next pagination, Prev pagination |
| **Product Details & Cart** | `product-cart.cy.js` | 6 | Title/price/description, Add to cart alert, Multi-product add, Total price summation, Delete item, Empty cart state |
| **Order Checkout Flow** | `order-checkout.cy.js` | 5 | Positive purchase with receipt validation, dismissal redirection, missing Name alert, missing Card alert, modal cancel |
| **Authentication & Modals** | `auth-modals.cy.js` | 5 | Unique user signup, duplicate signup error, invalid login alert, successful login display, contact form submission |
| **Cached Sessions** | `session-auth.cy.js` | 3 | `cy.session` persistence on homepage, cross-page navigation persistence, logout session invalidation |
| **REST API Testing** | `demoblaze-api.cy.js` | 7 | `/bycat` for phones, laptops, monitors, `/view` product details, `/login` token, invalid login, duplicate signup |
| **Network Interception** | `network-intercept.cy.js` | 4 | Request spying and payload validation, empty catalog stub (`[]`), 500 error resilience, slow 3G network throttle |
| **Total** | | **36 Tests** | *(Exceeds 25+ requirement)* |

---

## 🔍 Defects & Observations Discovered

1. **Password Encoding**: Demoblaze transfers passwords Base64-encoded (`btoa(password)`) to `https://api.demoblaze.com/login` and `/signup` rather than standard hashing protocols.
2. **Missing Input Format Validation**: The Place Order modal accepts any non-empty string for the credit card field without verifying Luhn algorithm validity or numeric constraints.
3. **HTTP 200 on Application Errors**: Authentication errors (e.g. wrong password or duplicate user registration) return HTTP status `200 OK` with JSON bodies containing `{"errorMessage": "..."}` rather than standard `400` or `401` HTTP status codes.
4. **SweetAlert 500ms Animation Gate**: Bootstrap-SweetAlert (v1.x) enforces an internal 500ms `setTimeout` before attaching the `.visible` CSS class. Confirmation clicks dispatched before this class is added are dropped by the library's `handleButton` guard, preventing redirection to the homepage.
5. **Pagination Route Design**: Both next and previous pagination buttons dispatch requests to the same `POST /pagination` endpoint (differentiated solely by payload IDs) rather than distinct endpoints.
6. **Asynchronous Cart Table Population**: Demoblaze renders cart rows via secondary `POST /view` requests fired after `POST /viewcart`. Submitting or calculating totals requires waiting for line-item DOM elements to finish rendering.

---

## 📄 Mochawesome Reporting

Test execution automatically generates Mochawesome reports stored in `cypress/reports/`. To inspect HTML reports:
```powershell
npm run report:generate
```
Open `cypress/reports/report.html` in any browser to inspect interactive pass/fail metrics, step durations, and execution artifacts.
