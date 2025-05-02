;
// tests/utils/table-testing/table-operations.ts
import { TableTester } from "./types";


/**
 * Execute a click operation on a table element based on provided parameters
 */
export async function executeTableClick({
  tableTester,
  table,
  rowButtonName,
  rowIndex,
  buttonName,
  sortableFlag,
  columnName,
}: {
  tableTester: TableTester
  table: any
  rowButtonName?: string
  rowIndex?: string
  buttonName?: string
  sortableFlag?: string
  columnName?: string
}): Promise<void> {
  if (rowButtonName && rowIndex) {
    // Row-specific action button
    const row = await tableTester.getRowByIndex(table, parseInt(rowIndex))
    const actionButton = await tableTester.findActionButtonInRow(
      row,
      rowButtonName,
    )
    await tableTester.click(actionButton)
  } else if (buttonName) {
    // Global button like "Add New"
    const button = await tableTester.findElementByRole("button", {
      name: buttonName,
    })
    await tableTester.click(button)
  } else {
    // Column header
    let header

    if (columnName) {
      // Find by specific column by aria-label
      header = await tableTester.findColumnHeaderByAriaLabel(table, columnName)
    } else if (sortableFlag) {
      // Find first sortable header
      header = await tableTester.findElementByAttribute(
        "columnheader",
        "aria-sort",
        /.*/,
      )
    } else {
      // Any column header
      header = await tableTester.findElementByRole("columnheader", {})
    }

    await tableTester.click(header)
  }
}

export interface DataTableRow {
  ID?: string
  Placeholder?: string
  Value: string
  [key: string]: any // Allow for additional properties
}

/**
 * Process a data table and enter values into matching input fields
 * this could easily be extended to support other types of inputs and components
 */
export async function executeDataTableInput({
  tableTester,
  dataTable,
}: {
  tableTester: TableTester
  dataTable: { hashes: () => DataTableRow[] }
}): Promise<Array<{ placeholder?: string; value: string }>> {
  // Create filter criteria for later verification
  const filterCriteria = dataTable.hashes().map((row) => ({
    placeholder: row.Placeholder,
    value: row.Value,
  }))

  // Process each row in the data table
  for (const row of dataTable.hashes()) {
    let input

    // Find the input element
    if (row.ID) {
      input = await tableTester.findElementByAttribute("textbox", "id", row.ID)
    } else if (row.Placeholder) {
      input = await tableTester.findElementByAttribute(
        "textbox",
        "placeholder",
        row.Placeholder,
      )
    } else {
      throw new Error("Each row must specify either ID or Placeholder")
    }

    // Enter the value
    await enterValueInInput({ tableTester, input, value: row.Value });
  }

  return filterCriteria
}

/**
 * Enter a value into an input field with proper clearing
 */
export async function enterValueInInput({
                                          tableTester,
                                          input,
                                          value,
                                        }: {
  tableTester: TableTester;
  input: any;
  value: string;
}): Promise<void> {
  await tableTester.click(input);
  await tableTester.clear(input);
  await tableTester.type(input, value);
}


// Column Selector Functions

/**
 * Opens the column selector menu in the table
 */
export async function openColumnSelectorMenu({
                                               tableTester,
                                             }: {
  tableTester: TableTester
}): Promise<void> {
  // Find the column selector button using aria attributes
  // This matches both states: "Show column selector" or "Hide column selector"
  const columnsButton = await tableTester.findElementByRole("button", {
    name: /(?:Show|Hide) column selector/i,
  });

  // Only click to open if it's currently closed
  const expanded = await tableTester.getAttribute(columnsButton, 'aria-expanded');
  if (expanded !== 'true') {
    await tableTester.click(columnsButton);
  }
}
/**
 * Toggles visibility for a specific column by name
 */
export async function toggleColumnVisibility({
                                               tableTester,
                                               columnName = "Name", // Default to "Name" column if not specified
                                             }: {
  tableTester: TableTester
  columnName?: string
}): Promise<void> {
  // Find the checkbox for the specified column
  const columnCheckbox = await tableTester.findElementByRole("checkbox", {
    name: new RegExp(`Show ${columnName} column`, 'i')
  });
  await tableTester.click(columnCheckbox);
}

/**
 * Verifies if a column is hidden in the table
 */
export async function confirmColumnIsHidden({
                                             tableTester,
                                             table,
                                             columnName = "Name",
                                           }: {
  tableTester: TableTester
  table: any
  columnName?: string
}): Promise<boolean> {
  // Get all column headers
  const headerCells = await tableTester.getAllColumnHeaders(table);

  // Check if column is present
  for (const header of headerCells) {
    const content = await tableTester.getCellContent(header);
    if (content.trim() === columnName || content.includes(columnName)) {
      // Column is still visible
      return false;
    }
  }

  // Column is not found, so it's hidden
  return true;
}

// tests/utils/table-testing/table-operations.ts
// Add this new function export

/**
 * Verifies that a new row with the specified data exists in the table
 */
export async function confirmNewRowAdded({
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
