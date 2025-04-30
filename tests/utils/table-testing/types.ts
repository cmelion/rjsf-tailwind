// tests/utils/table-testing/types.ts
import { AriaRole  } from "../types";

// Import the common types from our project
export type TableElement = any;
export type TableRowElement = any;
export type TableHeaderElement = any;
export type TableCellElement = any;

// Schema type definition
export interface Schema {
  properties: Record<string, {
    title?: string;
    type?: string;
  }>;
}

// Constants using the unified type
export const TableRoles = {
  GRID: 'grid' as AriaRole,
  TABLE: 'table' as AriaRole,
  ROW: 'row' as AriaRole,
  CELL: 'cell' as AriaRole,
  COLUMNHEADER: 'columnheader' as AriaRole,
} as const;

// Type for role strings accepted by both Playwright and RTL
// export type TableRole = typeof TableRoles[keyof typeof TableRoles];

export interface TableTester {
  getAttribute(element: any, attributeName: string): Promise<string | null>;
  getAllColumnHeaders(table: TableElement): Promise<TableHeaderElement[]>;
  getAllRows(table: TableElement): Promise<TableRowElement[]>;
  getCellContent(cell: TableCellElement): Promise<string>;
  getCellsInRow(row: TableRowElement): Promise<TableCellElement[]>;
  getColumnMap(headerCells: TableHeaderElement[]): Promise<Map<string, number>>;
  getTableByRole(role: AriaRole, name: string): Promise<TableElement>;
  hasElement(cell: TableCellElement, selector: string): Promise<boolean>;

  // Methods needed for click operations
  getRowByIndex(table: TableElement, index: number): Promise<TableRowElement>;
  findActionButtonInRow(row: TableRowElement, buttonName: string): Promise<any>;
  findElementByRole(role: string, options: any): Promise<any>;
  findElementByAttribute(role: string, attr: string, value: any): Promise<any>;
  findColumnHeaderByAriaLabel(table: TableElement, name: string): Promise<TableHeaderElement>;
  click(element: any): Promise<void>;
  getTextContent(element: any): Promise<string>;

  // Methods needed for text inputs
  clear(element: any): Promise<void>;
  type(element: any, value: string): Promise<void>;
}