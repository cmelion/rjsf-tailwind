import ArrayFieldItemTemplate from "./ArrayFieldItemTemplate"
import ArrayFieldTemplate from "./ArrayFieldTemplate"
import BaseInputTemplate from "./BaseInputTemplate.tsx"
import ErrorList from "../error-list"
import {
  AddButton,
  CopyButton,
  MoveDownButton,
  MoveUpButton,
  RemoveButton,
  SubmitButton,
} from "../buttons"
import FieldErrorTemplate from "./FieldErrorTemplate"
import FieldHelpTemplate from "./FieldHelpTemplate"
import FieldTemplate from "./FieldTemplate"
import ObjectFieldTemplate from "./ObjectFieldTemplate"
import { DescriptionField, TitleField } from "../fields"
import WrapIfAdditionalTemplate from "./WrapIfAdditionalTemplate"
import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TemplatesType,
} from "@rjsf/utils"

export function generateTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): Partial<TemplatesType<T, S, F>> {
  return {
    ArrayFieldItemTemplate,
    ArrayFieldTemplate,
    BaseInputTemplate,
    ButtonTemplates: {
      AddButton,
      CopyButton,
      MoveDownButton,
      MoveUpButton,
      RemoveButton,
      SubmitButton,
    },
    DescriptionFieldTemplate: DescriptionField,
    ErrorListTemplate: ErrorList,
    FieldErrorTemplate,
    FieldHelpTemplate,
    FieldTemplate,
    ObjectFieldTemplate,
    TitleFieldTemplate: TitleField,
    WrapIfAdditionalTemplate,
  }
}

export default generateTemplates()
