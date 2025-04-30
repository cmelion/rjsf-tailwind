// tests/utils/table-testing/verifiers/verifyActionButtons.ts
import { TableTester } from '../types';

/**
 * Verifies each data row has action buttons
 * @param tester - Table testing utility
 * @param table - Table element to verify
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