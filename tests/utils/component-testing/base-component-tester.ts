// tests/utils/component-testing/base-component-tester.ts
import { ElementAdapter } from "../adapters/element-adapter"
import { PlaywrightElementAdapter } from "../adapters/playwright-element-adapter"
import { RTLElementAdapter } from "../adapters/rtl-element-adapter"
import { TestRunnerType } from "../types"
import { TableCellElement } from "@tests/utils/table-testing/types.ts"

export interface BaseComponentTester {
  clear(element: any): Promise<void>
  click(element: any): Promise<void>
  findElementByAttribute(role: string, attr: string, value: any): Promise<any>
  findElementByRole(
    role: string,
    options: { name: string | RegExp },
    container?: any
  ): Promise<any>
  getAttribute(element: any, attributeName: string): Promise<string | null>
  getRunnerType(): TestRunnerType
  getTextContent(element: any): Promise<string>
  hasElement(cell: TableCellElement, selector: string): Promise<boolean>
  type(element: any, value: string): Promise<void>
}

export abstract class AbstractComponentTester implements BaseComponentTester {
  public adapter: ElementAdapter  // Change from protected to public
  protected runnerType: TestRunnerType

  constructor(adapter: ElementAdapter) {
    this.adapter = adapter

    // Determine runner type based on adapter instance
    if (adapter instanceof RTLElementAdapter) {
      this.runnerType = "rtl"
    } else if (adapter instanceof PlaywrightElementAdapter) {
      this.runnerType = "playwright"
    } else {
      throw new Error("Unknown adapter type")
    }
  }

  async clear(element: any): Promise<void> {
    await this.adapter.clear(element)
  }

  async click(element: any): Promise<void> {
    await this.adapter.click(element)
  }

  async findElementByAttribute(
    role: string,
    attr: string,
    value: any,
  ): Promise<any> {
    return this.adapter.findByAttribute(role, attr, value)
  }

  async findElementByRole(
    role: string,
    options: { name: string | RegExp },
    container?: any,
  ): Promise<any> {
    return this.adapter.findByRole(container, role, options)
  }

  async getAttribute(
    element: any,
    attributeName: string,
  ): Promise<string | null> {
    return this.adapter.getAttribute(element, attributeName)
  }

  getRunnerType(): TestRunnerType {
    return this.runnerType
  }

  async getTextContent(element: any): Promise<string> {
    return this.adapter.getTextContent(element)
  }

  async hasElement(cell: TableCellElement, selector: string): Promise<boolean> {
    return this.adapter.hasElement(cell, selector)
  }

  async type(element: any, value: string): Promise<void> {
    await this.adapter.type(element, value)
  }
}
