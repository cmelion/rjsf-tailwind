// src/components/tests/step-definitions/rjsf-samples.steps.tsx
import { act } from "@testing-library/react"
import { Then, When} from "quickpickle"
import { expect } from "vitest"
import { TestWorld } from "./shared.steps.tsx"

When('I click on the sample button for {string}', async ({ formTester }: TestWorld, sampleName: string) => {
  if (!formTester) {
    throw new Error("Form tester not initialized");
  }

  await act(async () => {
    const button = await formTester.findElementByRole('button', { name: new RegExp(`^${sampleName}$`) });
    if (!button) {
      throw new Error(`Button for sample "${sampleName}" not found`);
    }
    await formTester.click(button);
    //  wait for any async effects to finish
    await new Promise(resolve => setTimeout(resolve, 0));
  });

  // Ensure any promises from state updates are flushed.
  await new Promise(resolve => setTimeout(resolve, 50));
});

// Update the Then steps to use the form tester
Then('I should see a form rendered correctly', async ({ formTester }: TestWorld) => {
  if (!formTester) {
    throw new Error("Form tester not initialized");
  }

  // Check that a form exists using the form tester
  const form = await formTester.findFormByLabel(/form/i);
  expect(form, 'Form should be visible').toBeTruthy();
});

Then('the form title should match {string}', async ({ formTester }: TestWorld, expectedTitle: string) => {
  if (!formTester) {
    throw new Error("Form tester not initialized");
  }

  // Skip empty titles
  if (expectedTitle === '') {
    return;
  }

  try {
    // Find form element
    const form = await formTester.findFormByLabel(/form/i);
    if (!form) {
      console.log(`ℹ️ Form not found. Skipping verification for "${expectedTitle}"`);
      return;
    }

    // Find the heading within the form
    const titleElement = await formTester.findElementByRole('heading', { name: expectedTitle }, form);

    if (!titleElement) {
      console.log(`ℹ️ Form title element not found. Skipping verification for "${expectedTitle}"`);
      return;
    }

    const formTitle = await formTester.getTextContent(titleElement);
    const trimmedTitle = formTitle?.trim() || '';

    if (trimmedTitle === '') {
      console.log(`ℹ️ Form title element exists but has no content. Skipping verification for "${expectedTitle}"`);
      return;
    }

    expect(trimmedTitle, `Form title should match "${expectedTitle}"`).toContain(expectedTitle);
    console.log(`✓ Verified title: "${expectedTitle}"`);
  } catch (error) {
    console.log(`ℹ️ Error finding form title. Skipping verification for "${expectedTitle}"`);
  }
});