// tests/utils/form-testing/types.ts
import { ElementAdapter } from '../adapters/element-adapter.ts'; // Reuse adapter
import { AriaRole } from '../types';

// Basic element type, can be refined based on adapter needs
export interface FormElement {
  // Existing properties
}

export interface InputElement extends FormElement {
  // Existing properties
}

export interface ButtonElement extends FormElement {
  // Existing properties
}

export interface FormTester {
  adapter: ElementAdapter; // Expose adapter if needed for direct access

  // Find form elements
  findFormByLabel(label: string | RegExp): Promise<FormElement | null>;
  findFieldByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<InputElement | null>;
  findButtonByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<ButtonElement | null>;

  // Interact with form elements
  click(element: FormElement): Promise<void>;
  clear(element: InputElement): Promise<void>;
  type(element: InputElement, value: string): Promise<void>;
  getTextContent(element: FormElement): Promise<string>;
  getAttribute(element: FormElement, attributeName: string): Promise<string | null>;

  // Additional utility methods
  findElementByRole(role: string, options: { name: string | RegExp }, container?: FormElement): Promise<FormElement | null>;
  waitForElementByRole(role: string, options: { name?: string | RegExp, timeout?: number }, container?: FormElement): Promise<FormElement | null>;
}