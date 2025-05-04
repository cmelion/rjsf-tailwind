// tests/step-definitions/tailwind-form.steps.ts
import { createPlaywrightFormTester } from "../utils/form-testing/factory";
import { fillFormFields, submitForm, updateFormField } from "../utils/form-testing/form-operations";
// Remove verifyFormField import if no longer used elsewhere in this file, or keep if used in other steps not shown
import { verifyFormSubmission, verifyFormValidation } from "../utils/form-testing/verifiers";
import { newRecordData, updatedValuePrefix } from "../fixtures/form-data";
import { expect, Page } from "@playwright/test";
import { createBdd } from "playwright-bdd";

const { When, Then } = createBdd();

// Define types for step parameters and world
type World = {
  page: Page;
};

// Renamed to avoid conflict with table steps
Then("I should see a form for creating a new record with fields", async ({ page }: World) => {
  const formTester = createPlaywrightFormTester(page);

  // Find the dialog for creating a new record
  const formDialog = await formTester.findElementByRole("dialog", { name: /create new record/i });
  expect(formDialog, "Create record dialog not found").toBeTruthy();

  // Verify essential form fields exist by finding them directly
  const nameField = await formTester.findElementByRole("textbox", { name: /name/i });
  expect(nameField, "Name field not found").toBeTruthy();

  const ageField = await formTester.findElementByRole("spinbutton", { name: /age/i });
  expect(ageField, "Age field not found").toBeTruthy();

  const emailField = await formTester.findElementByRole("textbox", { name: /email/i });
  expect(emailField, "Email field not found").toBeTruthy();
});

// Renamed to avoid conflict with table steps
When("I complete and submit the form with test data", async ({ page }: World) => {
  const formTester = createPlaywrightFormTester(page);
  await fillFormFields(formTester, newRecordData);
  await submitForm(formTester);
});

// Renamed to avoid conflict with table steps
When("I modify the form field {string} with updated text", async ({ page }: World, fieldName: string) => {
  const formTester = createPlaywrightFormTester(page);
  // Assuming 'textbox' is the correct type here, adjust if needed
  await updateFormField(formTester, fieldName, updatedValuePrefix, 'textbox', page);
});

// Additional form-specific verification steps
Then("I should see form validation errors for required fields", async ({ page }: World) => {
  const formTester = createPlaywrightFormTester(page);

  await verifyFormValidation({
    formTester,
    fieldsToTest: [
      {
        fieldName: "name",
        invalidValue: "",
        expectedError: "Name is required"
      },
      {
        fieldName: "email",
        invalidValue: "not-an-email",
        expectedError: "Please enter a valid email"
      }
    ]
  });
});

Then("the form should be submitted successfully", async ({ page }: World) => {
  const formTester = createPlaywrightFormTester(page);

  await verifyFormSubmission({
    formTester,
    successIndicator: {
      role: "alert",
      text: /success|saved|created/i
    }
  });
});

When("I fill out the form and submit", async ({ page }: World) => {
  const formTester = createPlaywrightFormTester(page);

  // Use the utility functions to fill and submit the form
  await fillFormFields(formTester, newRecordData);
  await submitForm(formTester);
})