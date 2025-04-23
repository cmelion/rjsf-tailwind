// tests/step-definitions/tailwind-table.steps.ts
import * as TailwindTableStories from "../../src/components/tailwind-table/TailwindTable.stories"
import { PlaywrightTableTester } from "../utils/table-testing/playwright-adapter"
import {
  verifyActionButtons,
  verifyColumnHeaders,
  verifyTableData,
} from "../utils/table-testing/verifiers"
import { AriaRole } from "../utils/types"
import { expect, Page } from "@playwright/test"
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
  tableTester: PlaywrightTableTester
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

// Background steps
Given("I have a table with schema defining several properties", async () => {
  // This is set up in the Storybook stories already
})

Given("I have some initial data records", async () => {
  // This is set up in the Storybook stories already
})

// Viewing table data
When(
  /I view the "(.*)" as a "(grid|table)"/,
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
  const tableTester = new PlaywrightTableTester(page)

  return {
    ...contextData,
    tableTester,
  }
}

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
