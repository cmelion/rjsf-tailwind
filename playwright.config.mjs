// playwright.config.mjs
import { defineConfig } from '@playwright/test';
import { defineBddConfig /*, cucumberReporter */} from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'src/**/*.feature',
  steps: 'tests/step-definitions/**/*.steps.js', // Change to .js
  outputDir: 'tests/bdd-generated',
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
    // cucumberReporter('html', { outputFile: 'cucumber-report/report.html' })
  ],
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    }
  ],
});
