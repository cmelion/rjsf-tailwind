// src/components/tests/types.ts
import { FormTester } from "@tests/utils/form-testing/types";
import { TableTester } from "@tests/utils/table-testing/types";
import { AriaRole } from "react";
import { ComponentStoryName } from "./utils/story-helpers";
import { BaseComponentTester } from "@tests/utils/component-testing/base-component-tester";
import { Page } from "@playwright/test";

export type TestRunnerType = "rtl" | "playwright";

export interface TestWorld {
  // Testing infrastructure
  page?: Page; // For Playwright only
  component: any;
  runner: TestRunnerType;

  // Common test context
  context?: "component" | "app";
  storyName?: ComponentStoryName;

  // form testing
  formData?: Record<string, any>;
  formTester?: FormTester;

  // Table testing
  schema?: any;
  tableName?: string;
  tableRole?: AriaRole;
  tableTester?: TableTester;
  filterCriteria?: Array<{ placeholder?: string; value: string }>;

  // Utility method to get appropriate tester
  getTester<T extends BaseComponentTester>(type: "form" | "table"): T;
}