// tests/utils/table-testing/playwright-element-adapter.ts
import { ElementAdapter } from './element-adapter';
import { Page } from '@playwright/test';

export class PlaywrightElementAdapter implements ElementAdapter {
  constructor(private page: Page) {}

  async findByRole(container: any, role: string, options: any = {}) {
    const target = container || this.page;
    return target.getByRole(role, options).first();
  }

  async findAllByRole(container: any, role: string, options: any = {}) {
    const target = container || this.page;
    return target.getByRole(role, options).all();
  }

  async getTextContent(element: any) {
    return (await element.textContent()) || '';
  }

  async hasElement(element: any, selector: string) {
    return (await element.locator(selector).count()) > 0;
  }

  async getAttribute(element: any, attr: string) {
    // For input values, use inputValue() which is more reliable for form controls
    if (attr === 'value') {
      try {
        // Check if this is an input, textarea, or select element
        const tagName = await element.evaluate((el: { tagName: string }) =>
          el.tagName?.toLowerCase(),
        )
        if (['input', 'textarea', 'select'].includes(tagName)) {
          return element.inputValue();
        }
      } catch (e) {
        // Fall back to getAttribute if the above fails
      }
    } else if (attr === 'checked') {
      // For checkboxes, isChecked() is more reliable
      try {
        return await element.isChecked() ? 'true' : null;
      } catch (e) {
        // Fall back to getAttribute
      }
    } else if (attr === 'selectedIndex') {
      // Handle select elements specially
      try {
        return await element.evaluate(
          (el: { selectedIndex: { toString: () => any } }) =>
            el.selectedIndex.toString(),
        )
      } catch (e) {
        // Fall back to getAttribute
      }
    }

    // Default fallback to standard getAttribute
    return element.getAttribute(attr);
  }

  async click(element: any) {
    await element.click();
  }

  async findByAttribute(role: any, attr: string, value: any) {
    const elements = await this.page.getByRole(role).all();
    for (const element of elements) {
      const attrValue = await element.getAttribute(attr);
      if (value instanceof RegExp ? value.test(attrValue || '') : attrValue === value) {
        return element;
      }
    }
    throw new Error(`No element with role "${role}" and attribute "${attr}" matching "${value}" found.`);
  }

  async clear(element: any) {
    await element.fill('');
  }

  async type(element: any, value: string) {
    await element.fill(value);
  }
}