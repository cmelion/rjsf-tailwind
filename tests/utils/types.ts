// Import the roles object from aria-query
import type {
  ARIACompositeWidgetRole,
  ARIADocumentStructureRole,
  ARIAWidgetRole
} from 'aria-query';

// Create a union of all valid ARIA roles by directly using the predefined types
export type AriaRole =
  | ARIACompositeWidgetRole | ARIADocumentStructureRole | ARIAWidgetRole;