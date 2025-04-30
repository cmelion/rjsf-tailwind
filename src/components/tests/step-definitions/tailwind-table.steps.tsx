// src/components/tests/tailwind-table.steps.tsx
import * as TailwindTableStories from "../../tailwind-table/TailwindTable.stories.tsx"
import { composeStories } from "@storybook/react"
import { act, render } from "@testing-library/react"
import { createRTLTableTester } from "@tests/utils/table-testing/factory"
import {
  executeDataTableInput,
  executeTableClick,
  openColumnSelectorMenu,
  toggleColumnVisibility,
  verifyColumnIsHidden,
} from "@tests/utils/table-testing/table-operations"
import { TableTester } from "@tests/utils/table-testing/types"
import {
  verifyActionButtons,
  verifyColumnHeaders,
  verifyColumnValues,
  verifyEditForm,
  verifyTableData,
} from "@tests/utils/table-testing/verifiers"
import { AriaRole } from "@tests/utils/types.ts"
import { Given, Then, When } from "quickpickle"
import { expect } from "vitest"

// Create type for world object
type TestWorld = {
  component: any
  filterCriteria?: Array<{ placeholder?: string; value: string }> // Allow optional `placeholder`
  formData?: any
  schema?: any
  storyName: string
  tableName?: string
  tableRole?: AriaRole
  tableTester?: TableTester
}

// Helper function for table viewing logic - can be moved to a separate file
const executeViewTableStep = async (
  world: TestWorld,
  tableName: string,
  tableRole: AriaRole,
) => {
  const Story = stories[world.storyName as keyof typeof stories]

  if (!Story) {
    throw new Error(
      `Story "${world.storyName}" not found in TailwindTable stories`,
    )
  }

  // Store both schema and formData from the story in the world object
  world.schema = Story.args.schema
  world.formData = Story.args.formData

  // Wrap rendering in act() to handle state updates properly
  await act(async () => {
    render(<Story />)
  })

  // Store the table name and role for later steps
  world.tableName = tableName
  world.tableRole = tableRole
  world.tableTester = createRTLTableTester()
}

// Compose the stories for direct testing
const stories = composeStories(TailwindTableStories)

// Background steps
Given(
  "I have a table with schema defining several properties",
  async (world: TestWorld) => {
    world.storyName = "Default"
  },
)

Given("I have some initial data records", async (world: TestWorld) => {
  world.storyName = "Default"
})

// Action steps
/**
 * Views the specified table as the specified type
 * @example When I view the "Data records table" as a "grid"
 * @param {TestWorld} world - Test context
 * @param {string} tableName - Name of the table
 * @param {string} tableRole - Role of the table (grid/table)
 */
When(
  "I view the {tableName} as a {tableRole}",
  async (world: TestWorld, tableName: string, tableRole: "grid" | "table") => {
    await executeViewTableStep(world, tableName, tableRole as AriaRole)
  },
)

// Assertion steps
Then(
  "I should see column headers based on the schema properties",
  async (world: TestWorld) => {
    const { schema, tableName, tableRole, tableTester } = world

    if (!tableTester || !tableName || !tableRole || !schema) {
      throw new Error("Required test context not initialized")
    }

    const table = await tableTester.getTableByRole(tableRole, tableName)

    try {
      await verifyColumnHeaders(tableTester, schema, table)
    } catch (error: any) {
      expect.fail(error.message)
    }
  },
)

Then("I should see rows displaying my data", async (world: TestWorld) => {
  const { schema, formData, tableName, tableRole, tableTester } = world

  if (!tableTester || !tableName || !tableRole || !schema || !formData) {
    throw new Error("Required test context not initialized")
  }

  const table = await tableTester.getTableByRole(tableRole, tableName)

  try {
    await verifyTableData(tableTester, schema, formData, table)
  } catch (error: any) {
    expect.fail(error.message)
  }
})

Then("each row should have action buttons", async (world: TestWorld) => {
  const { tableName, tableRole, tableTester } = world

  if (!tableTester || !tableName || !tableRole) {
    throw new Error("Required test context not initialized")
  }

  const table = await tableTester.getTableByRole(tableRole, tableName)

  try {
    await verifyActionButtons(tableTester, table)
  } catch (error: any) {
    expect.fail(error.message)
  }
})

/**
 * Consolidated step for clicking various table elements using aria roles for determinism
 * Examples:
 * - When I click on sortable column header named "Name"
 * - When I click the "Add new record" button
 * - When I click the "Delete row" button for row 2
 * - When I click on column header named "Age"
 * @param {TestWorld} world - Test context
 */
When(
  /I (?:click|activate|toggle) (?:on )?(?:the )?(?:"([^"]*)" button for row (\d+)|"([^"]*)" (?:button|control|icon)|(?:(sortable) )?column header(?:(?: labeled)? "([^"]*)"|))/,
  async (
    world: TestWorld,
    rowButtonName?: string,
    rowIndex?: string,
    buttonName?: string,
    sortableFlag?: string,
    columnName?: string,
  ) => {
    const { tableTester, tableName, tableRole } = world

    if (!tableTester || !tableName || !tableRole) {
      throw new Error("Required test context not initialized")
    }

    const table = await tableTester.getTableByRole(tableRole, tableName)

    // Wrap interactions in act()
    await act(async () => {
      await executeTableClick({
        tableTester,
        table,
        rowButtonName,
        rowIndex,
        buttonName,
        sortableFlag,
        columnName,
      })
    })
  },
)

When(
  /I enter (?:data|values|search criteria) in "([^"]*)":$/,
  async (world: TestWorld, _componentName: string, dataTable) => {
    const { tableTester } = world;

    if (!tableTester) {
      throw new Error("Required test context not initialized");
    }

    // Use the shared operation function
    await act(async () => {
      // Store filter criteria for later verification
      world.filterCriteria = await executeDataTableInput({
        tableTester,
        dataTable
      });
    });
  }
)

Then("only matching rows should be displayed", async (world: TestWorld) => {
  const { tableTester, tableName, tableRole, filterCriteria } = world;

  if (!tableTester || !tableName || !tableRole || !filterCriteria) {
    throw new Error("Required test context not initialized");
  }

  // Get the table and rows
  const table = await tableTester.getTableByRole(tableRole, tableName);
  const rows = await tableTester.getAllRows(table);

  // Skip header row
  const dataRows = rows.slice(1);

  // For each visible data row, verify it matches ALL filter criteria
  for (const row of dataRows) {
    const cells = await tableTester.getCellsInRow(row);
    const cellContents = await Promise.all(
      cells.map(cell => tableTester.getCellContent(cell))
    );

    const rowText = cellContents.join(' ').toLowerCase();

    // Verify this row matches all filter criteria
    for (const criteria of filterCriteria) {
      const includesValue = rowText.includes(criteria.value.toLowerCase());
      expect(
        includesValue,
        `Row does not contain filter criteria "${criteria.value}"`
      ).toBe(true);
    }
  }
});

Then("I should see an {string} for row {int}", async (world: TestWorld, formName: string, row: number) => {
  const { tableTester, schema, formData } = world;

  if (!tableTester || !schema || !formData) {
    throw new Error("Required test context not initialized");
  }

  try {
    await verifyEditForm({
      schema,
      formData,
      tableTester,
      formName,
      row
    });
  } catch (error: any) {
    expect.fail(error.message);
  }
});

When("I update {string} in the edit form", async (world: TestWorld, fieldName: string) => {
  const { tableTester } = world;

  if (!tableTester) {
    throw new Error("Required test context not initialized");
  }

  await act(async () => {

    // Find the field by label
    const input = await tableTester.findElementByRole('textbox', {
      name: new RegExp(`.*${fieldName}.*`, 'i')
    });

    if (!input) {
      throw new Error(`Form field "${fieldName}" not found`);
    }

    // Perform the edit operations directly using tableTester methods
    await tableTester.click(input);
    await tableTester.clear(input);
    await tableTester.type(input, `Updated ${fieldName}`);
  });
});

// Colum sorting

Then(
  "the data should be sorted by that column:",
  async (world: TestWorld, dataTable) => {
    const { tableTester, tableName, tableRole } = world;

    if (!tableTester || !tableName || !tableRole) {
      throw new Error("Required test context not initialized");
    }

    const table = await tableTester.getTableByRole(tableRole, tableName);

    await act(async () => {
      try {
        await verifyColumnValues({
          tableTester,
          table,
          dataTable,
        });
      } catch (error: any) {
        expect.fail(error.message);
      }
    });
  }
);


// Column Selector

When("I open the column selector menu", async (world: TestWorld) => {
  const { tableTester } = world;

  if (!tableTester) {
    throw new Error("Required test context not initialized");
  }

  await act(async () => {
    await openColumnSelectorMenu({ tableTester });
  });
});

When("I toggle visibility for a specific column", async (world: TestWorld) => {
  const { tableTester } = world;

  if (!tableTester) {
    throw new Error("Required test context not initialized");
  }

  await act(async () => {
    await toggleColumnVisibility({ tableTester });
  });
});

Then("that column should be hidden from view", async (world: TestWorld) => {
  const { tableTester, tableName, tableRole } = world;

  if (!tableTester || !tableName || !tableRole) {
    throw new Error("Required test context not initialized");
  }

  const table = await tableTester.getTableByRole(tableRole, tableName);

  const isHidden = await verifyColumnIsHidden({ tableTester, table });
  expect(isHidden).toBe(true);
});
