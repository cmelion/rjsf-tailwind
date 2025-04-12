import { FormProps, withTheme } from "@rjsf/core"
import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema
} from "@rjsf/utils"
import { ComponentType, FormEvent } from "react"
import { generateTheme } from "../Theme"

/**
 * Custom interface for form change events.
 * This matches the structure that RJSF forms use internally.
 */
export interface IChangeEvent<T = any, S = RJSFSchema> {
  edit: boolean;
  formData: T;
  schema: S;
  uiSchema?: any;
  errorSchema?: any;
  idSchema?: any;
  status?: string;
}

/**
 * Type definition for form change event handlers.
 */
export type FormChangeHandler<T = any> = (
  event: IChangeEvent<T>,
  formEvent?: FormEvent<any>
) => void;

/**
 * Generates a themed React JSON Schema Form component
 *
 * This function uses generics to provide type safety:
 * - T: The type of form data (defaults to any)
 * - S: The schema type (must extend StrictRJSFSchema, defaults to RJSFSchema)
 * - F: The form context type (defaults to any)
 *
 * @returns A React component that renders a themed JSON Schema form
 */
export function generateForm<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): ComponentType<FormProps<T, S, F>> {
  return withTheme<T, S, F>(generateTheme<T, S, F>())
}

export default generateForm()
