import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4000',
    viewport: { width: 1400, height: 1800 },
    trace: 'off',
    video: 'off',
    screenshot: 'off',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4000',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
