// tests/utils/form-testing/verifiers/verifyFormSubmission.ts
import { FormTester } from '../types';

/**
 * Verifies form can be submitted successfully
 */
export async function verifyFormSubmission({
  formTester,
  formName = 'Form',
  submitButtonText = /submit|save|create/i,
  successIndicator
}: {
  formTester: FormTester;
  formName?: string;
  submitButtonText?: RegExp | string;
  successIndicator?: {
    role?: string;
    text?: RegExp | string;
    timeout?: number;
  };
}): Promise<void> {
  // Find the form
  const form = await formTester.findElementByRole('form', { name: formName });
  if (!form) {
    throw new Error(`Form "${formName}" not found`);
  }

  // Find and click the submit button
  const submitButton = await formTester.findButtonByRole('button', { name: submitButtonText });
  if (!submitButton) {
    throw new Error(`Submit button matching "${submitButtonText}" not found`);
  }

  await formTester.click(submitButton);

  // If success indicator provided, verify it appears
  if (successIndicator) {
    const { role = 'alert', text, timeout = 5000 } = successIndicator;

    const indicator = await formTester.waitForElementByRole(role, {
      name: text,
      timeout
    });

    if (!indicator) {
      throw new Error(`Success indicator (${role} with text "${text}") not found after submission`);
    }
  }
}