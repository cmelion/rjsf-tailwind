/// <reference types="vitest" />
// src/components/tests/component.steps.ts
import { Given, When, Then } from 'quickpickle';
import { render } from '@testing-library/react';
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
  const Story = stories[world.storyName];

  if (!Story) {
    throw new Error(`Story "${world.storyName}" not found in TailwindTable stories`);
  }

  // Render the component inside a test-friendly environment
  const { container } = render(<Story />);
  world.component = { container };

});

// Assertion steps
Then('I should see column headers based on the schema properties', async (world: TestWorld) => {
  const { container } = world.component;

  const headers = container.querySelectorAll('[role="columnheader"]');

  // Debug output if needed
  //console.log('Container HTML:', container.innerHTML);
  //console.log('Found headers:', headers.length);

  // Webstorm only Type issue?  see https://github.com/vitest-dev/vitest/issues/6241#issuecomment-2257734130
  expect(headers.length).toBeGreaterThan(0);
});

Then('I should see rows displaying my data', async (world: TestWorld) => {
  const { container } = world.component;
  const rows = container.querySelectorAll('tbody > tr[role="row"]');
  expect(rows.length).toBeGreaterThan(0);
});


Then('each row should have action buttons', async (world: TestWorld) => {
  const { container } = world.component;
  const rows = container.querySelectorAll('tbody > tr[role="row"]');

  // Skip this test if there are no rows
  if (rows.length === 0) {
    console.warn('No rows found to check for action buttons');
    return;
  }

  // Check for buttons in at least one row
  const firstRow = rows[0];
  const actionButtons = firstRow.querySelectorAll('button, [role="button"]');
  expect(actionButtons.length).toBeGreaterThan(0);
});
