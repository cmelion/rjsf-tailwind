// playwright.coverage.ts
import { test as base } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export const test = base.extend({
  context: async ({ context }, use) => {
    // Start JS coverage collection
    await context.addInitScript(() => {
      window.addEventListener('beforeunload', () => {
        // This helps ensure coverage is collected before page navigations
        console.log('Coverage: beforeunload event fired');
      });
    });

    // Explicitly cast to access the internal coverage API
    const contextWithCoverage = context as any;
    await contextWithCoverage.coverage?.startJSCoverage();

    await use(context);

    // Collect coverage data
    const coverage = await contextWithCoverage.coverage?.stopJSCoverage() || [];

    // Write coverage to a file that can be processed by nyc
    const coverageDir = path.join(process.cwd(), 'coverage', 'tmp');

    // Ensure directory exists
    if (!fs.existsSync(coverageDir)) {
      fs.mkdirSync(coverageDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(coverageDir, 'playwright-coverage.json'),
      JSON.stringify(coverage)
    );
  },
});