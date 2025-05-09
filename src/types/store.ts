// src/types/store.ts
import { RJSFSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface AppState {
  availableSamples: string[];
  error: string | null;
  fetchSample: (sampleName: string) => Promise<void>;
  fetchSamples: () => Promise<void>;
  formData: object;
  label: string;
  loading: boolean;
  resetState: () => void;
  schema: JSONSchema7 | RJSFSchema;
  setLabel: (label: string) => void;
  uiSchema: object;
  updateFormData: (formData: object) => void;
  updateSchema: (schema: JSONSchema7 | RJSFSchema) => void;
  updateUiSchema: (uiSchema: object) => void;
}