// tests/utils/form-operations.ts
import { FormTester } from './types';
import { AriaRole } from '../types';
import { Page } from '@playwright/test';

interface FieldConfig {
  roleType?: AriaRole;
  nameMatcher?: RegExp | string;
}

type FieldMapping = Record<string, FieldConfig>;

function getDefaultRole(key: string, value: any): AriaRole {
  if (key.toLowerCase() === 'age' && typeof value === 'number') {
    return 'spinbutton';
  }
  return 'textbox';
}

/**
 * Fills form fields using a FormTester instance.
 * @param formTester - The form testing utility instance.
 * @param formData - Data object to fill the form.
 * @param fieldMapping - Optional mapping for specific fields.
 * @param delayMs - Optional delay between field interactions (for RTL).
 */
export async function fillFormFields(
  formTester: FormTester, // Use FormTester
  formData: Record<string, string | number>,
  fieldMapping: FieldMapping = {},
  delayMs = 0
): Promise<void> {
  for (const [key, value] of Object.entries(formData)) {
    const config = fieldMapping[key] || {};
    const roleType = config.roleType || getDefaultRole(key, value);
    const nameMatcher = config.nameMatcher || new RegExp(key, 'i');

    // Use formTester to find the element
    const input = await formTester.findFieldByRole(roleType, { name: nameMatcher });

    if (!input) {
      console.warn(`Form field with role "${roleType}" and name matching "${nameMatcher}" (for key "${key}") not found.`);
      continue;
    }

    try {
      // Use formTester for interactions
      await formTester.click(input);
      await formTester.clear(input);
      await formTester.type(input, String(value));

      if (delayMs > 0) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }

    } catch (error) {
      console.error(`Error interacting with field "${key}" (Role: ${roleType}, Matcher: ${nameMatcher}):`, error);
      throw new Error(`Failed to fill field "${key}".`);
    }
  }
}

/**
 * Submits a form using a FormTester instance.
 * @param formTester - The form testing utility instance.
 * @param submitButtonMatcher - Regex or string for the submit button name.
 */
export async function submitForm(
  formTester: FormTester, // Use FormTester
  submitButtonMatcher: RegExp | string = /submit|save|create/i
): Promise<void> {
  // Use formTester to find the button
  const submitButton = await formTester.findButtonByRole("button", { name: submitButtonMatcher });
  if (!submitButton) {
    throw new Error(`Submit button matching "${submitButtonMatcher}" not found.`);
  }
  // Use formTester to click
  await formTester.click(submitButton);
}

/**
 * Updates a specific form field with a prefixed value.
 * @param formTester - The form testing utility instance
 * @param fieldName - Name of the field to update
 * @param valuePrefix - Prefix to add to the field name as the new value
 * @param roleType - ARIA role of the field element
 * @param page - Optional page instance for context storage
 * @returns The updated value
 */
export async function updateFormField(
  formTester: FormTester,
  fieldName: string,
  valuePrefix: string = "Updated ",
  roleType: AriaRole = 'textbox',
  page?: Page  // Now properly typed
): Promise<string> {
  const fieldIdentifier = new RegExp(fieldName, 'i');
  const updatedValue = `${valuePrefix}${fieldName}`;

  const input = await formTester.findFieldByRole(roleType, { name: fieldIdentifier });

  if (!input) {
    throw new Error(`Form field "${fieldName}" not found`);
  }

  // TODO: replace with form.fill in element-adapter
  await formTester.click(input);
  await formTester.clear(input);
  await formTester.type(input, updatedValue);

  // Store context if page is provided
  if (page) {
    await page.evaluate((data) => {
      // @ts-expect-error Using window for storage
      window.__FORM_UPDATE_CONTEXT = window.__FORM_UPDATE_CONTEXT || {};
      // @ts-expect-error Using window for storage
      window.__FORM_UPDATE_CONTEXT[data.fieldName] = data.updatedValue;
    }, { fieldName, updatedValue });
  }

  return updatedValue;
}