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
    ['html', {outputFile: 'playwright-report/report.html'}]
  ],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ],
});