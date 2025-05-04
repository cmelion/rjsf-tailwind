// tests/utils/table-testing/verifiers/verifyRowIsRemoved.ts
import { TableTester, TableElement } from "../types";

/**
 * Verifies that a row identified by its original index is no longer present in the table.
 * Assumes rows have a 'data-row-index' attribute storing their original index before deletion.
 *
 * @param tableTester - The table testing utility instance.
 * @param table - The table element to check.
 * @param rowIndexToRemove - The original index of the row that should have been removed.
 */
export async function verifyRowIsRemoved({
  tableTester,
  table,
  rowIndexToRemove,
}: {
  tableTester: TableTester;
  table: TableElement;
  rowIndexToRemove: number; // Use the original index before deletion
}): Promise<void> {
  const rows = await tableTester.getAllRows(table);
  const dataRows = rows.slice(1); // Skip header row

  for (const row of dataRows) {
    // Assuming rows have a 'data-row-index' attribute storing their original index
    const originalIndexAttr = await tableTester.getAttribute(row, 'data-row-index');
    if (originalIndexAttr === String(rowIndexToRemove)) {
      // If we find the row, it means it wasn't removed, so throw an error.
      throw new Error(`Row with original index ${rowIndexToRemove} was still found in the table.`);
    }
  }

  // If the loop completes without finding the row, the verification passes.
}