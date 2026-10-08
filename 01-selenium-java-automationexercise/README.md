# 01-selenium-java-automationexercise

![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Selenium](https://img.shields.io/badge/Selenium_4-43B02A?style=for-the-badge&logo=selenium&logoColor=white)
![TestNG](https://img.shields.io/badge/TestNG-FF7F00?style=for-the-badge&logo=testng&logoColor=white)
![Maven](https://img.shields.io/badge/Apache_Maven-C71A36?style=for-the-badge&logo=apache-maven&logoColor=white)
![Allure](https://img.shields.io/badge/Allure_Report-FF6C37?style=for-the-badge&logo=qameta&logoColor=white)

A production-style Test Automation Framework built with **Selenium 4**, **Java 17**, and **TestNG** that automates all **26 official test cases** for the e-commerce practice website [Automation Exercise](https://automationexercise.com/).

---

## 🏛 Framework Architecture

The framework adopts an enterprise-grade **Page Object Model (POM)** with fluent page chaining, ThreadLocal driver isolation, dynamic ad handling, and data-driven testing:

```
01-selenium-java-automationexercise/
├── pom.xml                                   # Dependencies & plugins (Java 17, Selenium 4, TestNG, Allure, Jackson)
├── testng.xml                                # Default TestNG suite configuration
├── testng-smoke.xml                          # Smoke suite configuration
├── testng-regression.xml                     # Full 26 test cases regression suite
├── testng-crossbrowser.xml                   # Parallel cross-browser execution suite
├── src/
│   ├── main/
│   │   ├── java/com/varalakshmy/
│   │   │   ├── config/
│   │   │   │   └── ConfigReader.java         # Centralized configuration reader with CLI overrides
│   │   │   ├── factory/
│   │   │   │   └── DriverFactory.java        # ThreadLocal WebDriver for Chrome, Firefox, Edge & Headless
│   │   │   ├── pages/
│   │   │   │   ├── BasePage.java             # Core waits, ad/popup dismisser, nav bar, page chaining
│   │   │   │   ├── HomePage.java             # Hero slider, recommended items, scroll controls
│   │   │   │   ├── LoginPage.java            # Login, signup, authentication validation
│   │   │   │   ├── AccountInformationPage.java# Registration form, address details
│   │   │   │   ├── AccountCreatedPage.java   # Post-creation confirmation
│   │   │   │   ├── AccountDeletedPage.java   # Account deletion confirmation
│   │   │   │   ├── ProductPage.java          # Product catalog, search, category & brand filters
│   │   │   │   ├── ProductDetailPage.java    # Product details, quantity, reviews
│   │   │   │   ├── CartPage.java             # Cart items, quantity verification, delete actions
│   │   │   │   ├── CheckoutPage.java         # Address validation, order comments, place order
│   │   │   │   ├── PaymentPage.java          # Card payment processing, invoice download
│   │   │   │   ├── ContactUsPage.java        # Contact form, file upload, JS alert handling
│   │   │   │   └── TestCasesPage.java        # Test cases page verification
│   │   │   └── utils/
│   │   │       └── JsonUtils.java            # Jackson JSON parser for DataProviders
│   │   └── resources/
│   │       └── config.properties             # Browser, URLs, timeouts, headless flag
│   └── test/
│       ├── java/com/varalakshmy/
│       │   ├── base/
│       │   │   └── BaseTest.java             # Setup/teardown lifecycle, cross-browser params, timings
│       │   ├── data/
│       │   │   └── TestData.java             # Dynamic test data generator (emails, users, payments)
│       │   ├── listeners/
│       │   │   └── AllureListener.java       # Automatic failure screenshot and log attachments
│       │   └── tests/
│       │       ├── AuthTests.java            # Test Cases 1-5 & Jackson DataProvider login test
│       │       ├── ContactUsAndStaticTests.java # Test Cases 6-7 (File upload, alerts, static pages)
│       │       ├── ProductCatalogTests.java  # Test Cases 8-9, 18-19, 21 (Search, categories, brands, reviews)
│       │       ├── SubscriptionTests.java    # Test Cases 10-11 (Newsletter subscriptions)
│       │       ├── CartAndQuantityTests.java # Test Cases 12-13, 17, 20, 22 (Cart operations & recommended items)
│       │       ├── OrderAndCheckoutTests.java# Test Cases 14-16, 23-24 (Checkout flows, addresses, invoices)
│       │       └── ScrollTests.java          # Test Cases 25-26 (Scroll up/down with and without arrow button)
│       └── resources/
│           ├── testdata/
│           │   └── users.json                # Test accounts for Jackson-driven tests
│           └── testfile.txt                  # Sample attachment for Contact Us upload
```

---

## 🎯 Official Test Cases Coverage (26 / 26)

| # | Test Case Title | Test Class | Status |
|---|---|---|---|
| 01 | Register User | `AuthTests` | ✅ Automated |
| 02 | Login User with correct email and password | `AuthTests` | ✅ Automated |
| 03 | Login User with incorrect email and password | `AuthTests` | ✅ Automated |
| 04 | Logout User | `AuthTests` | ✅ Automated |
| 05 | Register User with existing email | `AuthTests` | ✅ Automated |
| 06 | Contact Us Form (Upload + JS Alert) | `ContactUsAndStaticTests` | ✅ Automated |
| 07 | Verify Test Cases Page | `ContactUsAndStaticTests` | ✅ Automated |
| 08 | Verify All Products and product detail page | `ProductCatalogTests` | ✅ Automated |
| 09 | Search Product | `ProductCatalogTests` | ✅ Automated |
| 10 | Verify Subscription in home page | `SubscriptionTests` | ✅ Automated |
| 11 | Verify Subscription in Cart page | `SubscriptionTests` | ✅ Automated |
| 12 | Add Products in Cart | `CartAndQuantityTests` | ✅ Automated |
| 13 | Verify Product quantity in Cart | `CartAndQuantityTests` | ✅ Automated |
| 14 | Place Order: Register while Checkout | `OrderAndCheckoutTests` | ✅ Automated |
| 15 | Place Order: Register before Checkout | `OrderAndCheckoutTests` | ✅ Automated |
| 16 | Place Order: Login before Checkout | `OrderAndCheckoutTests` | ✅ Automated |
| 17 | Remove Products From Cart | `CartAndQuantityTests` | ✅ Automated |
| 18 | View Category Products | `ProductCatalogTests` | ✅ Automated |
| 19 | View & Cart Brand Products | `ProductCatalogTests` | ✅ Automated |
| 20 | Search Products and Verify Cart After Login | `CartAndQuantityTests` | ✅ Automated |
| 21 | Add review on product | `ProductCatalogTests` | ✅ Automated |
| 22 | Add to cart from Recommended items | `CartAndQuantityTests` | ✅ Automated |
| 23 | Verify address details in checkout page | `OrderAndCheckoutTests` | ✅ Automated |
| 24 | Download Invoice after purchase order | `OrderAndCheckoutTests` | ✅ Automated |
| 25 | Verify Scroll Up using 'Arrow' button and Scroll Down | `ScrollTests` | ✅ Automated |
| 26 | Verify Scroll Up without 'Arrow' button and Scroll Down | `ScrollTests` | ✅ Automated |
| + | Data-Driven Login via Jackson (`users.json`) | `AuthTests` | ✅ Automated |

---

## ⚡ Key Engineering Highlights

1. **Dismissing Google Ads / Overlays:**
   - Automation Exercise renders Google Vignette full-screen ads and iframe overlays between page transitions. `BasePage` encapsulates proactive ad-handling to dismiss modal overlays and bypass intercepted clicks without brittle sleep pauses.
2. **Zero `Thread.sleep` Policy:**
   - All synchronization is managed strictly using `WebDriverWait` with explicit conditions (`visibilityOfElementLocated`, `elementToBeClickable`, `urlContains`).
3. **ThreadLocal Multi-Browser Execution:**
   - `DriverFactory` uses `ThreadLocal<WebDriver>` to support concurrent, thread-isolated execution across **Chrome**, **Firefox**, and **Edge**.
4. **Data-Driven Testing with Jackson:**
   - Test data stored in `src/test/resources/testdata/users.json` is deserialized via Jackson `ObjectMapper` and fed directly into TestNG `@DataProvider`.
5. **Allure Failure Reporting:**
   - `AllureListener` hooks into TestNG's lifecycle. Upon any test failure, it captures a lossless PNG screenshot and attaches it alongside test logs to the Allure report.

---

## 🚀 Running the Tests

### Prerequisites
- Java 17+ (JDK)
- Apache Maven 3.8+
- Chrome / Firefox / Edge browsers installed

### Commands

**Run Default Test Suite:**
```bash
mvn clean test
```

**Run Smoke Suite:**
```bash
mvn clean test -DsuiteXmlFile=testng-smoke.xml
```

**Run Full 26 Test Cases Regression Suite:**
```bash
mvn clean test -DsuiteXmlFile=testng-regression.xml
```

**Run Parallel Cross-Browser Suite:**
```bash
mvn clean test -DsuiteXmlFile=testng-crossbrowser.xml
```

**Run in Headless Mode:**
```bash
mvn clean test -Dheadless=true
```

**Run on Specific Browser (e.g. Firefox or Edge):**
```bash
mvn clean test -Dbrowser=firefox
```

---

## 📊 Generating Allure Reports

After running the tests, generate and inspect the interactive Allure report:

```bash
# Generate report and automatically open in default browser
mvn allure:serve

# Or generate static HTML report inside target/site/allure-maven-plugin
mvn allure:report
```

---

## 👤 Author
- **Varalakshmy M**
- QA Automation Engineer
- [QA Automation Portfolio](https://github.com/your-username/qa-automation-portfolio)
