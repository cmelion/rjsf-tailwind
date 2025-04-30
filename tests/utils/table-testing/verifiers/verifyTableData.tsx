// tests/utils/table-testing/verifiers/verifyTableData.ts
import { TableTester, Schema } from '../types';

/**
 * Verifies table rows match the expected data
 * @param tester - Table testing utility
 * @param schema - JSON schema defining table structure
 * @param data - Expected data to verify against
 * @param table - Table element to verify
 */
export async function verifyTableData(
  tester: TableTester,
  schema: Schema,
  data: any[],
  table: any
) {
  // Validate inputs
  if (!Array.isArray(data)) {
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
    await verifyRowData({
      tester,
      schema,
      rowData: data[rowIndex],
      row: dataRows[rowIndex],
      columnMap,
      rowIndex
    });
  }
}

/**
 * Helper function to verify a single row's data
 */
async function verifyRowData({
                               tester,
                               schema,
                               rowData,
                               row,
                               columnMap,
                               rowIndex
                             }: {
  tester: TableTester;
  schema: Schema;
  rowData: any;
  row: any;
  columnMap: Map<string, number>;
  rowIndex: number;
}) {
  const cells = await tester.getCellsInRow(row);

  // For each property in the expected data
  for (const [key, value] of Object.entries(rowData)) {
    // Skip complex objects for now
    if (typeof value === 'object' && value !== null) continue;

    // Get property type and title from schema
    const propSchema = schema.properties?.[key];
    const isBoolean = propSchema?.type === 'boolean';
    const columnTitle = propSchema?.title || key;

    // Find column index
    const columnIndex = columnMap.get(columnTitle);

    if (columnIndex !== undefined && columnIndex < cells.length) {
      const cell = cells[columnIndex];

      if (isBoolean) {
        await verifyBooleanCell(tester, cell, !!value, rowIndex, columnTitle);
      } else {
        // Non-boolean values - check text content
        await verifyTextCell(tester, cell, value, rowIndex, columnTitle);
      }
    }
  }
}

/**
 * Helper function to verify boolean cells (true = checkmark, false = x-mark)
 */
async function verifyBooleanCell(
  tester: TableTester,
  cell: any,
  expected: boolean,
  rowIndex: number,
  columnTitle: string
) {
  const cellText = await tester.getCellContent(cell);

  if (expected) {
    // Check for checkmark
    const hasCheckmark =
      await tester.hasElement(cell, 'svg.check-icon, svg[data-testid="check-icon"]') ||
      cellText.includes('✓');

    if (!hasCheckmark) {
      throw new Error(`Expected checkmark in row ${rowIndex}, column ${columnTitle}`);
    }
  } else {
    // Check for X mark
    const hasXmark =
      await tester.hasElement(cell, 'svg.x-icon, svg[data-testid="x-icon"]') ||
      cellText.includes('✗') ||
      cellText.includes('X');

    if (!hasXmark) {
      throw new Error(`Expected x-mark in row ${rowIndex}, column ${columnTitle}`);
    }
  }
}

/**
 * Helper function to verify text cells
 */
async function verifyTextCell(
  tester: TableTester,
  cell: any,
  value: any,
  rowIndex: number,
  columnTitle: string
) {
  const valueStr = String(value);
  const cellText = await tester.getCellContent(cell);

  if (!cellText.includes(valueStr)) {
    throw new Error(
      `Cell text "${cellText}" does not contain expected value "${valueStr}" in row ${rowIndex}, column ${columnTitle}`
    );
  }
}