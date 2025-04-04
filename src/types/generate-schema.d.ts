// src/types/generate-schema.d.ts

declare module 'generate-schema' {
  interface GenerateSchema {
    json(title: string, data: any): any;
    mongoose(data: any): any;
    sql(data: any, tableName?: string): any;
    bigquery(data: any): any;
  }

  const generateSchema: GenerateSchema;
  export default generateSchema;
}