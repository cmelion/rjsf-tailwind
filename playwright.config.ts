// playwright.config.ts
import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'src/**/*.feature',
  steps: [
    'tests/step-definitions/**/*.ts',
    'tests/step-definitions/**/*.tsx'
  ],
  outputDir: 'tests/bdd-generated',
  tags: '@storybook-running',
});

export default defineConfig({
  testDir,
  outputDir: 'test-results',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:6006',
    screenshot: 'only-on-failure',
  },
  reporter: [
    ['list', { printSteps: true }],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/test-results.json' }]
  ],
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        // Enable JS coverage collection
        contextOptions: {
          viewport: { width: 1280, height: 720 }
        }
      },
    }
  ],
  webServer: {
    command: 'yarn storybook:cov',
    url: 'http://localhost:6006/iframe.html?id=components-tailwindtable--default',
    reuseExistingServer: true,
    timeout: 60000
  }
});