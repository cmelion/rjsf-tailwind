// tests/utils/form-testing/types.ts
import { ElementAdapter } from '../adapters/element-adapter';
import { AriaRole } from '../types';
import { BaseComponentTester } from '../component-testing/base-component-tester';

export interface FormElement {
  // Base element type
}

export interface InputElement extends FormElement {
  // Input-specific properties
}

export interface ButtonElement extends FormElement {
  // Button-specific properties
}

export interface FormTester extends BaseComponentTester {
  adapter: ElementAdapter;

  // Form-specific methods
  findFormByLabel(label: string | RegExp): Promise<FormElement | null>;
  findFieldByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<InputElement | null>;
  findButtonByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<ButtonElement | null>;
  clear(element: InputElement): Promise<void>;
  type(element: InputElement, value: string): Promise<void>;
  getAttribute(element: FormElement, attributeName: string): Promise<string | null>;
  waitForElementByRole(role: string, options: { name?: string | RegExp, timeout?: number }, container?: FormElement): Promise<FormElement | null>;
}