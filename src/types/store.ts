// src/types/store.ts
import { RJSFSchema } from "@rjsf/utils"
import { JSONSchema7 } from "json-schema"

export interface AppState {
  schema: JSONSchema7 | RJSFSchema;
  uiSchema: object;
  formData: object;
  label: string;
  loading: boolean;
  error: null | string;
  availableSamples: string[];
  fetchSamples: () => Promise<void>;
  fetchSample: (sampleName: string) => Promise<void>;
  setLabel: (label: string) => void;
  updateSchema: (schema: JSONSchema7 | RJSFSchema) => void;
  updateUiSchema: (uiSchema: object) => void;
  updateFormData: (formData: object) => void;
}