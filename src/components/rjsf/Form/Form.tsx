import { FormProps, withTheme } from "@rjsf/core"
import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema
} from "@rjsf/utils"
import { ComponentType, FormEvent } from "react"
import { generateTheme } from "../theme"

/**
 * Custom interface for form change events.
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
 * Generates a themed React JSON Schema form component
 */
export function generateForm<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): ComponentType<FormProps<T, S, F>> {
  return withTheme<T, S, F>(generateTheme<T, S, F>())
}

// Create the default form instance
const Form = generateForm();
export default Form;