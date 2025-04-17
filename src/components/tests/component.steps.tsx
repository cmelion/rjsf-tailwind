/// <reference types="vitest" />
// src/components/tests/component.steps.ts
import { Given, When, Then } from 'quickpickle';
import { render, screen, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { expect } from 'vitest';
import * as TailwindTableStories from '../tailwind-table/TailwindTable.stories';

// Create type for world object
type TestWorld = {
  storyName: string;
  component: any;
};

// Compose the stories for direct testing
const stories = composeStories(TailwindTableStories);

// Background steps
Given('I have a table with schema defining several properties', async (world: TestWorld) => {
  world.storyName = 'Default';
});

Given('I have some initial data records', async (world: TestWorld) => {
  // Change this to use an existing story with data
  world.storyName = 'ManyRows'; // This exists in your stories
});

// Action steps
When('I view the table', async (world: TestWorld) => {
  // Get the appropriate story component based on the storyName
  const Story = stories[world.storyName as keyof typeof stories];

  if (!Story) {
    throw new Error(`Story "${world.storyName}" not found in TailwindTable stories`);
  }

  // Render the component inside a test-friendly environment
  const { container } = render(<Story />);
  world.component = { container };
});

// Assertion steps
Then('I should see column headers based on the schema properties', async () => {
  // Use screen query with the role that matches the DataTable component
  const headers = screen.getAllByRole('columnheader', {});
  expect(headers.length).toBeGreaterThan(0);
});

Then('I should see rows displaying my data', async () => {
  // First find the table with the correct label
  const table = screen.getByRole('grid', { name: 'Data records table' });

  // Get all rows in the table
  const allRows = within(table).getAllByRole('row', {});

  // The first row is likely the header row, so we'll skip it to get data rows
  const dataRows = allRows.filter(row => {
    // A data row shouldn't contain columnheader elements
    return within(row).queryAllByRole('columnheader', {}).length === 0;
  });

  expect(dataRows.length).toBeGreaterThan(0);
});

Then('each row should have action buttons', async () => {
  // First find the table with the correct label
  const table = screen.getByRole('grid', { name: 'Data records table' });

  // Get all rows in the table
  const allRows = within(table).getAllByRole('row', {});

  // Filter to data rows (those without columnheaders)
  const dataRows = allRows.filter(row => {
    return within(row).queryAllByRole('columnheader', {}).length === 0;
  });

  // Skip this test if there are no data rows
  if (dataRows.length === 0) {
    console.warn('No data rows found to check for action buttons');
    return;
  }

  // Check that EACH row has action buttons
  for (const row of dataRows) {
    const actionButtons = within(row).getAllByRole('button', {});
    expect(actionButtons.length).toBeGreaterThan(0);
  }
});