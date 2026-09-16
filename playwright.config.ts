import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const baseURL = process.env.BASE_URL ?? 'https://automationexercise.com';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],
  use: {
    baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 40_000,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'ui-chromium',
      testMatch: /ui\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/
    },
    {
      name: 'hybrid-chromium',
      testMatch: /hybrid\/.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
