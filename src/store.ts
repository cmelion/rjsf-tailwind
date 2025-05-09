// src/store.ts
import { RJSFSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import { create } from "zustand";
import { AppState } from "./types/store";
import { getSamplesList, getSampleByName } from "./api";
import { templateComponents } from "@/templates";
import testData from './samples/testData'

// List of UI keys that should be mapped to template components
const templateKeys = ["ui:ObjectFieldTemplate", "ui:field", "ui:ArrayFieldTemplate", "ui:widget"];

// Process schema to handle large enums
function processSchema(schema: any): any {
  if (!schema || typeof schema !== 'object') return schema;

  // Create a deep copy to avoid modifying the original
  const result = JSON.parse(JSON.stringify(schema));

  // Process definitions for large enums
  if (result.definitions) {
    Object.keys(result.definitions).forEach(key => {
      const def = result.definitions[key];
      if (def.type === 'string' && def.enumSize && typeof def.enumSize === 'number') {
        // Generate the enum values
        def.enum = Array.from({ length: def.enumSize }, (_, i) => `option #${i}`);
        // Remove the marker
        delete def.enumSize;
      }
    });
  }

  // Process other properties recursively
  Object.keys(result).forEach(key => {
    if (result[key] && typeof result[key] === 'object') {
      result[key] = processSchema(result[key]);
    }
  });

  return result;
}

// Helper function to recursively process uiSchema and replace string references with components
function processUiSchema(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;

  // Create a copy to modify
  const result = Array.isArray(obj) ? [...obj] : {...obj};

  // Process all properties
  for (const key of Object.keys(result)) {
    if (templateKeys.includes(key) && typeof result[key] === 'string') {
      const componentName = result[key];
      if (componentName in templateComponents) {
        // Replace string reference with actual component
        result[key] = templateComponents[componentName];
      }
    } else if (result[key] && typeof result[key] === 'object') {
      // Recursively process nested objects
      result[key] = processUiSchema(result[key]);
    }
  }

  return result;
}

export const useStore = create<AppState>((set, get) => ({
  schema: testData.schema as JSONSchema7 | RJSFSchema,
  uiSchema: testData.uiSchema,
  formData: testData.formData,
  label: "Test Data",
  loading: false,
  error: null,
  availableSamples: [],

  // Add a reset method that components can call when mounting
  resetState: () => {
    set({
      schema: testData.schema as JSONSchema7 | RJSFSchema,
      uiSchema: testData.uiSchema,
      formData: testData.formData,
      label: "Test Data",  // Reset the label to avoid conflicts
      error: null,
      loading: false
    });
  },

  fetchSamples: async () => {
    if (get().availableSamples.length > 0 || get().loading) {
      return;
    }

    try {
      set({ loading: true, error: null });
      const samplesList = await getSamplesList();

      set({
        availableSamples: samplesList,
        loading: false
      });

      if (samplesList.length > 0 && !get().label) {
        const firstSample = samplesList[1];
        set({ label: firstSample });
        get().fetchSample(firstSample);
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  fetchSample: async (sampleName: string) => {
    try {
      // Set loading state to true
      set({ loading: true, error: null });

      // Clear previous state completely before loading new data
      // This prevents state bleed between samples
      set({
        schema: {},
        uiSchema: {},
        formData: {}
      });

      // Now fetch and process the new sample
      const sample = await getSampleByName(sampleName);

      // Process schema to handle large enums
      const processedSchema = processSchema(sample.schema);

      // Process uiSchema to replace string references with actual components
      let processedUiSchema = {};
      if (sample.uiSchema && typeof sample.uiSchema === 'object') {
        processedUiSchema = processUiSchema(sample.uiSchema);
      }

      // Set the new state with the processed data
      set({
        schema: processedSchema as JSONSchema7 | RJSFSchema,
        uiSchema: processedUiSchema,
        formData: sample.formData || {},
        loading: false
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  setLabel: (label: string) => {
    set({ label });
    get().fetchSample(label);
  },

  updateSchema: (schema: JSONSchema7 | RJSFSchema) => {
    set({ schema });
  },

  updateUiSchema: (uiSchema: object) => {
    set({ uiSchema });
  },

  updateFormData: (formData: object) => {
    set({ formData });
  }
}));