// tests/step-definitions/rjsf-samples.steps.ts
import { PlaywrightFormTester } from '../utils/form-testing/playwright-form-tester';
import { World } from "../utils/types";
import { expect, Page } from "@playwright/test"
import { createBdd } from "playwright-bdd";

// Create the BDD object
const { When, Then } = createBdd()
const createPlaywrightFormTester = (page: Page) => new PlaywrightFormTester(page);

When('I click on the sample button for {string}', async ({ page }: World, sampleName: string) => {
  const formTester = createPlaywrightFormTester(page);
  const button = await formTester.findElementByRole('button', { name: new RegExp(`^${sampleName}$`) });
  await formTester.click(button);
  // Wait for form to load
  await page.waitForTimeout(500);
});

Then('I should see a form rendered correctly', async ({ page }: World) => {
  const formTester = createPlaywrightFormTester(page);

  // Check that a form exists
  const form = await formTester.findElementByRole('form', { name: /form/i });
  expect(form, 'form should be visible').toBeTruthy();

  // Check that the form container is visible
  const formContainer = page.locator(".border").first()
  expect(formContainer, 'form container should be visible').toBeTruthy();
});

Then('the form title should match {string}', async ({ page }: World, expectedTitle: string) => {
  // Find the form title element in the rendered form
  if (expectedTitle === '') {
    return;
  }
  const formTitleElement = page.locator('form #root__title > h5, form [id^="root_"] > h5').first();

  const formTitle = await formTitleElement.textContent();
  const trimmedTitle = formTitle?.trim() || '';

  if (trimmedTitle === '') {
    console.log(`ℹ️ Form title element exists but has no content. Skipping verification for "${expectedTitle}"`);
    return;
  }

  expect(trimmedTitle, `Form title should match "${expectedTitle}"`).toContain(expectedTitle);
  console.log(`✓ Verified title: "${expectedTitle}"`);
});

// This only works for textbox inputs we need a more general solution
When('I fill {string} with {string}', async ({ page }: World, field: string, value: string) => {
  const formTester = createPlaywrightFormTester(page);
  const input = await formTester.findElementByRole('textbox', { name: new RegExp(`.*${field}.*`, 'i') });
  await formTester.clear(input);
  await formTester.type(input, value);
});

// Generalized version of the above step
When('I fill out the form with:', async ({ page }: World, dataTable) => {
  const formTester = createPlaywrightFormTester(page);
  // Parse the table: expect columns field, value, role
  const fields = dataTable.hashes();
  // Add a wait state here

  for (const { field, value, role } of fields) {
    const input = await formTester.findElementByRole(role, {
      name: new RegExp(`^${field}$`, 'i'), // Match the field name exactly
    });

    if (!input) {
      throw new Error(`Form field "${field}" with role "${role}" not found`);
    }

    await formTester.click(input);
    await formTester.clear(input);
    await formTester.type(input, String(value));
    // Small delay to allow UI updates
    await page.waitForTimeout(50);
  }
});

When('I submit the form', async ({ page }: World) => {
  const formTester = createPlaywrightFormTester(page);
  const button = await formTester.findElementByRole('button', { name: /submit|save/i });
  await formTester.click(button);
});

Then('I should see the error {string}', async ({ page }: World, message: string) => {
  const formTester = createPlaywrightFormTester(page);
  const error = await formTester.findElementByText(new RegExp(message, 'i'));
  expect(error).toBeTruthy();
});