# QA Automation Portfolio

Welcome to my QA Automation Portfolio.

This repository contains my hands-on projects covering UI automation, API testing, database validation, and performance testing.

## Projects

| # | Project | Technology | Status |
|---|---|---|---|
| 01 | Selenium Java Automation Exercise | Java 17, Selenium 4, TestNG, Jackson, Allure | 🟢 Done |
| 02 | Cypress DemoBlaze | Cypress, JavaScript, Mochawesome | 🟢 Done |
| 03 | Playwright Toolshop | Playwright, TypeScript | 🟢 Done |
| 04 | SQL Pagila Validation | PostgreSQL 16, Docker, SQL, Node.js | 🟢 Done |
| 05 | JMeter Juice Shop Performance | Apache JMeter 5.6.3, Docker, Node.js, HTML Dashboard | 🟢 Done |

## Performance Testing Highlights (Project 05)

- **Target**: OWASP Juice Shop (`localhost:3000`)
- **Workload Model**: 60% Guest Browsers, 30% Registered Shoppers, 10% New Customers
- **Total Requests**: 5,812 samples across 4 profiles with **0.00% error rate**
- **Headline Benchmark Metrics**:
  - **Baseline (1 VU)**: 1.6 req/s | Avg: 47ms | p95: 106ms | Error: 0.00%
  - **Peak Load (20 VUs)**: 29.7 req/s | Avg: 34ms | p95: 47ms | Error: 0.00%
  - **Capacity Stress (50 VUs)**: 68.8 req/s | Avg: 32ms | p95: 44ms | Error: 0.00%
  - **Flash Surge Spike (70 VUs)**: 106.6 req/s | Avg: 31ms | p95: 43ms | Error: 0.00%

## Tools & Technologies

- Java
- Selenium
- TestNG
- Maven
- Cypress
- Playwright
- TypeScript
- SQL
- JMeter
- Git
- GitHub

## Repository Structure

```text
00-docs/
01-selenium-java-automationexercise/
02-cypress-demoblaze/
03-playwright-toolshop/
04-sql-pagila-validation/
05-jmeter-juiceshop-performance/
