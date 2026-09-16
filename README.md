# Automation Exercise — Playwright TypeScript POC

 automation framework demonstrating UI, REST API, and hybrid UI+API testing against [Automation Exercise](https://automationexercise.com/).

## Tech stack

- Playwright Test with TypeScript
- Page Object Model
- Reusable API client classes using `APIRequestContext`
- Custom fixtures with dependency injection
- JSON test data and runtime-generated users
- Playwright HTML + Allure reports
- GitHub Actions CI

## Project structure

```text
api/                 Reusable REST clients and response parser
fixtures/            Framework fixtures
pages/               Page Object Model classes
test-data/           Static test data
tests/api/           API-only tests
tests/hybrid/        Combined API and UI tests
tests/ui/            Browser-only tests
utils/               Dynamic data builders
```

## Setup

Requires Node.js 20 or 22.

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

## Run tests

```bash
npm test             # all projects
npm run test:ui      # UI suite
npm run test:api     # API suite
npm run test:hybrid  # hybrid suite
npm run test:headed  # UI in headed Chromium
npm run typecheck    # TypeScript validation
```

## Reports

Playwright HTML report:

```bash
npm run report
```

Allure report:

```bash
npm run allure:generate
npm run allure:open
```

## Covered scenarios

| Layer | Scenario |
| --- | --- |
| UI | Invalid login validation |
| UI | Search product catalog |
| UI | Add a product to cart |
| API | Get all products |
| API | Search products |
| API | Validate unsupported method |
| API | Account create/read/update/delete lifecycle |
| Hybrid | API create user → UI login → API cleanup |
| Hybrid | UI create user → API verify → API cleanup |

## Framework design notes

- Automation Exercise APIs often return HTTP 200 while putting the meaningful status in the JSON `responseCode`; assertions intentionally validate that field.
- Account tests create unique email addresses and clean up in `finally`, reducing test-data collisions and orphaned accounts.
- API payloads use form encoding because that is what the public API expects.
- UI, API, and hybrid suites are separate Playwright projects and can run independently.

## Important public-site note

This is a shared public practice environment. Occasional rate limiting, consent prompts, ads, or anti-bot checks can affect UI execution. The framework blocks common ad requests and keeps retries enabled in CI, but it does not attempt to bypass access controls.
