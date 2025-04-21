// tests/utils/table-testing/verifiers.ts
import { TableTester, Schema } from './types';

/**
 * Verifies column headers match the schema properties
 */
export async function verifyColumnHeaders(
  tester: TableTester,
  schema: Schema,
  table: any
) {
  if (!schema || !schema.properties) {
    throw new Error('Schema not found in the test context');
  }

  const expectedProperties = Object.keys(schema.properties);
  const headers = await tester.getAllColumnHeaders(table);

  // Get all header text contents
  const headerTexts = [];
  for (const header of headers) {
    const text = await tester.getCellContent(header);
    headerTexts.push(text.trim());
  }

  // Verify each schema property has a corresponding header
  for (const propName of expectedProperties) {
    const title = schema.properties[propName].title || propName;
    const hasHeader = headerTexts.some(text =>
      text.includes(title) || text.includes(propName)
    );

    if (!hasHeader) {
      throw new Error(`Header for property "${propName}" not found`);
    }
  }
}

/**
 * Verifies table rows match the data
 */
export async function verifyTableData(
  tester: TableTester,
  schema: Schema,
  data: any[],
  table: any
) {
  if (!data || !Array.isArray(data)) {
    throw new Error('Data not found or not an array');
  }

  const rows = await tester.getAllRows(table);

  if (rows.length <= 1) { // Need at least header + one data row
    throw new Error('Not enough rows in table');
  }

  // Get header cells to map column indexes to property names
  const headerCells = await tester.getAllColumnHeaders(table);
  const columnMap = await tester.getColumnMap(headerCells);

  // Skip header row
  const dataRows = rows.slice(1);

  // Verify number of data rows
  if (dataRows.length !== data.length) {
    throw new Error(`Expected ${data.length} rows, found ${dataRows.length}`);
  }

  // Check each data row
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const rowData = data[rowIndex];
    const row = dataRows[rowIndex];

    const cells = await tester.getCellsInRow(row);

    // For each property in the expected data
    for (const [key, value] of Object.entries(rowData)) {
      // Skip complex objects
      if (typeof value === 'object' && value !== null) continue;

      // Get property type and title from schema
      const propSchema = schema.properties?.[key];
      const isBoolean = propSchema?.type === 'boolean';
      const columnTitle = propSchema?.title || key;

      // Find column index
      const columnIndex = columnMap.get(columnTitle);

      if (columnIndex !== undefined && columnIndex < cells.length) {
        const cell = cells[columnIndex];

        // Handle boolean values
        if (isBoolean) {
          if (value === true) {
            // Check for checkmark
            const cellText = await tester.getCellContent(cell);
            const hasCheckmark = await tester.hasElement(cell, 'svg.check-icon, svg[data-testid="check-icon"]') ||
              cellText.includes('✓');

            if (!hasCheckmark) {
              throw new Error(`Expected checkmark in row ${rowIndex}, column ${columnTitle}`);
            }
          } else {
            // Check for X mark
            const cellText = await tester.getCellContent(cell);
            const hasXmark = await tester.hasElement(cell, 'svg.x-icon, svg[data-testid="x-icon"]') ||
              cellText.includes('✗') ||
              cellText.includes('X');

            if (!hasXmark) {
              throw new Error(`Expected x-mark in row ${rowIndex}, column ${columnTitle}`);
            }
          }
          continue;
        }

        // Non-boolean values - check text content
        const valueStr = String(value);
        const cellText = await tester.getCellContent(cell);

        if (!cellText.includes(valueStr)) {
          throw new Error(`Cell text "${cellText}" does not contain expected value "${valueStr}" in row ${rowIndex}, column ${columnTitle}`);
        }
      }
    }
  }
}

/**
 * Verifies each data row has action buttons
 */
export async function verifyActionButtons(
  tester: TableTester,
  table: any
) {
  const rows = await tester.getAllRows(table);

  if (rows.length <= 1) { // Need at least header + one data row
    return; // No data rows to check
  }

  // Skip header row
  const dataRows = rows.slice(1);

  // Check for buttons in each row
  for (const row of dataRows) {
    const cells = await tester.getCellsInRow(row);

    if (cells.length === 0) continue;

    // Check last cell (usually contains action buttons)
    const lastCell = cells[cells.length - 1];
    const hasButton = await tester.hasElement(lastCell, 'button');

    if (!hasButton) {
      throw new Error('No action buttons found in row');
    }
  }
}