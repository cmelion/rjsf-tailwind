// tests/utils/table-testing/element-adapter.ts
export interface ElementAdapter {
  clear(element: any): Promise<void>;
  click(element: any): Promise<void>;
  findAllByRole(container: any, role: string, options?: any): Promise<any[]>;
  findByAttribute(role: string, attr: string, value: any): Promise<any>;
  findByRole(container: any, role: string, options?: any): Promise<any>;
  findByText(container: any, text: string | RegExp): Promise<any>;
  findFormByLabel(label: string | RegExp): Promise<any | null>;
  getAttribute(element: any, attr: string): Promise<string | null>;
  getTextContent(element: any): Promise<string>;
  hasElement(element: any, selector: string): Promise<boolean>;
  type(element: any, value: string): Promise<void>;
}