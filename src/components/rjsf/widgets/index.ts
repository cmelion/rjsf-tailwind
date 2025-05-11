import CheckboxWidget from "./CheckboxWidget.tsx"
import CheckboxesWidget from "./CheckboxesWidget.tsx"
import RadioWidget from "./RadioWidget.tsx"
import RangeWidget from "./RangeWidget.tsx"
import SelectWidget from "./SelectWidget.tsx"
import TextareaWidget from "./TextareaWidget.tsx"
import {
  FormContextType,
  RegistryWidgetsType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils"

export function generateWidgets<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any
>(): RegistryWidgetsType<T, S, F> {
  return {
    CheckboxWidget,
    CheckboxesWidget,
    RadioWidget,
    RangeWidget,
    SelectWidget,
    TextareaWidget,
  }
}

export default generateWidgets()
