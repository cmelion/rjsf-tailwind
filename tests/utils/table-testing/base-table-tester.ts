// tests/utils/table-testing/base-table-tester.ts
import { ElementAdapter } from "../adapters/element-adapter"
import { AbstractComponentTester } from "../component-testing/base-component-tester"
import { AriaRole } from "../types"
import {
  TableCellElement,
  TableElement,
  TableHeaderElement,
  TableRoles,
  TableRowElement,
  TableTester,
} from "./types"

export class BaseTableTester
  extends AbstractComponentTester
  implements TableTester
{
  constructor(adapter: ElementAdapter) {
    super(adapter)
  }

  // Table-specific methods only - common methods inherited from AbstractComponentTester
  async getTableByRole(role: AriaRole, name: string): Promise<TableElement> {
    return this.adapter.findByRole(undefined, role, { name })
  }

  async getAllRows(table: TableElement): Promise<TableRowElement[]> {
    return this.adapter.findAllByRole(table, TableRoles.ROW)
  }

  async getAllColumnHeaders(
    table: TableElement,
  ): Promise<TableHeaderElement[]> {
    const headerRow = (await this.getAllRows(table))[0]
    return this.adapter.findAllByRole(headerRow, TableRoles.COLUMNHEADER)
  }

  async getCellsInRow(row: TableRowElement): Promise<TableCellElement[]> {
    return this.adapter.findAllByRole(row, TableRoles.CELL)
  }

  async getCellContent(cell: TableCellElement): Promise<string> {
    return this.adapter.getTextContent(cell)
  }

  async getColumnMap(
    headerCells: TableHeaderElement[],
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>()
    for (let i = 0; i < headerCells.length; i++) {
      const content = await this.getCellContent(headerCells[i])
      map.set(content.trim(), i)
    }
    return map
  }

  async getRowByIndex(
    table: TableElement,
    index: number,
  ): Promise<TableRowElement> {
    const rows = await this.getAllRows(table)
    if (index < 0 || index >= rows.length) {
      throw new Error(`Row index ${index} is out of bounds.`)
    }
    return rows[index]
  }

  async findActionButtonInRow(
    row: TableRowElement,
    buttonName: string,
  ): Promise<any> {
    return this.adapter.findByRole(row, "button", { name: buttonName })
  }


  async findColumnHeaderByAriaLabel(
    table: TableElement,
    ariaLabelContains: string,
  ): Promise<TableHeaderElement> {
    const headers = await this.getAllColumnHeaders(table)
    for (const header of headers) {
      const button = await this.adapter.findByRole(header, "button")
      const ariaLabel = await this.adapter.getAttribute(button, "aria-label")
      if (ariaLabel && ariaLabel.includes(ariaLabelContains)) {
        return header
      }
    }
    throw new Error(
      `Column header with aria-label containing "${ariaLabelContains}" not found.`,
    )
  }

}
