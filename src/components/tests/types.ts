// src/components/tests/types.ts
import { TableTester } from "@tests/utils/table-testing/types.ts"
import { AriaRole } from "react"
import { ComponentStoryName } from "./utils/story-helpers";

export type TestWorld = {
  component: any
  filterCriteria?: Array<{ placeholder?: string; value: string }>
  formData?: any
  schema?: any
  storyName?: ComponentStoryName // Use the string literal union type
  tableName?: string
  tableRole?: AriaRole
  tableTester?: TableTester
  context?: "component" | "app"
}