// tests/utils/factory.ts
import { Page } from "@playwright/test";
import { createRTLFormTester } from "./utils/form-testing/factory";
import { createPlaywrightFormTester } from "./utils/form-testing/factory";
import { createRTLTableTester } from "./utils/table-testing/factory";
import { createPlaywrightTableTester } from "./utils/table-testing/factory";
import { FormTester } from "./utils/form-testing/types";
import { TableTester } from "./utils/table-testing/types";
import { BaseComponentTester } from "./utils/component-testing/base-component-tester";
import { TestRunnerType } from "@/components/tests/types";

export function createTester(
  type: "form" | "table",
  runner: TestRunnerType,
  options?: {
    page?: Page;
    [key: string]: any;
  }
): FormTester | TableTester {
  // Handle RTL environment
  if (runner === "rtl") {
    return type === "form"
      ? createRTLFormTester()
      : createRTLTableTester();
  }

  // Handle Playwright environment
  else if (runner === "playwright") {
    const page = options?.page;
    if (!page) {
      throw new Error("Page instance is required for Playwright testers");
    }

    return type === "form"
      ? createPlaywrightFormTester(page)
      : createPlaywrightTableTester(page);
  }

  throw new Error(`Unsupported runner type: ${runner}`);
}

// Helper to create a tester in the TestWorld context
export function createWorldTester<T extends BaseComponentTester>(
  world: { runner: TestRunnerType; page?: Page },
  type: "form" | "table"
): T {
  return createTester(type, world.runner, { page: world.page }) as unknown as T;
}