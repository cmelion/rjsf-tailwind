// tests/utils/table-testing/rtl-element-adapter.ts
import { ElementAdapter } from "./element-adapter.ts"
import { act, fireEvent, screen, within } from "@testing-library/react"

export class RTLElementAdapter implements ElementAdapter {
  async findByRole(container: any, role: string, options: any = {}) {
    const withinContainer = container === undefined ? screen : within(container)
    // Special handling ONLY for password fields with textbox role
    if (role === "textbox" && options.name) {
      const namePattern =
        options.name instanceof RegExp
          ? options.name
          : new RegExp(String(options.name))

      // Only intercept if name explicitly contains "password"
      if (namePattern.source.toLowerCase().includes("password")) {
        try {
          // First try to find by label text
          return withinContainer.getByLabelText(namePattern)
        } catch (e) {
          throw new Error(
            `No element found with role "${role}" and name matching "${options.name}"`,
          )
        }
        // Fall through to default behavior
      }
    }

    // Default behavior for all other cases
    return withinContainer.getByRole(role, options)
  }

  async findAllByRole(container: any, role: string, options: any = {}) {
    const withinContainer = container === undefined ? screen : within(container)
    return withinContainer.getAllByRole(role, options)
  }

  async getTextContent(element: any) {
    return element.textContent || ""
  }

  async hasElement(element: any, selector: string) {
    return !!element.querySelector(selector)
  }

  async getAttribute(element: any, attr: string) {
    return element.getAttribute(attr)
  }

  async click(element: any) {
    // When clicking the column header, we need to:
    // 1. Check if this is a column header with a button inside
    if (element.getAttribute("role") === "columnheader") {
      // Find the inner div with role="button" that has the actual click handler
      const buttonInside = element.querySelector('[role="button"]')
      if (buttonInside) {
        // Click the button element instead
        act(() => {
          fireEvent.click(buttonInside)
        })
        return
      }
    }

    // For all other elements, use standard fireEvent wrapped in act()
    act(() => {
      fireEvent.click(element)
    })

    // For RTL, we need to flush promises to ensure state updates complete
    await new Promise((resolve) => setTimeout(resolve, 0))
  }

  async findByAttribute(role: string, attr: string, value: any) {
    const elements = await screen.findAllByRole(role)
    for (const element of elements) {
      if (
        value instanceof RegExp
          ? value.test(element.getAttribute(attr) || "")
          : element.getAttribute(attr) === value
      ) {
        return element
      }
    }
    throw new Error(
      `No element with role "${role}" and attribute "${attr}" matching "${value}" found.`,
    )
  }

  async findFormByLabel() {
    // Fallback: select the form with class "rjsf"
    const form = document.querySelector("form.rjsf")
    return form || null
  }

  async clear(element: any) {
    fireEvent.change(element, { target: { value: "" } })
  }

  async type(element: any, value: string) {
    fireEvent.change(element, { target: { value } })
  }

  async findByText(container: any, text: string | RegExp) {
    const withinContainer = container === undefined ? screen : within(container)
    const elements = withinContainer.getAllByText(text)
    if (elements.length === 0) {
      throw new Error(`No element found with text: ${text}`)
    }
    return elements[0] // Return the first matching element
  }
}
