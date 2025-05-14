// src/components/rjsf/validations/jsonRuleValidator.ts
export interface JsonRule {
  conditions: {
    [key: string]: {
      [predicate: string]: string | number | boolean | Array<any>;
    };
  };
  event: {
    type: string;
    params: {
      message: string;
      field: string;
    };
  };
}

/**
 * // Example rules
 * const rules = [
 *   // Password matching
 *   {
 *     conditions: {
 *       pass2: { equal: "pass1" }
 *     },
 *     event: {
 *       type: "passwordMatch",
 *       params: {
 *         message: "Passwords don't match.",
 *         field: "pass2"
 *       }
 *     }
 *   },
 *   // Age verification
 *   {
 *     conditions: {
 *       age: { greaterThanEqual: 18 }
 *     },
 *     event: {
 *       type: "ageCheck",
 *       params: {
 *         message: "You must be at least 18 years old.",
 *         field: "age"
 *       }
 *     }
 *   }
 * ];
 */

export function createJsonRuleValidator(rules: JsonRule | JsonRule[]) {
  const ruleArray = Array.isArray(rules) ? rules : [rules];

  return function validate(formData: any, errors: any) {
    for (const rule of ruleArray) {
      const { conditions, event } = rule;

      try {
        // Check if all conditions are satisfied
        let isValid = true;

        // Process each condition field
        Object.entries(conditions).forEach(([field, condition]) => {
          if (condition && typeof condition === 'object') {
            const fieldValue = formData[field];

            // Handle different condition types
            Object.entries(condition).forEach(([predicate, compareValue]) => {
              switch (predicate) {
                // Equality checks
                case 'equal': {
                  const typedValue = compareValue as string | number | boolean;
                  if (typeof typedValue === 'string' && typedValue in formData) {
                    if (fieldValue !== formData[typedValue]) isValid = false;
                  } else if (fieldValue !== typedValue) {
                    isValid = false;
                  }
                  break;
                }
                case 'notEqual': {
                  const typedValue = compareValue as string | number | boolean;
                  if (typeof typedValue === 'string' && typedValue in formData) {
                    if (fieldValue === formData[typedValue]) isValid = false;
                  } else if (fieldValue === typedValue) {
                    isValid = false;
                  }
                  break;
                }

                // Numeric comparisons
                case 'greaterThan':
                case 'gt': {
                  const typedValue = compareValue as string | number;
                  if (typeof typedValue === 'string' && typedValue in formData) {
                    if (!(fieldValue > formData[typedValue])) isValid = false;
                  } else if (!(fieldValue > typedValue)) {
                    isValid = false;
                  }
                  break;
                }
                case 'lessThan':
                case 'lt': {
                  const typedValue = compareValue as string | number;
                  if (typeof typedValue === 'string' && typedValue in formData) {
                    if (!(fieldValue < formData[typedValue])) isValid = false;
                  } else if (!(fieldValue < typedValue)) {
                    isValid = false;
                  }
                  break;
                }
                case 'greaterThanEqual':
                case 'gte': {
                  const typedValue = compareValue as string | number;
                  if (typeof typedValue === 'string' && typedValue in formData) {
                    if (!(fieldValue >= formData[typedValue])) isValid = false;
                  } else if (!(fieldValue >= typedValue)) {
                    isValid = false;
                  }
                  break;
                }
                case 'lessThanEqual':
                case 'lte': {
                  const typedValue = compareValue as string | number;
                  if (typeof typedValue === 'string' && typedValue in formData) {
                    if (!(fieldValue <= formData[typedValue])) isValid = false;
                  } else if (!(fieldValue <= typedValue)) {
                    isValid = false;
                  }
                  break;
                }

                // List operations
                case 'in': {
                  const typedValue = compareValue as Array<any>;
                  if (!Array.isArray(typedValue) || !typedValue.includes(fieldValue)) {
                    isValid = false;
                  }
                  break;
                }
                case 'notIn': {
                  const typedValue = compareValue as Array<any>;
                  if (!Array.isArray(typedValue) || typedValue.includes(fieldValue)) {
                    isValid = false;
                  }
                  break;
                }

                // String operations
                case 'startsWith': {
                  const typedValue = String(compareValue);
                  if (typeof fieldValue !== 'string' || !fieldValue.startsWith(typedValue)) {
                    isValid = false;
                  }
                  break;
                }
                case 'endsWith': {
                  const typedValue = String(compareValue);
                  if (typeof fieldValue !== 'string' || !fieldValue.endsWith(typedValue)) {
                    isValid = false;
                  }
                  break;
                }
                case 'contains': {
                  const typedValue = String(compareValue);
                  if (typeof fieldValue !== 'string' || !fieldValue.includes(typedValue)) {
                    isValid = false;
                  }
                  break;
                }
                case 'pattern':
                case 'matches': {
                  const typedValue = String(compareValue);
                  if (typeof fieldValue === 'string') {
                    const regex = new RegExp(typedValue);
                    if (!regex.test(fieldValue)) isValid = false;
                  } else {
                    isValid = false;
                  }
                  break;
                }

                // Type validations
                case 'isEmpty': {
                  const empty = fieldValue === undefined || fieldValue === null || fieldValue === '';
                  if (compareValue !== empty) isValid = false;
                  break;
                }
                case 'hasLength': {
                  const typedValue = compareValue as number;
                  if (!fieldValue || fieldValue.length !== typedValue) isValid = false;
                  break;
                }
              }
            });
          }
        });

        // If validation failed, add the error message
        if (!isValid) {
          const { field, message } = event.params;
          if (errors[field]) {
            errors[field].addError(message);
          }
        }
      } catch (error: unknown) {
        console.error('Rule validation error:', error);
      }
    }

    return errors;
  };
}