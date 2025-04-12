// tests/step-definitions/tailwind-table.steps.js
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, When, Then } = createBdd();

// Helper functions without type annotations
const navigateToStory = async ({ page }, storyId = 'default') => {
  const storyPath = `/iframe.html?args=&id=components-tailwindtable--${storyId.toLowerCase()}&viewMode=story`;
  await page.goto(storyPath);
  // Use getByRole instead of CSS selector
  await page.getByRole('table', { name: 'Data records table' }).waitFor({ state: 'visible' });
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
  // Use getByRole to find column headers
  const headers = await page.getByRole('columnheader').all();
  expect(headers.length).toBeGreaterThan(0);
});

Then('I should see rows displaying my data', async ({ page }) => {
  // Use getByRole to find rows
  const rows = await page.getByRole('row').all();
  // Subtract header row
  expect(rows.length - 1).toBeGreaterThan(0);
});

Then('each row should have action buttons', async ({ page }) => {
  // Get the first data row (skip header row)
  const dataRows = await page.getByRole('row').all();
  const firstDataRow = dataRows[1]; // Skip header row

  // Find buttons by their accessible attributes
  const expandButton = await firstDataRow.getByRole('button', {
    name: /collapse row|expand row/i
  });

  const deleteButton = await firstDataRow.getByRole('button', {
    name: 'Delete row'
  });

  expect(expandButton).toBeTruthy();
  expect(deleteButton).toBeTruthy();
});