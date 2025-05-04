// tests/utils/table-testing/verifiers/verifyColumnHeaders.ts
import { TableTester, Schema } from '../types';

/**
 * Verifies column headers match the schema properties
 * @param tester - Table testing utility
 * @param schema - JSON schema defining table structure
 * @param table - Table element to verify
 */
export async function verifyColumnHeaders(
  tester: TableTester,
  schema: Schema,
  table: any
) {
  if (!schema?.properties) {
    throw new Error('Schema not found in the test context');
  }

  const expectedProperties = Object.keys(schema.properties);
  const headers = await tester.getAllColumnHeaders(table);

  // Extract all header text contents at once
  const headerTexts = await Promise.all(
    headers.map(header => tester.getCellContent(header).then(text => text.trim()))
  );

  // Verify each schema property has a corresponding header
  for (const propName of expectedProperties) {
    const title = schema.properties[propName].title || propName;
    const hasHeader = headerTexts.some(text =>
      text.includes(title) || text.includes(propName)
    );

    if (!hasHeader) {
      throw new Error(`Header for property "${propName}" not found`);
    }
  }
}