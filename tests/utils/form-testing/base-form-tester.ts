// tests/utils/form-testing/base-form-tester.ts
import { ElementAdapter } from '../adapters/element-adapter.ts';
import { AriaRole } from '../types';
import { FormTester, FormElement, InputElement, ButtonElement } from './types';

export class BaseFormTester implements FormTester {
  constructor(public adapter: ElementAdapter) {}

  async findFormByLabel(label: string | RegExp): Promise<FormElement | null> {
    // Forms often don't have direct labels, might need role 'form' or 'dialog' with aria-label/labelledby
    // This is a placeholder; specific implementations might need refinement
    return await this.adapter.findByRole(undefined, 'form', { name: label }) ||
      this.adapter.findByRole(undefined, 'dialog', { name: label });
  }

  async findFieldByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<InputElement | null> {
    return this.adapter.findByRole(container, role, options);
  }

  async findButtonByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<ButtonElement | null> {
    return this.adapter.findByRole(container, role, options);
  }

  async click(element: FormElement): Promise<void> {
    await this.adapter.click(element);
  }

  async clear(element: InputElement): Promise<void> {
    await this.adapter.clear(element);
  }

  async type(element: InputElement, value: string): Promise<void> {
    await this.adapter.type(element, value);
  }

  async getTextContent(element: FormElement): Promise<string> {
    return this.adapter.getTextContent(element);
  }

  async getAttribute(element: FormElement, attributeName: string): Promise<string | null> {
    return this.adapter.getAttribute(element, attributeName);
  }

  async findElementByRole(role: string, options: { name: string | RegExp }, container?: FormElement): Promise<FormElement | null> {
    return this.adapter.findByRole(container, role, options);
  }

  async waitForElementByRole(role: string, options: { name?: string | RegExp, timeout?: number } = {}, container?: FormElement): Promise<FormElement | null> {
    const { name, timeout = 5000 } = options;

    // Implementation using existing adapter methods instead of the missing waitForElement
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      try {
        // Try to find the element using the existing findByRole method
        const element = await this.adapter.findByRole(container, role, { name });
        if (element) {
          return element;
        }
      } catch (error) {
        // Element not found yet, continue waiting
      }

      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Timeout reached, return null
    return null;
  }
}
