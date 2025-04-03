// src/types/store.ts
import { RJSFSchema } from "@rjsf/utils"
import { JSONSchema7 } from "json-schema"

export interface AppState {
  schema: JSONSchema7 | RJSFSchema
  uiSchema: object
  formData: object
  label: string
  loading: boolean
  error: string | null
  availableSamples: string[]
  setLabel: (label: string) => void
  fetchSamples: () => Promise<void>
  fetchSample: (sampleName: string) => Promise<void>
}