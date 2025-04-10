// tests/step-definitions/tailwind-table.steps.js
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

// Helper functions without type annotations
const navigateToStory = async ({ page }, storyId = 'default') => {
  const storyPath = `/iframe.html?args=&id=components-tailwindtable--${storyId.toLowerCase()}&viewMode=story`;
  await page.goto(storyPath);
  // Use a more specific selector that targets only the data table
  await page.waitForSelector('table.w-full.divide-y', { state: 'visible' });
};

// Background steps
Given('I have a table with schema defining several properties', async () => {
  // This is set up in the Storybook stories already
});

Given('I have some initial data records', async () => {
  // This is set up in the Storybook stories already
});

// Viewing table data
When('I view the table', async ({ page }) => {
  await navigateToStory({ page });
});

Then('I should see column headers based on the schema properties', async ({ page }) => {
  const headers = await page.$$('thead th');
  expect(headers.length).toBeGreaterThan(0);
});

Then('I should see rows displaying my data', async ({ page }) => {
  const rows = await page.$$('tbody tr');
  expect(rows.length).toBeGreaterThan(0);
});

Then('each row should have action buttons', async ({ page }) => {
  const firstRow = await page.$('tbody tr:first-child');
  if (!firstRow) {
    throw new Error('No table rows found');
  }
  const actionButtons = await firstRow.$$('button');
  expect(actionButtons.length).toBeGreaterThan(0);
});
