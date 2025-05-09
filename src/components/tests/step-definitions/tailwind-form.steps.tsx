// src/components/tests/step-definitions/tailwind-form.steps.tsx
import { act } from "@testing-library/react";
import { createRTLFormTester } from "@tests/utils/form-testing/factory";
import { FormTester } from "@tests/utils/form-testing/types";
import { When } from "quickpickle";

// Create type for form test world
type FormTestWorld = {
  formTester?: FormTester;
};

// Define the test data that will be used in the form
const newFormData = {
  name: "New Test Record Name",
  age: "33",
  email: "new@tester.com"
};

When('I fill out the form and submit', async (world: FormTestWorld) => {
  let formTester = world.formTester;

  // Initialize form tester if not already done
  if (!formTester) {
    formTester = createRTLFormTester();
    world.formTester = formTester;
  }

  await act(async () => {
    // Define fields to fill with a small delay between operations
    const fieldsToFill = [
      {
        roleType: "textbox",
        nameMatcher: /name/i,
        value: newFormData.name
      },
      {
        roleType: "spinbutton",
        nameMatcher: /age/i,
        value: String(newFormData.age)
      },
      {
        roleType: "textbox",
        nameMatcher: /email/i,
        value: newFormData.email
      }
    ];

    // Fill each field with a small delay between operations
    for (const field of fieldsToFill) {
      const input = await formTester.findElementByRole(field.roleType, {
        name: field.nameMatcher
      });

      if (!input) {
        throw new Error(`Form field matching ${field.nameMatcher} not found`);
      }

      // Clear and fill one field at a time
      await formTester.click(input);
      await formTester.clear(input);
      await formTester.type(input, String(field.value));

      // Small delay to allow React to process the update
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // Find and click the submit button
    const submitButton = await formTester.findElementByRole("button", {
      name: /submit|save|create/i
    });

    if (!submitButton) {
      throw new Error("Submit button not found");
    }

    await formTester.click(submitButton);
  });
});