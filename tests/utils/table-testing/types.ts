// tests/utils/table-testing/types.ts
import { AriaRole } from "../types";

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

// Define constants for commonly used aria roles to ensure consistency
export const TableRoles = {
  GRID: 'grid' as AriaRole,
  TABLE: 'table' as AriaRole,
  ROW: 'row' as AriaRole,
  CELL: 'cell' as AriaRole,
  COLUMNHEADER: 'columnheader' as AriaRole,
} as const;

// Type for role strings accepted by both Playwright and RTL
export type TableRole = typeof TableRoles[keyof typeof TableRoles];

export interface TableTester {
  getTableByRole(role: AriaRole, name: string): Promise<TableElement>;
  getAllRows(table: TableElement): Promise<TableRowElement[]>;
  getAllColumnHeaders(table: TableElement): Promise<TableHeaderElement[]>;
  getCellsInRow(row: TableRowElement): Promise<TableCellElement[]>;
  getCellContent(cell: TableCellElement): Promise<string>;
  hasElement(cell: TableCellElement, selector: string): Promise<boolean>;
  getColumnMap(headerCells: TableHeaderElement[]): Promise<Map<string, number>>;
}