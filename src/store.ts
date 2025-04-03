// src/store.ts
import { RJSFSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import { create } from "zustand";
import { AppState } from "./types/store";
import { getSamplesList, getSampleByName } from "./api";

export const useStore = create<AppState>((set, get) => ({
  schema: {} as JSONSchema7 | RJSFSchema,
  uiSchema: {},
  formData: {},
  label: "",
  loading: false,
  error: null,
  availableSamples: [],

  // Fetch list of available samples
  fetchSamples: async () => {
    // If we already have samples, don't fetch again
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

      // If we have samples but no selected sample, select the second one
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

  // Fetch a specific sample by name
  fetchSample: async (sampleName: string) => {
    try {
      set({ loading: true, error: null });
      const sample = await getSampleByName(sampleName);

      set({
        schema: sample.schema as JSONSchema7 | RJSFSchema,
        uiSchema: sample.uiSchema as object,
        formData: sample.formData as object,
        loading: false
      });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },

  // Set the current sample label and fetch the sample data
  setLabel: (label: string) => {
    set({ label });
    get().fetchSample(label);
  }
}));