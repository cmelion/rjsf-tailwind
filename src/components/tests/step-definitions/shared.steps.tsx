// src/components/tests/step-definitions/shared.steps.tsx
import { act, render } from "@testing-library/react"
import { Given } from "quickpickle"
import { createRTLTableTester } from "@tests/utils/table-testing/factory"
import { createRTLFormTester } from "@tests/utils/form-testing/factory"
import * as AppStories from "@/App.stories"
import * as TailwindTableStories from "@/components/tailwind-table/TailwindTable.stories.tsx"
import { composeStories } from "@storybook/react"
import { AriaRole } from "@tests/utils/types.ts"
import { FormTester } from "@tests/utils/form-testing/types"
import { TableTester } from "@tests/utils/table-testing/types"

// Lazy getters for stories
let appStoriesCache: ReturnType<typeof composeStories<typeof AppStories>> | null = null;
let componentStoriesCache: ReturnType<typeof composeStories<typeof TailwindTableStories>> | null = null; // Added

export const getAppStories = () => {
  if (!appStoriesCache) {
    appStoriesCache = composeStories(AppStories);
  }
  return appStoriesCache;
};

export const getComponentStories = () => { // Added
  if (!componentStoriesCache) {
    componentStoriesCache = composeStories(TailwindTableStories);
  }
  return componentStoriesCache;
};

export type TestWorld = {
  component: any;
  filterCriteria?: Array<{ placeholder?: string; value: string }>;
  formData?: any; // Data from component story OR store in App context
  formTester?: FormTester;
  schema?: any; // Schema from component story OR store in App context
  storyName?: keyof ReturnType<typeof getComponentStories>;
  tableName?: string;
  tableRole?: AriaRole;
  tableTester?: TableTester;
  context?: 'component' | 'app';
};

// Shared step definition used by multiple test files
Given("I am viewing the application", async (world: TestWorld) => {
  const AppStory = getAppStories().Default;
  if (!AppStory) {
    throw new Error("Default App story not found.");
  }

  if (!world.context) {
    world.storyName = "Default";
    world.context = 'app'; // Set context
  }

  // Render the chosen App story
  await act(async () => {
    render(<AppStory />);
  });

  // Initialize both testers for full functionality
  world.tableTester = createRTLTableTester();
  world.formTester = createRTLFormTester();
  world.context = 'app';
  world.schema = undefined;
  world.formData = undefined;
  world.storyName = undefined;
});