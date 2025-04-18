// src/components/tests/component.steps.ts
import { Given, When, Then } from 'quickpickle';
import { render, screen, within } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { expect } from 'vitest';
import * as TailwindTableStories from '../tailwind-table/TailwindTable.stories';
import { AriaRole } from '@tests/utils/types';


// Create type for world object
type TestWorld = {
  storyName: string;
  component: any;
  schema?: any;
  formData?: any;
  tableName?: string;
  tableRole?: AriaRole;
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
When('I view the {string} {string}', async (world: TestWorld, tableName: string, tableRole: AriaRole) => {
  // Get the appropriate story component based on the storyName
  const Story = stories[world.storyName as keyof typeof stories];

  if (!Story) {
    throw new Error(`Story "${world.storyName}" not found in TailwindTable stories`);
  }

  // Store both schema and formData from the story in the world object
  world.schema = Story.args.schema;
  world.formData = Story.args.formData;

  // Render the component inside a test-friendly environment
  const { container } = render(<Story />);
  world.component = { container };

  // Store the table name and role for later steps
  world.tableName = tableName;
  world.tableRole = tableRole;
});


// Assertion steps
Then('I should see column headers based on the schema properties', async (world: TestWorld) => {
  const schema = world.schema;

  if (!schema || !schema.properties) {
    throw new Error('Schema not found in the test context. Make sure it was set in a previous step.');
  }

  const expectedProperties = Object.keys(schema.properties);
  const headers = screen.getAllByRole('columnheader', {});

  expect(headers.length).toBeGreaterThan(0);

  // Get the header text content
  const headerTexts = headers.map(h => h.textContent?.trim());

  // Verify each schema property has a corresponding header
  expectedProperties.forEach(propName => {
    const title = schema.properties[propName].title || propName;
    const hasHeader = headerTexts.some(text =>
      text?.includes(title) || text?.includes(propName)
    );
    expect(hasHeader).toBeTruthy();
  });
});

Then('I should see rows displaying my data', async (world: TestWorld) => {
  // Get the expected data from the world object
  const expectedData = world.formData;
  // Get the schema which contains type information
  const schema = world.schema || {};

  if (!expectedData || !Array.isArray(expectedData)) {
    throw new Error('No form data available in the world object or data is not an array');
  }

  // Find the table by its specific role and name that were stored in the previous step
  const table = screen.getByRole(world.tableRole || 'grid', { name: world.tableName });

  // Get all rows
  const rows = within(table).getAllByRole('row', {});

  // Skip the header row
  const dataRows = rows.slice(1);

  // Get header cells to map column indexes to property names
  const headerRow = rows[0];
  const headerCells = within(headerRow).getAllByRole('columnheader', {});
  const columnMap = new Map();

  // Build mapping between column titles and indexes
  headerCells.forEach((cell, index) => {
    columnMap.set(cell.textContent?.trim(), index);
  });

  // Verify we have the right number of data rows
  expect(dataRows.length).toEqual(expectedData.length);

  // For each row of expected data, verify the content
  expectedData.forEach((expectedRowData, rowIndex) => {
    const row = dataRows[rowIndex];
    const cells = within(row).getAllByRole('cell', {});

    // For each property in the expected data
    Object.entries(expectedRowData).forEach(([key, value]) => {
      // Skip complex objects
      if (typeof value === 'object' && value !== null) return;

      // Get property type from schema
      const propSchema = schema.properties?.[key];
      const isBoolean = propSchema?.type === 'boolean';
      const columnTitle = propSchema?.title || key;

      // Find the column index for this property
      const columnIndex = columnMap.get(columnTitle);

      if (columnIndex !== undefined && columnIndex < cells.length) {
        const cell = cells[columnIndex];

        // Handle boolean values differently
        if (isBoolean) {
          if (value === true) {
            // Check for checkmark (either as an SVG icon or Unicode character)
            const hasCheckmark = !!cell.querySelector('svg.check-icon, svg[data-testid="check-icon"]') ||
              cell.textContent?.includes('✓');
            expect(hasCheckmark).toBeTruthy();
          } else {
            // Check for X mark (either as an SVG icon or Unicode character)
            const hasXmark = !!cell.querySelector('svg.x-icon, svg[data-testid="x-icon"]') ||
              cell.textContent?.includes('✗') ||
              cell.textContent?.includes('X');
            expect(hasXmark).toBeTruthy();
          }
          return;
        }

        // For non-boolean values, check the text content
        const valueStr = String(value);
        const cellText = cell.textContent || '';
        expect(cellText).toContain(valueStr);
      }
    });
  });
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