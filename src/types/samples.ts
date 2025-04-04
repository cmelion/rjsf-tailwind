// src/types/samples.ts
export interface Sample {
  schema: any;
  uiSchema?: any; // Make this optional
  formData?: any; // Make this optional
}

export type SamplesCollection = {
  [key: string]: Sample;
}
