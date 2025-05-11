// src/components/tests/step-definitions/rjsf-samples.steps.tsx
import { TestWorld } from "./shared.steps.tsx"
import { act } from "@testing-library/react"
import { Then, When } from "quickpickle"
import { expect } from "vitest"

When(
  "I click on the sample button for {string}",
  async ({ formTester }: TestWorld, sampleName: string) => {
    if (!formTester) {
      throw new Error("form tester not initialized")
    }

    await act(async () => {
      const button = await formTester.findElementByRole("button", {
        name: new RegExp(`^${sampleName}$`),
      })
      if (!button) {
        throw new Error(`Button for sample "${sampleName}" not found`)
      }
      await formTester.click(button)
      //  wait for any async effects to finish
      await new Promise((resolve) => setTimeout(resolve, 0))
    })

    // Ensure any promises from state updates are flushed.
    await new Promise((resolve) => setTimeout(resolve, 50))
  },
)

When(
  "I fill {string} with {string}",
  async ({ formTester }: TestWorld, field: string, value: string) => {
    if (!formTester) {
      throw new Error("form tester not initialized")
    }

    const input = await formTester.findElementByRole("textbox", {
      name: new RegExp(`.*${field}.*`, "i"),
    })
    await formTester.clear(input)
    await formTester.type(input, value)
  },
)

When("I submit the form", async ({ formTester }: TestWorld) => {
  if (!formTester) {
    throw new Error("form tester not initialized")
  }

  const button = await formTester.findElementByRole("button", {
    name: /submit|save/i,
  })
  await formTester.click(button)
})

Then(
  "I should see a form rendered correctly",
  async ({ formTester }: TestWorld) => {
    if (!formTester) {
      throw new Error("form tester not initialized")
    }

    // Check that a form exists using the form tester
    const form = await formTester.findFormByLabel(/form/i)
    expect(form, "form should be visible").toBeTruthy()
  },
)

Then(
  "the form title should match {string}",
  async ({ formTester }: TestWorld, expectedTitle: string) => {
    if (!formTester) {
      throw new Error("form tester not initialized");
    }

    // Skip empty titles
    if (expectedTitle === "") {
      return;
    }

    // Find form element
    const form = await formTester.findFormByLabel(/form/i);
    if (!form) {
      throw new Error(`Form not found. Expected title: "${expectedTitle}"`);
    }

    // Find the heading within the form
    const titleElement = await formTester.findElementByRole(
      "heading",
      { name: expectedTitle },
      form
    );

    if (!titleElement) {
      throw new Error(`Form title element not found. Expected: "${expectedTitle}"`);
    }

    const formTitle = await formTester.getTextContent(titleElement);
    const trimmedTitle = formTitle?.trim() || "";

    if (trimmedTitle === "") {
      throw new Error(`Form title element exists but has no content. Expected: "${expectedTitle}"`);
    }

    expect(
      trimmedTitle,
      `Form title should match "${expectedTitle}"`
    ).toContain(expectedTitle);
  }
);

Then(
  "I should see the error {string}",
  async ({ formTester }: TestWorld, message: string) => {
    if (!formTester) {
      throw new Error("form tester not initialized")
    }

    const error = await formTester.findElementByText(new RegExp(message, "i"))
    expect(error).toBeTruthy()
  },
)

When(
  "I fill out the form with:",
  async ({ formTester }: TestWorld, dataTable: { rawTable: string[][] }) => {
    if (!formTester) {
      throw new Error("form tester not initialized");
    }

    const rows = dataTable.rawTable.slice(1); // Skip the header row
    for (const [field, value, role] of rows) {
      const input = await formTester.findElementByRole(role, {
        name: new RegExp(`^${field}$`, 'i'), // Match the field name exactly
      });
      if (!input) {
        throw new Error(`Field "${field}" with role "${role}" not found`);
      }
      await formTester.clear(input);
      await formTester.type(input, value);
    }
  }
);