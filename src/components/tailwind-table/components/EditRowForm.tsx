import { JSONSchema7 } from "json-schema"
import { RJSFSchema, UiSchema } from "@rjsf/utils"
import TailwindForm from "@/components/rjsf"
import validator from "@rjsf/validator-ajv8"
import { IChangeEvent } from "@/components/rjsf/Form/Form"
import { createElement } from "react"

interface EditRowFormProps {
  schema: JSONSchema7 | RJSFSchema
  uiSchema?: UiSchema
  formData: any
  rowIndex: number
  onRowChange: (index: number, data: any) => void
}

export function EditRowForm({
                              schema,
                              uiSchema,
                              formData,
                              rowIndex,
                              onRowChange,
                            }: EditRowFormProps) {
  // Create strongly typed props
  const formProps = {
    schema: schema as RJSFSchema,
    uiSchema,
    formData,
    validator,
    onChange: (e: IChangeEvent) => {
      onRowChange(rowIndex, e.formData);
    }
  };

  return (
    <div className="rounded border border-border bg-card p-4">
      <h3 className="mb-2 text-lg font-medium">Edit Record</h3>
      {/* Silence type errors with a specific cast when rendering */}
      {createElement(TailwindForm, formProps as any)}
    </div>
  )
}