// src/types/store.ts
import { RJSFSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface AppState {
  availableSamples: string[];
  error: string | null;
  fetchSample: (sampleName: string) => Promise<void>;
  fetchSamples: () => Promise<void>;
  formData: object;
  formKey: string;
  label: string;
  loading: boolean;
  resetState: () => void;
  schema: JSONSchema7 | RJSFSchema;
  setLabel: (label: string) => void;
  transformErrors?: (errors: any[]) => any[];
  uiSchema: object;
  updateFormData: (formData: object) => void;
  updateSchema: (schema: JSONSchema7 | RJSFSchema) => void;
  updateUiSchema: (uiSchema: object) => void;
  validateRules?: any[];
  updateValidateRules: (rules: any[]) => void;
  customValidate?: (formData: any, errors: any) => any;
}

export interface EqualCondition {
  equal: string;
}

export interface GreaterThanEqualCondition {
  greaterThanEqual: number;
}

export type RuleCondition = EqualCondition | GreaterThanEqualCondition;

export interface RuleEvent {
  type: string;
  params: {
    message: string;
    field: string;
  };
}

export interface ValidationRule {
  conditions: {
    [fieldName: string]: RuleCondition;
  };
  event: RuleEvent;
}