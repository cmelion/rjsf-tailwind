// tests/utils/table-testing/verifiers/verifyRowIsRemoved.ts
import { TableTester, TableElement } from "../types";

export async function verifyNewRowAdded({
                                           tableTester,
                                           table,
                                           rowData,
                                         }: {
  tableTester: TableTester;
  table: any;
  rowData: Record<string, string | number>;
}): Promise<boolean> {
  // Get all rows in the table
  const rows = await tableTester.getAllRows(table);

  // Skip header row
  const dataRows = rows.slice(1);

  // Look for our newly added row
  for (const row of dataRows) {
    const cells = await tableTester.getCellsInRow(row);
    const cellContents = await Promise.all(
      cells.map(cell => tableTester.getCellContent(cell))
    );

    const rowText = cellContents.join(' ');

    // Check if all expected values are in the row text
    const containsAllValues = Object.values(rowData).every(value =>
      rowText.includes(String(value))
    );

    if (containsAllValues) {
      return true;
    }
  }

  return false;
}