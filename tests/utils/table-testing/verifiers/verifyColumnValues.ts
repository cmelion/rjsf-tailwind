// tests/utils/table-testing/verifiers/verifyColumnValues.ts
import { TableTester } from "../types";

/**
 * Verify that a table column contains specific values in the specified order
 */
export async function verifyColumnValues({
                                           tableTester,
                                           table,
                                           dataTable,
                                         }: {
  tableTester: TableTester;
  table: any;
  dataTable: any;
}): Promise<void> {
  // Parse the data table - first row contains column header (column name)
  const rows = dataTable.raw();
  const columnName = rows[0][0].trim();
  const expectedValues = rows.slice(1).map((row: string[]) => row[0].trim());

  // Find all column headers
  const headerCells = await tableTester.getAllColumnHeaders(table);

  // Look for matching column header - using more robust header matching
  let columnIndex: number | undefined;
  let headerCell: any;

  // Try to find column by exact name match first
  for (let i = 0; i < headerCells.length; i++) {
    const content = await tableTester.getCellContent(headerCells[i]);
    if (content.trim() === columnName) {
      columnIndex = i;
      headerCell = headerCells[i];
      break;
    }
  }

  // If not found by exact match, try finding by partial match or aria-label
  if (columnIndex === undefined) {
    for (let i = 0; i < headerCells.length; i++) {
      const content = await tableTester.getCellContent(headerCells[i]);
      const ariaLabel = await tableTester.getAttribute(headerCells[i], 'aria-label') || '';

      if (content.includes(columnName) || ariaLabel.includes(columnName)) {
        columnIndex = i;
        headerCell = headerCells[i];
        break;
      }
    }
  }

  // Last resort: look for any column with aria-sort attribute (currently sorted column)
  if (columnIndex === undefined) {
    for (let i = 0; i < headerCells.length; i++) {
      const ariaSort = await tableTester.getAttribute(headerCells[i], 'aria-sort');
      if (ariaSort) {
        columnIndex = i;
        headerCell = headerCells[i];
        break;
      }
    }
  }

  if (columnIndex === undefined) {
    throw new Error(`Column "${columnName}" not found in table headers`);
  }

  // Get all rows (excluding header)
  const allRows = await tableTester.getAllRows(table);
  const dataRows = allRows.slice(1); // Skip the header row

  // Extract actual values from the specified column
  const actualValues = [];
  for (const row of dataRows) {
    const cells = await tableTester.getCellsInRow(row);
    if (columnIndex < cells.length) {
      const cellContent = await tableTester.getCellContent(cells[columnIndex]);
      actualValues.push(cellContent.trim());
    }
  }

  // Check if values match exactly in the specified order
  for (let i = 0; i < Math.min(expectedValues.length, actualValues.length); i++) {
    if (expectedValues[i] !== actualValues[i]) {
      throw new Error(
        `Column "${columnName}" value at position ${i+1} is "${actualValues[i]}" but expected "${expectedValues[i]}"`
      );
    }
  }

  // Check if number of values matches
  if (actualValues.length !== expectedValues.length) {
    throw new Error(
      `Column "${columnName}" has ${actualValues.length} values but expected ${expectedValues.length} values`
    );
  }
}