// src/components/tests/step-definitions/tailwind-table.steps.tsx
import * as AppStories from "@/App.stories"
import * as TailwindTableStories from "../../tailwind-table/TailwindTable.stories.tsx"
import { useStore } from "@/store" // <-- Import the Zustand store hook
import { composeStories } from "@storybook/react"
import { act, render } from "@testing-library/react"
import { createRTLTableTester } from "@tests/utils/table-testing/factory"
import {
  confirmColumnIsHidden,
  executeDataTableInput,
  executeTableClick,
  openColumnSelectorMenu,
  toggleColumnVisibility,
} from "@tests/utils/table-testing/table-operations"
import { TableTester } from "@tests/utils/table-testing/types"
import {
  verifyActionButtons,
  verifyColumnHeaders,
  verifyColumnValues,
  verifyEditForm,
  verifyNewRowAdded,
  verifyRowIsRemoved,
  verifyTableData,
} from "@tests/utils/table-testing/verifiers"
import { AriaRole } from "@tests/utils/types.ts"
import { Given, Then, When } from "quickpickle"
import { expect } from "vitest"

// Compose stories
// With this lazy loading approach:
let componentStoriesCache: ReturnType<typeof composeStories<typeof TailwindTableStories>> | null = null;
let appStoriesCache: ReturnType<typeof composeStories<typeof AppStories>> | null = null;

// Lazy getters that compose stories only when needed
const getComponentStories = () => {
  if (!componentStoriesCache) {
    componentStoriesCache = composeStories(TailwindTableStories);
  }
  return componentStoriesCache;
};

const getAppStories = () => {
  if (!appStoriesCache) {
    appStoriesCache = composeStories(AppStories);
  }
  return appStoriesCache;
};

// Create type for world object
type TestWorld = {
  component: any;
  filterCriteria?: Array<{ placeholder?: string; value: string }>;
  formData?: any; // Data from component story OR store in App context
  schema?: any; // Schema from component story OR store in App context
  storyName?: keyof ReturnType<typeof getComponentStories>;
  tableName?: string;
  tableRole?: AriaRole;
  tableTester?: TableTester;
  context?: 'component' | 'app'; // <-- Add context flag
};

// --- Step Definitions ---

// Component Context Setup
Given(
  "I have a table with schema defining several properties",
  async (world: TestWorld) => {
    world.storyName = "Default";
    world.context = 'component'; // Set context
  },
);

Given("I have some initial data records", async (world: TestWorld) => {
  // This step might be redundant if the previous one always sets the story
  // Ensure it doesn't overwrite context if called after the App context Given
  if (!world.context) {
    world.storyName = "Default";
    world.context = 'component'; // Set context
  }
});

// App Context Setup
Given("I am viewing the application", async (world: TestWorld) => {
  const AppStory = getAppStories().Default; // Or choose a specific App state story
  if (!AppStory) {
    throw new Error("Default App story not found.");
  }

  // Render the chosen App story
  await act(async () => {
    render(<AppStory />);
  });

  // Initialize the table tester for interacting with the DOM
  world.tableTester = createRTLTableTester();
  world.context = 'app'; // Set context
  world.schema = undefined; // Explicitly clear schema/data from component context
  world.formData = undefined;
  world.storyName = undefined; // This is now valid as storyName is optional
  // NOTE: Store state will be accessed in the 'When I view...' step
});

When("I have Switched to Table View", async (world: TestWorld) => {
  const { tableTester } = world;
  const buttonText = "Switch to Table View";

  if (!tableTester) {
    throw new Error("Required test context not initialized");
  }

  // Now click the button to switch views
  await act(async () => {
    const button = await tableTester.findElementByRole('button', { name: buttonText });
    if (!button) {
      throw new Error(`Button with text "${buttonText}" not found`);
    }
    await tableTester.click(button);
  });

});


// Modified Action step: Views the specified table
When(
  "I view the {tableName} as a {tableRole}",
  async (world: TestWorld, tableName: string, tableRole: "grid" | "table") => {
    world.tableName = tableName;
    world.tableRole = tableRole as AriaRole;

    if (world.context === 'component') {
      // --- Component Story Context ---
      if (!world.storyName) { // Check if storyName is set for component context
        throw new Error("Component story name not set in world context.");
      }
      const Story = getComponentStories()[world.storyName];
      if (!Story) {
        throw new Error(
          `Story "${world.storyName}" not found in TailwindTable stories`,
        );
      }
      // Store schema/data from component story args
      world.schema = Story.args.schema;
      world.formData = Story.args.formData;

      // Render the component story
      await act(async () => {
        render(<Story />);
      });
      // Initialize tester for component context
      world.tableTester = createRTLTableTester();

    } else if (world.context === 'app') {
      // --- App Story Context ---
      // App is already rendered by the 'Given' step, tester is initialized.
      if (!world.tableTester) {
        throw new Error("Table tester not initialized for App context.");
      }
      try {
        // Verify the table exists within the App context.
        // Use findByRole for potential async rendering in App
        await world.tableTester.getTableByRole(
          world.tableRole,
          world.tableName
        );

        // <-- Access schema and formData from Zustand store -->
        const storeState = useStore.getState();
        world.schema = storeState.schema;
        world.formData = storeState.formData;

        if (!world.schema || !world.formData) {
          console.warn("Schema or formData not found in Zustand store state for App context.");
          // Decide if this should be an error or just a warning
          // throw new Error("Schema or formData not found in Zustand store state.");
        }

      } catch (e) {
        throw new Error(
          `Table "${tableName}" with role "${tableRole}" not found within the rendered application or store state inaccessible. Error: ${e}`,
        );
      }
    } else {
      throw new Error("Test context (component or app) not set.");
    }
  },
);

// Modified Assertion Step: Use schema from world (story or store)
Then(
  "I should see column headers based on the schema properties",
  async (world: TestWorld) => {
    const { schema, tableName, tableRole, tableTester, context } = world;

    if (!tableTester || !tableName || !tableRole) {
      throw new Error("Required table identifiers not initialized");
    }
    // Check if schema is available (either from story or store)
    if (!schema) {
      throw new Error(`Schema not available in ${context} context`);
    }

    const table = await tableTester.getTableByRole(tableRole, tableName);
    // Use the schema from the world object, regardless of context
    await verifyColumnHeaders(tableTester, schema, table);
  },
);

// Modified Assertion Step: Use formData from world (story or store)
Then("I should see rows displaying my data", async (world: TestWorld) => {
  const { schema, formData, tableName, tableRole, tableTester, context } = world;

  if (!tableTester || !tableName || !tableRole) {
    throw new Error("Required table identifiers not initialized");
  }
  // Check if schema and formData are available (either from story or store)
  if (!schema || !formData) {
    throw new Error(`Schema or formData not available in ${context} context`);
  }

  const table = await tableTester.getTableByRole(tableRole, tableName);
  // Use the schema and formData from the world object, regardless of context
  await verifyTableData(tableTester, schema, formData, table);
});

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

  const isHidden = await confirmColumnIsHidden({ tableTester, table });
  expect(isHidden).toBe(true);
});

Then("the row data should be updated with my changes", async (world: TestWorld) => {
  const { tableTester, tableName, tableRole } = world;

  if (!tableTester || !tableName || !tableRole) {
    throw new Error("Required test context not initialized");
  }

  const table = await tableTester.getTableByRole(tableRole, tableName);

  // Get the updated row (row 2 from the scenario)
  const rowIndex = 2;
  const row = await tableTester.getRowByIndex(table, rowIndex);

  // Get all cells in the row
  const cells = await tableTester.getCellsInRow(row);

  // Get the text content of the first cell (assuming Name is the first column)
  // You may need to adjust this logic if Name is in a different position
  const nameCell = cells[0];
  const cellContent = await tableTester.getCellContent(nameCell);

  // Verify the cell contains the updated value
  const expectedValue = "Updated Name";
  expect(
    cellContent.includes(expectedValue),
    `Row ${rowIndex} was not updated with "${expectedValue}"`
  ).toBe(true);
});

Then("that row should be removed from the table", async (world: TestWorld) => {
  const { tableTester, tableName, tableRole } = world

  if (!tableTester || !tableName || !tableRole) {
    throw new Error("Required test context not initialized")
  }

  const table = await tableTester.getTableByRole(tableRole, tableName)
  const deletedRowIndex = 2 // Or get this dynamically if needed

  try {
    // Note: confirmRowIsRemoved now handles the assertion internally
    await verifyRowIsRemoved({
      tableTester,
      table,
      rowIndexToRemove: deletedRowIndex,
    })
  } catch (error: any) {
    // If confirmRowIsRemoved throws (e.g., assertion fails), fail the test
    expect.fail(error.message)
  }
})
Then("I should see a form for creating a new record", async (world: TestWorld) => {
  const { tableTester } = world;

  if (!tableTester) {
    throw new Error("Required test context not initialized");
  }

  // Find the dialog by role since CreateRowForm uses role="dialog"
  const formDialog = await tableTester.findElementByRole("dialog", {
    name: /create new record/i
  });

  expect(formDialog, "Create record dialog not found").toBeDefined();

  // Verify essential form fields exist within the dialog
  const nameField = await tableTester.findElementByRole("textbox", {
    name: /name/i
  });
  expect(nameField, "Name field not found in create form").toBeDefined();
});

const newTester = {
  name: "New Test Record Name",
  age: "33",
  email: "new@tester.com"
};

// Fix for the errors in the "I fill out the form and submit" step
When("I fill out the form and submit", async (world: TestWorld) => {
  const { tableTester } = world;

  if (!tableTester) {
    throw new Error("Required test context not initialized");
  }

  await act(async () => {
    // Define fields to fill with a small delay between operations
    const fieldsToFill = [
      {
        roleType: "textbox",
        nameMatcher: /name/i,
        value: newTester.name
      },
      {
        roleType: "spinbutton",
        nameMatcher: /age/i,
        value: String(newTester.age) // Convert number to string
      },
      {
        roleType: "textbox",
        nameMatcher: /email/i,
        value: newTester.email
      }
    ];

    // Fill each field with a small delay between operations
    for (const field of fieldsToFill) {
      const input = await tableTester.findElementByRole(field.roleType, {
        name: field.nameMatcher
      });

      if (!input) {
        throw new Error(`Form field matching ${field.nameMatcher} not found`);
      }

      // Clear and fill one field at a time
      await tableTester.click(input);
      await tableTester.clear(input);
      await tableTester.type(input, String(field.value)); // Convert to string here too

      // Small delay to allow React to process the update
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Find and click the submit button
    const submitButton = await tableTester.findElementByRole("button", {
      name: /submit|save|create/i
    });
    await tableTester.click(submitButton);
  });
});

Then("a new row should be added to the table", async (world: TestWorld) => {
  const { tableTester, tableName, tableRole } = world;

  if (!tableTester || !tableName || !tableRole) {
    throw new Error("Required test context not initialized");
  }

  const table = await tableTester.getTableByRole(tableRole, tableName);

  const rowFound = await verifyNewRowAdded({
    tableTester,
    table,
    rowData: newTester
  });

  expect(
    rowFound,
    "Newly added row with expected data not found in table"
  ).toBe(true);
});