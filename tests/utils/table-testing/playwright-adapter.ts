// tests/utils/table-testing/playwright-adapter.ts
import { Page } from '@playwright/test';
import { AriaRole } from "../types";
import { TableElement, TableHeaderElement, TableRowElement, TableCellElement, TableTester, TableRoles } from './types';

export class PlaywrightTableTester implements TableTester {
  constructor(private page: Page) {}

  async getTableByRole(role: AriaRole, name: string): Promise<TableElement> {
    // No type assertion needed, AriaRole is already compatible
    // @ts-expect-error Need a better way to handle type difference between Playwright and RTL
    return this.page.getByRole(role, { name });
  }

  async getAllRows(table: TableElement): Promise<TableRowElement[]> {
    return table.getByRole(TableRoles.ROW).all();
  }

  async getAllColumnHeaders(table: TableElement): Promise<TableHeaderElement[]> {
    const headerRow = (await this.getAllRows(table))[0];
    return headerRow.getByRole(TableRoles.COLUMNHEADER).all();
  }

  async getCellsInRow(row: TableRowElement): Promise<TableCellElement[]> {
    return row.getByRole(TableRoles.CELL).all();
  }

  async getCellContent(cell: TableCellElement): Promise<string> {
    return (await cell.textContent()) || '';
  }

  async hasElement(cell: TableCellElement, selector: string): Promise<boolean> {
    return (await cell.locator(selector).count()) > 0;
  }

  async getColumnMap(headerCells: TableHeaderElement[]): Promise<Map<string, number>> {
    const map = new Map<string, number>();
    for (let i = 0; i < headerCells.length; i++) {
      const content = await this.getCellContent(headerCells[i]);
      map.set(content.trim(), i);
    }
    return map;
  }
}