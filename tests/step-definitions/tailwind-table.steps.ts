// tests/step-definitions/tailwind-table.steps.ts
import * as TailwindTableStories from "../../src/components/tailwind-table/TailwindTable.stories"
import { createPlaywrightTableTester } from "../utils/table-testing/factory"
import { TableTester } from "../utils/table-testing/types"
import {
  verifyActionButtons,
  verifyColumnHeaders,
  verifyColumnValues,
  verifyEditForm,
  verifyTableData,
} from "../utils/table-testing/verifiers"
import { AriaRole } from "../utils/types"
import { expect, Page } from "@playwright/test"
import {
  executeDataTableInput,
  executeTableClick,
  openColumnSelectorMenu,
  toggleColumnVisibility,
  verifyColumnIsHidden,
} from "@tests/utils/table-testing/table-operations"
import { createBdd } from "playwright-bdd"

// Create the BDD object
const { Given, When, Then } = createBdd()

// Define types for step parameters and world
type World = {
  page: Page
}

// Collection of data that needs to be passed between steps
type TableContext = {
  schema: any
  formData: any
  tableName: string
  tableRole: string
  tableTester: TableTester
  storyId: string
}

// Helper functions
const navigateToStory = async (page: Page, storyId = "default") => {
  const storyPath = `/iframe.html?args=&id=components-tailwindtable--${storyId.toLowerCase()}&viewMode=story`
  await page.goto(storyPath)
}

// Get story data directly from imported stories
const getStoryData = (storyId: string) => {
  // Access the story data directly from the imported module
  const story =
    TailwindTableStories[storyId as keyof typeof TailwindTableStories]

  if (!story || !story.args) {
    throw new Error(`Story "${storyId}" not found or has no args`)
  }

  return {
    schema: story.args.schema,
    formData: story.args.formData,
  }
}

// Helper to retrieve context from page storage
const getTableContext = async (page: Page): Promise<TableContext> => {
  // Get stored context from previous steps
  const contextData = await page.evaluate(() => {
    // @ts-expect-error Using window for storage between steps
    return window.__TABLE_TEST_CONTEXT
  })

  if (!contextData) {
    throw new Error(
      "Table test context not found - ensure you run the previous steps",
    )
  }

  // Create a new tester instance for this step (can't be stored in page context)
  const tableTester = createPlaywrightTableTester(page)

  return {
    ...contextData,
    tableTester,
  }
}

// Background steps
Given("I have a table with schema defining several properties", async () => {
  // This is set up in the Storybook stories already
})

Given("I have some initial data records", async () => {
  // This is set up in the Storybook stories already
})

// Viewing table data
When(
  "I view the {tableName} as a {tableRole}",
  async ({ page }: World, tableName: string, tableRole: "grid" | "table") => {
    const storyId = "Default" // Default story, can be parameterized if needed

    // Navigate to the story
    await navigateToStory(page, storyId)

    // Make sure the table is visible
    await page
      .getByRole(tableRole, { name: tableName })
      .waitFor({ state: "visible" })

    // Get story data directly from imported stories
    const { schema, formData } = getStoryData(storyId)

    // Store context data in the page's storage state
    await page.evaluate(
      (contextData) => {
        // @ts-expect-error Using window for storage between steps
        window.__TABLE_TEST_CONTEXT = contextData
      },
      {
        schema,
        formData,
        tableName,
        tableRole,
        storyId,
      },
    )
  },
)

Then(
  "I should see column headers based on the schema properties",
  async ({ page }: World) => {
    const { tableTester, tableName, tableRole, schema } =
      await getTableContext(page)

    const table = await tableTester.getTableByRole(
      tableRole as AriaRole,
      tableName,
    )

    try {
      await verifyColumnHeaders(tableTester, schema, table)
    } catch (error: any) {
      // Use Playwright's expect to assert that we don't have an error
      expect(error, error.message).toBeUndefined()
    }
  },
)

Then("I should see rows displaying my data", async ({ page }: World) => {
  const { tableTester, tableName, tableRole, schema, formData } =
    await getTableContext(page)

  const table = await tableTester.getTableByRole(
    tableRole as AriaRole,
    tableName,
  )

  try {
    await verifyTableData(tableTester, schema, formData, table)
  } catch (error: any) {
    // Use Playwright's expect to assert that we don't have an error
    expect(error, error.message).toBeUndefined()
  }
})

Then("each row should have action buttons", async ({ page }: World) => {
  const { tableTester, tableName, tableRole } = await getTableContext(page)

  const table = await tableTester.getTableByRole(
    tableRole as AriaRole,
    tableName,
  )

  try {
    await verifyActionButtons(tableTester, table)
  } catch (error: any) {
    // Use Playwright's expect to assert that we don't have an error
    expect(error, error.message).toBeUndefined()
  }
})

/**
 * Consolidated step for clicking various table elements using aria roles for determinism
 * Examples:
 * - When I click on sortable column header named "Name"
 * - When I click the "Add new record" button
 * - When I click the "Delete row" button for row 2
 * - When I click on column header named "Age"
 */
When(
  /I (?:click|activate|toggle) (?:on )?(?:the )?(?:"([^"]*)" button for row (\d+)|"([^"]*)" (?:button|control|icon)|(?:(sortable) )?column header(?:(?: labeled)? "([^"]*)"|))/,
  async (
    { page },
    rowButtonName?: string,
    rowIndex?: string,
    buttonName?: string,
    sortableFlag?: string,
    columnName?: string,
  ) => {
    const { tableTester, tableName, tableRole } = await getTableContext(page)

    const table = await tableTester.getTableByRole(
      tableRole as AriaRole,
      tableName,
    )

    await executeTableClick({
      tableTester,
      table,
      rowButtonName,
      rowIndex,
      buttonName,
      sortableFlag,
      columnName,
    })
  },
)

When(
  /I enter (?:data|values|search criteria) in "([^"]*)":$/,
  async ({ page }, _componentName: string, dataTable) => {
    const { tableTester } = await getTableContext(page)

    // Use the shared operation function
    const filterCriteria = await executeDataTableInput({
      tableTester,
      dataTable,
    })

    // Store in page context for later access
    await page.evaluate((criteria) => {
      // @ts-expect-error Using window for storage between steps
      window.__TABLE_TEST_CONTEXT = {
        // @ts-expect-error Using window for storage between steps
        ...window.__TABLE_TEST_CONTEXT,
        filterCriteria: criteria,
      }
    }, filterCriteria)
  },
)

Then("only matching rows should be displayed", async ({ page }) => {
  const context = await getTableContext(page)
  const { tableTester, tableName, tableRole } = context

  // Get filterCriteria from context
  const filterCriteria = await page.evaluate(() => {
    // @ts-expect-error Using window for storage between steps
    return window.__TABLE_TEST_CONTEXT.filterCriteria
  })

  if (!tableTester || !tableName || !tableRole || !filterCriteria) {
    throw new Error("Required test context not initialized")
  }

  // Get the table and rows
  const table = await tableTester.getTableByRole(
    tableRole as AriaRole,
    tableName,
  )
  const rows = await tableTester.getAllRows(table)

  // Skip header row
  const dataRows = rows.slice(1)

  // For each visible data row, verify it matches ALL filter criteria
  for (const row of dataRows) {
    const cells = await tableTester.getCellsInRow(row)
    const cellContents = await Promise.all(
      cells.map((cell) => tableTester.getCellContent(cell)),
    )

    const rowText = cellContents.join(" ").toLowerCase()

    // Verify this row matches all filter criteria
    for (const criteria of filterCriteria) {
      const includesValue = rowText.includes(criteria.value.toLowerCase())
      expect(
        includesValue,
        `Row with text "${rowText}" does not contain filter criteria "${criteria.value}"`,
      ).toBeTruthy()
    }
  }
})

Then(
  "I should see an {string} for row {int}",
  async ({ page }, formName: string, row: number) => {
    await page.setViewportSize({ width: 1024, height: 1024 })
    const { tableTester, schema, formData } = await getTableContext(page)

    if (!tableTester || !schema || !formData) {
      throw new Error("Required test context not initialized")
    }

    try {
      await verifyEditForm({
        schema,
        formData,
        tableTester,
        formName,
        row,
      })
    } catch (error: any) {
      // Use Playwright's expect to assert that we don't have an error
      expect(error, error.message).toBeUndefined()
    }
  },
)

// Colum sorting

Then(
  "the data should be sorted by that column:",
  async ({ page }, dataTable) => {
    const { tableTester, tableName, tableRole } = await getTableContext(page)

    const table = await tableTester.getTableByRole(
      tableRole as AriaRole,
      tableName,
    )

    try {
      await verifyColumnValues({
        tableTester,
        table,
        dataTable,
      })
    } catch (error: any) {
      expect(error, error.message).toBeUndefined()
    }
  },
)

// Column selector

When("I open the column selector menu", async ({ page }) => {
  const { tableTester } = await getTableContext(page)
  await openColumnSelectorMenu({ tableTester })
})

When("I toggle visibility for a specific column", async ({ page }) => {
  const { tableTester } = await getTableContext(page)
  await toggleColumnVisibility({ tableTester })
})

Then("that column should be hidden from view", async ({ page }) => {
  const { tableTester, tableName, tableRole } = await getTableContext(page)

  const table = await tableTester.getTableByRole(
    tableRole as AriaRole,
    tableName,
  )

  const isHidden = await verifyColumnIsHidden({ tableTester, table })
  expect(isHidden).toBeTruthy()
})
