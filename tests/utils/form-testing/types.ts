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

  // form-specific methods
  clear(element: InputElement): Promise<void>;
  findButtonByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<ButtonElement | null>;
  findElementByText(text: string | RegExp, container?: any): Promise<any>;
  findFieldByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<InputElement | null>;
  findFormByLabel(label: string | RegExp): Promise<FormElement | null>;
  getAttribute(element: FormElement, attributeName: string): Promise<string | null>;
  type(element: InputElement, value: string): Promise<void>;
  waitForElementByRole(role: string, options: { name?: string | RegExp, timeout?: number }, container?: FormElement): Promise<FormElement | null>;
}