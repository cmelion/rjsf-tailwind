// src/components/tests/tailwind-table.steps.tsx
import * as TailwindTableStories from "../../tailwind-table/TailwindTable.stories.tsx"
import { composeStories } from "@storybook/react"
import { render } from "@testing-library/react"
import { RTLTableTester } from "@tests/utils/table-testing/rtl-adapter.ts"
import {
  verifyActionButtons,
  verifyColumnHeaders,
  verifyTableData,
} from "@tests/utils/table-testing/verifiers.ts"
import { AriaRole } from "@tests/utils/types.ts"
import { Given, Then, When } from "quickpickle"
import { expect } from "vitest"

// Create type for world object
type TestWorld = {
  storyName: string
  component: any
  schema?: any
  formData?: any
  tableName?: string
  tableRole?: AriaRole
  tableTester?: RTLTableTester
}

// Helper function for table viewing logic - can be moved to a separate file
const executeViewTableStep = async (world: TestWorld, tableName: string, tableRole: AriaRole) => {
  const Story = stories[world.storyName as keyof typeof stories]

  if (!Story) {
    throw new Error(
      `Story "${world.storyName}" not found in TailwindTable stories`,
    )
  }

  // Store both schema and formData from the story in the world object
  world.schema = Story.args.schema
  world.formData = Story.args.formData

  // Render the component inside a test-friendly environment
  render(<Story />)

  // Store the table name and role for later steps
  world.tableName = tableName
  world.tableRole = tableRole
  world.tableTester = new RTLTableTester()
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
  world.storyName = "ManyRows"
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
  /I view the "(.*)" as a "(grid|table)"/,
  async (world: TestWorld, tableName: string, tableRole: "grid" | "table") => {
    await executeViewTableStep(world, tableName, tableRole as AriaRole);
  }
);

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
