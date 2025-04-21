// src/components/tests/component.steps.tsx
import { Given, When, Then } from 'quickpickle';
import { render } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as TailwindTableStories from '../tailwind-table/TailwindTable.stories';
import { AriaRole } from '@tests/utils/types';
import { RTLTableTester } from '@tests/utils/table-testing/rtl-adapter';
import { verifyColumnHeaders, verifyTableData, verifyActionButtons } from '@tests/utils/table-testing/verifiers';
import { expect } from 'vitest';

// Create type for world object
type TestWorld = {
  storyName: string;
  component: any;
  schema?: any;
  formData?: any;
  tableName?: string;
  tableRole?: AriaRole;
  tableTester?: RTLTableTester;
};

// Compose the stories for direct testing
const stories = composeStories(TailwindTableStories);

// Background steps
Given('I have a table with schema defining several properties', async (world: TestWorld) => {
  world.storyName = 'Default';
});

Given('I have some initial data records', async (world: TestWorld) => {
  world.storyName = 'ManyRows';
});

// Action steps
When('I view the {string} {string}', async (world: TestWorld, tableName: string, tableRole: AriaRole) => {
  const Story = stories[world.storyName as keyof typeof stories];

  if (!Story) {
    throw new Error(`Story "${world.storyName}" not found in TailwindTable stories`);
  }

  // Store both schema and formData from the story in the world object
  world.schema = Story.args.schema;
  world.formData = Story.args.formData;

  // Render the component inside a test-friendly environment
  render(<Story />);

  // Store the table name and role for later steps
  world.tableName = tableName;
  world.tableRole = tableRole;
  world.tableTester = new RTLTableTester();
});

// Assertion steps
Then('I should see column headers based on the schema properties', async (world: TestWorld) => {
  const { schema, tableName, tableRole, tableTester } = world;

  if (!tableTester || !tableName || !tableRole || !schema) {
    throw new Error('Required test context not initialized');
  }

  const table = await tableTester.getTableByRole(tableRole, tableName);

  try {
    await verifyColumnHeaders(tableTester, schema, table);
  } catch (error: any) {
    expect.fail(error.message);
  }
});

Then('I should see rows displaying my data', async (world: TestWorld) => {
  const { schema, formData, tableName, tableRole, tableTester } = world;

  if (!tableTester || !tableName || !tableRole || !schema || !formData) {
    throw new Error('Required test context not initialized');
  }

  const table = await tableTester.getTableByRole(tableRole, tableName);

  try {
    await verifyTableData(tableTester, schema, formData, table);
  } catch (error: any) {
    expect.fail(error.message);
  }
});

Then('each row should have action buttons', async (world: TestWorld) => {
  const { tableName, tableRole, tableTester } = world;

  if (!tableTester || !tableName || !tableRole) {
    throw new Error('Required test context not initialized');
  }

  const table = await tableTester.getTableByRole(tableRole, tableName);

  try {
    await verifyActionButtons(tableTester, table);
  } catch (error: any) {
    expect.fail(error.message);
  }
});