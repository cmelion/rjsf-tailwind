import { Page } from "@playwright/test";
// Import the roles object from aria-query
import type {
  ARIACompositeWidgetRole,
  ARIADocumentStructureRole,
  ARIAWidgetRole
} from 'aria-query';

// Create a union of all valid ARIA roles by directly using the predefined types
export type AriaRole =
  | ARIACompositeWidgetRole | ARIADocumentStructureRole | ARIAWidgetRole;

// Define types for step parameters and world
export type World = {
  page: Page
}

export type TestRunnerType = "rtl" | "playwright";