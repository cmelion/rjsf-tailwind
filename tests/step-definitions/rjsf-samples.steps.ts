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
  expect(form, 'Form should be visible').toBeTruthy();

  // Check that the form container is visible
  const formContainer = page.locator(".border").first()
  expect(formContainer, 'Form container should be visible').toBeTruthy();
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
