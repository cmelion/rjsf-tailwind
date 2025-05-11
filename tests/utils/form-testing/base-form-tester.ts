// tests/utils/form-testing/base-form-tester.ts
import { ElementAdapter } from "../adapters/element-adapter"
import { AriaRole } from "../types"
import { FormTester, FormElement, InputElement, ButtonElement } from "./types"
import { AbstractComponentTester } from "../component-testing/base-component-tester"

export class BaseFormTester
  extends AbstractComponentTester
  implements FormTester
{
  constructor(adapter: ElementAdapter) {
    super(adapter)
  }

  async findFormByLabel(label: string | RegExp): Promise<FormElement | null> {
    return this.adapter.findFormByLabel(label);
  }
  async findFieldByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<InputElement | null> {
    return this.adapter.findByRole(container, role, options)
  }

  async findButtonByRole(role: AriaRole, options: { name: string | RegExp }, container?: FormElement): Promise<ButtonElement | null> {
    return this.adapter.findByRole(container, role, options)
  }

  async findElementByRole(role: string, options: { name: string | RegExp }, container?: FormElement): Promise<FormElement | null> {
    return this.adapter.findByRole(container, role, options)
  }

  async waitForElementByRole(role: string, options: { name?: string | RegExp, timeout?: number } = {}, container?: FormElement): Promise<FormElement | null> {
    const { name, timeout = 5000 } = options
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      try {
        const element = await this.adapter.findByRole(container, role, { name })
        if (element) {
          return element
        }
      } catch (error) {
        // Element not found yet, continue waiting
      }

      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return null
  }

  async findElementByText(text: string | RegExp, container?: FormElement): Promise<FormElement | null> {
    return this.adapter.findByText(container, text);
  }
}