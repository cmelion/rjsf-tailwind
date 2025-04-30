import type { TableTester } from '../types';
/**
 * Verifies that an edit form for a row contains the expected fields and values
 */
export async function verifyEditForm({
                                       schema,
                                       formData,
                                       tableTester,
                                       formName = 'Edit form',
                                       row
                                     }: {
  schema: any;
  formData: any[];
  tableTester: TableTester;
  formName?: string;
  row?: number;
}): Promise<void> {
  // Validate inputs
  if (row === undefined) {
    throw new Error("Row parameter is required");
  }

  if (!schema?.properties) {
    throw new Error("Valid schema with properties is required");
  }

  // Convert from 1-based to 0-based index
  const rowIndex = row - 1;

  if (rowIndex < 0 || rowIndex >= formData.length) {
    throw new Error(`Row index ${row} is out of bounds (1-${formData.length})`);
  }

  const rowData = formData[rowIndex];
  const editForm = await tableTester.findElementByRole('form', { name: formName });
  if (!editForm) {
    throw new Error(`Edit form "${formName}" not found`);
  }

  // Verify form fields match schema properties
  for (const [key, prop] of Object.entries(schema.properties)) {
    const typedProp = prop as any;
    const fieldLabel = typedProp.title || key;
    const fieldType = typedProp.type || 'string';

    // Skip complex objects for now
    if (fieldType === 'object' || fieldType === 'array') continue;

    // Find the field in the form
    const input = await findFormField(tableTester, key, fieldLabel, fieldType, typedProp.enum);

    if (!input) {
      throw new Error(`Form input for "${fieldLabel}" not found`);
    }

    // If value exists in row data, verify it matches the form value
    const value = rowData[key];
    if (value !== undefined) {
      await verifyFormFieldValue(tableTester, input, value, key, fieldType, typedProp.enum);
    }
  }
}

/**
 * Verify form field value matches expected value
 */
async function verifyFormFieldValue(
  tester: TableTester,
  input: any,
  value: any,
  key: string,
  fieldType: string,
  enumOptions: any[]
): Promise<void> {
  if (fieldType === 'boolean') {
    // Boolean field validation
    const isChecked = await tester.getAttribute(input, 'checked');
    if ((isChecked !== null) !== Boolean(value)) {
      throw new Error(`Form boolean field "${key}" value doesn't match row data`);
    }
  } else if (enumOptions) {
    // Enum/select field validation
    const selectedIndex = await tester.getAttribute(input, 'selectedIndex') || input.selectedIndex;
    const selectValue = enumOptions[Number(selectedIndex) - 1];
    if (selectValue !== String(value)) {
      throw new Error(`Form field "${key}" value doesn't match row data(expected: 2, found: ${input.selecte})`);
    }
  } else {
    // Standard text/number fields
    const inputValue = await tester.getAttribute(input, 'value');
    if (inputValue !== String(value)) {
      console.log(`Input: ${input.outerHTML}`);
      throw new Error(`Form field "${key}" value doesn't match row data(expected: ${value}, found: ${inputValue})`);
    }
  }
}

/**
 * Helper function to find a form field using multiple strategies
 */
async function findFormField(
  tester: TableTester,
  key: string,
  label: string,
  fieldType: string,
  hasEnum: any[]
): Promise<any> {
  // Determine appropriate roles based on field type
  const fieldRoles = determineFieldRoles(fieldType, hasEnum);

  // Try different strategies to find the field
  let input;

  // Strategy 1: Try to find by role + label
  input = await tryFindElementByRoles(tester, fieldRoles, 'byRole', label);
  if (input) return input;

  // Strategy 2: Try to find by attribute name
  input = await tryFindElementByRoles(tester, fieldRoles, 'byName', key);
  if (input) return input;

  // Strategy 3: Try to find by ID that matches the key
  input = await tryFindElementByRoles(tester, fieldRoles, 'byId', key);
  return input;
}

/**
 * Determine appropriate roles based on field type
 */
function determineFieldRoles(fieldType: string, hasEnum: any[]): string[] {
  if (fieldType === 'integer' || fieldType === 'number') {
    return ['spinbutton', 'textbox'];
  } else if (fieldType === 'boolean') {
    return ['checkbox'];
  } else if (hasEnum) {
    return ['combobox', 'listbox', 'select', 'textbox'];
  } else {
    return ['textbox'];
  }
}

/**
 * Try to find an element using different roles
 */
async function tryFindElementByRoles(
  tester: TableTester,
  roles: string[],
  strategy: 'byRole' | 'byName' | 'byId',
  value: string
): Promise<any> {
  for (const role of roles) {
    try {
      if (strategy === 'byRole') {
        return await tester.findElementByRole(role, { name: new RegExp(`.*${value}.*`, 'i') });
      } else if (strategy === 'byName') {
        return await tester.findElementByAttribute(role, 'name', value);
      } else if (strategy === 'byId') {
        return await tester.findElementByAttribute(role, 'id', new RegExp(value, 'i'));
      }
    } catch (e) {
      // Continue to next role
    }
  }
  return null;
}
