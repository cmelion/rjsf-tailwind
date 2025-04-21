// tests/utils/table-testing/rtl-adapter.ts
import { screen, within } from '@testing-library/react';
import { TableTester } from './types';

export class RTLTableTester implements TableTester {
  async getTableByRole(role: string, name: string) {
    return screen.getByRole(role, { name });
  }

  async getAllRows(table: any) {
    return within(table).getAllByRole('row', {});
  }

  async getAllColumnHeaders(table: any) {
    const headerRow = (await this.getAllRows(table))[0];
    return within(headerRow).getAllByRole('columnheader', {});
  }

  async getCellsInRow(row: any) {
    return within(row).getAllByRole('cell', {});
  }

  async getCellContent(cell: any) {
    return cell.textContent || '';
  }

  async hasElement(cell: any, selector: string) {
    return !!cell.querySelector(selector);
  }

  async getColumnMap(headerCells: any[]) {
    const map = new Map();
    for (let i = 0; i < headerCells.length; i++) {
      const cell = headerCells[i];
      const content = await this.getCellContent(cell);
      map.set(content.trim(), i);
    }
    return map;
  }
}