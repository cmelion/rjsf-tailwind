// tests/utils/form-testing/verifiers/verifyFormValidation.ts
import { FormTester } from '../types';
import { AriaRole } from '../../types';

/**
 * Verifies form validation works as expected
 */
export async function verifyFormValidation({
                                             formTester,
                                             fieldsToTest,
                                             submitButtonText = /submit|save|create/i,
                                           }: {
  formTester: FormTester;
  fieldsToTest: Array<{
    fieldName: string;
    fieldType?: string;
    invalidValue: string;
    expectedError: string | RegExp;
  }>;
  submitButtonText?: RegExp | string;
}): Promise<void> {
  // Test each field
  for (const { fieldName, fieldType = 'textbox', invalidValue, expectedError } of fieldsToTest) {
    // Find the field
    const field = await formTester.findFieldByRole(fieldType as AriaRole, {
      name: new RegExp(`.*${fieldName}.*`, 'i')
    });

    if (!field) {
      throw new Error(`Form field "${fieldName}" not found`);
    }

    // Enter invalid value
    await formTester.click(field);
    await formTester.clear(field);
    await formTester.type(field, invalidValue);

    // Find and click the submit button
    const submitButton = await formTester.findButtonByRole('button', { name: submitButtonText });
    if (!submitButton) {
      throw new Error(`Submit button matching "${submitButtonText}" not found`);
    }

    await formTester.click(submitButton);

    // Verify error message appears
    const errorMessage = await formTester.findElementByRole('alert', { name: /.*/ });
    if (!errorMessage) {
      throw new Error(`No error message found after submitting invalid value for "${fieldName}"`);
    }

    const errorText = await formTester.getTextContent(errorMessage);
    const errorMatches = typeof expectedError === 'string'
      ? errorText.includes(expectedError)
      : expectedError.test(errorText);

    if (!errorMatches) {
      throw new Error(`Error message for "${fieldName}" doesn't match expected error (expected: ${expectedError}, found: ${errorText})`);
    }
  }
}