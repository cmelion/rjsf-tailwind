// tests/utils/form-testing/verifiers/verifyFormField.ts
import { expect } from "@playwright/test"; // Keep Playwright's expect for BDD context
import { FormTester } from "../types";
import { AriaRole } from "@tests/utils/types";

/**
 * Verifies the value of a specific form field using the FormTester's adapter.
 * @param formTester - The FormTester instance.
 * @param fieldType - The ARIA role of the field (e.g., 'textbox', 'checkbox').
 * @param fieldName - The accessible name or label of the field.
 * @param expectedValue - The expected value of the field.
 */
export async function verifyFormField(
  formTester: FormTester,
  fieldType: string,
  fieldName: string,
  expectedValue: string | number | boolean,
): Promise<void> {
  // Find the field using the formTester's method
  const field = await formTester.findFieldByRole(fieldType as AriaRole, {
    name: fieldName,
  });

  // Check if the field was found by the adapter
  expect(field, `Field "${fieldName}" (${fieldType}) not found`).toBeTruthy(); // Use truthy check as adapter might return different types

  // Add a runtime check to satisfy TS and handle potential null/undefined return from adapter
  if (!field) {
    throw new Error(`Field "${fieldName}" (${fieldType}) was unexpectedly null/undefined after findFieldByRole.`);
  }

  let actualValue: string | number | boolean | undefined | null;

  // Use the formTester's getAttribute method, which uses the adapter
  if (fieldType === "checkbox" || fieldType === "radio") {
    const checkedAttr = await formTester.getAttribute(field, 'checked');
    // Adapters might return different things for checked:
    // Playwright adapter returns 'true' or null.
    // RTL adapter might return 'true', '', or null depending on the attribute.
    // Standard DOM checked is boolean.
    // We normalize to boolean true if the attribute exists and is not 'false', otherwise false.
    actualValue = checkedAttr !== null && checkedAttr !== 'false'; // Normalize to boolean

    // Ensure the expected value is also boolean for comparison
    expect(typeof expectedValue, `Expected value for ${fieldType} "${fieldName}" must be boolean`).toBe('boolean');

  } else {
    // For other fields, get the 'value' attribute
    const valueAttr = await formTester.getAttribute(field, 'value');
    actualValue = valueAttr; // Keep as string or null initially

    // If expecting a number, convert the actual value (which is likely a string from getAttribute)
    if (typeof expectedValue === 'number') {
      // Handle potential null/empty string before converting
      if (actualValue === null || actualValue === undefined || actualValue === '') {
        actualValue = NaN; // Or handle as appropriate for your use case (e.g., throw error, default to 0)
      } else {
        actualValue = Number(actualValue);
      }
      expect(isNaN(actualValue as number), `Could not convert actual value "${valueAttr}" to a number for field "${fieldName}"`).toBe(false);
    } else {
      // If expecting a string, handle null case from getAttribute if necessary
      // Often, an empty input might return "" or null depending on adapter/DOM state.
      // If expectedValue is "", we might want null to also pass. Adjust as needed.
      if (expectedValue === "" && actualValue === null) {
        actualValue = "";
      }
    }
  }

  // Use Playwright's expect for value comparison
  expect(
    actualValue,
    `Field "${fieldName}" value mismatch. Expected: ${expectedValue}, Actual: ${actualValue}`,
  ).toBe(expectedValue);
}