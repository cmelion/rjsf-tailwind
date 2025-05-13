// src/types/json-rules-engine-simplified.d.ts
declare module 'json-rules-engine-simplified' {
  export default class Engine {
    constructor(conditions: Record<string, any>);

    /**
     * Validates formData against the conditions
     * @param formData The data to evaluate against conditions
     * @returns Boolean indicating if validation passed
     */
    validate(formData: any): boolean;
  }
}