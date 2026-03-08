import { defineConfig } from '@playwright/test';

const CI = !!process.env.CI;

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  retries: CI ? 2 : 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  webServer: [
    {
      command: 'npm run dev:test --workspace @blog/api',
      url: 'http://127.0.0.1:4000/health',
      timeout: 120_000,
      reuseExistingServer: !CI
    },
    {
      command: 'npm run dev:test --workspace @blog/blog-client',
      url: 'http://127.0.0.1:4173',
      timeout: 120_000,
      reuseExistingServer: !CI
    },
    {
      command: 'npm run dev:test --workspace @blog/admin-client',
      url: 'http://127.0.0.1:4174',
      timeout: 120_000,
      reuseExistingServer: !CI
    }
  ]
});
